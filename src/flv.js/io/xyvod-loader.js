/*
 * Copyright (C) 2017 Shenzhen Onething Technologies Co., Ltd. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Log from '../utils/logger.js';
import { BaseLoader, LoaderStatus, LoaderErrors } from './loader.js';
import { RuntimeException } from '../utils/exception.js';

class XYVODLoader extends BaseLoader {
    static isSupported() {
        try {
            // fetch + stream is broken on Microsoft Edge. Disable before build 15048.
            // see https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8196907/
            // Fixed in Jan 10, 2017. Build 15048+ removed from blacklist.
            let isWorkWellEdge = Browser.msedge && Browser.version.minor >= 15048;
            let browserNotBlacklisted = Browser.msedge ? isWorkWellEdge : true;
            return self.fetch && self.ReadableStream && browserNotBlacklisted;
        } catch (e) {
            return false;
        }
    }

    constructor(seekHandler, config, mediaElement) {
        super('xyvod-loader');

        //console.log('---player constructor');
        this.TAG = 'XLLoader';
        this._seekHandler = seekHandler;
        this._config = config;
        this._needStash = true;
        this._mediaElement = mediaElement;
        this._dataSource = null;

        this._receivedLength = 0;

        this._xyvod = null;
        this._loadInfo = { cdnBytes: 0, p2pBytes: 0 };
        this._backupLoader = null;
    }

    setBackupLoader(backupLoader) {
        this._backupLoader = backupLoader;
        this._backupLoader.onComplete = this._onBackupLoaderComplete.bind(this);
        this._backupLoader.onDataArrival = this._onBackupLoaderLoad.bind(this);
    }

    destroy() {
        this.abort();
        // console.log('---player destroy');
        this._mediaElement = null;
        this._destroyP2pIO();
        this._dataSource = null;
        if (this._backupLoader) {
            this._backupLoader.destroy();
            this._backupLoader = null;
        }
        this._loadInfo = { cdnBytes: 0, p2pBytes: 0 };
        super.destroy();
    }

    open(dataSource, range) {
        // console.log('---player open');
        this._range = range;
        this._receivedLength = 0;
        this.status = LoaderStatus.kConnecting;
        this._dataSource = dataSource;

        if (window.xyflv) {
            let { XYVOD, XYVODEvent } = window.xyflv;
            if (this._xyvod === null) {
                // console.log('---before new XYVOD');
                this._xyvod = new XYVOD({
                    url: dataSource.url,
                    media: this._mediaElement,
                });
                this._xyvod.on(XYVODEvent.DATA, ({ buffer, offset }) => {
                    this._receivedLength += buffer.byteLength;
                    let loadinfo = this._xyvod.info;
                    if (this._onDataArrival) {
                        // console.log('---arrival, offset:', offset);
                        this._onDataArrival(buffer, offset, this._receivedLength, {
                            cdn: loadinfo.cdnBytes - this._loadInfo.cdnBytes,
                            p2p: loadinfo.p2pBytes - this._loadInfo.p2pBytes,
                        });
                        this._loadInfo = loadinfo;
                    }
                });
                this._xyvod.on(XYVODEvent.END, () => {
                    this.status = LoaderStatus.kComplete;
                    if (this._onComplete) {
                        this._onComplete(this._range.from, this._range.from + this._receivedLength - 1);
                    }
                });
                this._xyvod.on(XYVODEvent.ERROR, (error) => {
                    this._onLoaderError();
                });
            }
            try {
                this._xyvod.open(this._range.from);
            } catch (err) {
                Log.e(this.TAG, `xyvod-loader error:${err}`);
                this._backupLoader.open(dataSource, range);
            }
            this.status = LoaderStatus.kBuffering;
        } else {
            this._backupLoader.open(dataSource, range);
        }
        if (this.onStarted) {
            this.onStarted(Date.now());
        }
    }

    abort() {
        if (this.isWorking()) {
            if (this._xyvod) this._xyvod.close();
            this._backupLoader.abort();
            this.status = LoaderStatus.kComplete;
        }
    }

    _onBackupLoaderLoad(chunk, byteStart, receivedLength) {
        this._receivedLength += chunk.byteLength;
        if (this._onDataArrival) {
            this._onDataArrival(chunk, byteStart, this._receivedLength, { backup: chunk.byteLength });
        }
    }

    _onBackupLoaderComplete(from, to) {
        if (this._status === LoaderStatus.kError) {
            // Ignore error response
            return;
        }
        if (this._range && this._status != LoaderStatus.kComplete) {
            this.status = LoaderStatus.kComplete;
            if (this._onComplete) {
                this._onComplete(this._range.from, this._range.from + this._receivedLength - 1);
            }
        }
    }

    _onLoaderError(e) {
        Log.w(this.TAG, 'XYIOError: code-' + String(e));
        this._switchIO();
    }

    _switchIO() {
        this._destroyP2pIO();
        if (this.onNeedStashBuffer) {
            this.onNeedStashBuffer(this._backupLoader.needStashBuffer);
        }
        let backupRange = Object.assign({}, this._range);
        backupRange.from = this._range.from + this._receivedLength;
        this._backupLoader.open(this._dataSource, backupRange);
    }

    _destroyP2pIO() {
        if (this._xyvod) {
            this._xyvod.dispose();
            this._xyvod = null;
        }
    }
}

export default XYVODLoader;
