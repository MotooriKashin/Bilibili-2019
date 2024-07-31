/*
 * Copyright (C) 2016 Bilibili. All Rights Reserved.
 *
 * @author zheng qian <xqq@xqq.im>
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
// Quick Fix
// Be Careful: We don't provide any node.js modules
// You MUST install these modules manually
import { Buffer } from 'buffer';
//import YFCloudIO from '@bilibili-player/component.yfcloudio';

// For FLV over WebSocket live stream
class YFLoader extends BaseLoader {
    static isSupported() {
        return true;
    }

    constructor(seekHandler, config, mediaElement, bNewSlice) {
        super('yf-loader');
        this.TAG = 'YFLoader';
        this._requestAbort = false;
        this._receivedLength = 0;
        this._needStash = false;
        this._p2pIO = null;
        this._dataSource = null;
        this._mediaElement = mediaElement;
        this._bNewSlice = bNewSlice ? bNewSlice : false;
        this._loadInfo = { cdnloaded: 0, scdnloaded: 0 };
        this._stashSize = 0;
        this._backupLoader = null;
        this._noResource = false;
    }

    setBackupLoader(backupLoader) {
        this._backupLoader = backupLoader;
        this._backupLoader.onComplete = this._onBackupLoaderComplete.bind(this);
        this._backupLoader.onDataArrival = this._onBackupLoaderLoad.bind(this);
    }

    destroy() {
        this.abort();
        this._destroyP2pIO();
        this._backupLoader.destroy();
        this._backupLoader = null;
        this._dataSource = null;
        this._mediaElement = null;
        this._loadInfo = { cdnloaded: 0, scdnloaded: 0 };
        this._stashSize = 0;
        this._noResource = false;
        this._bNewSlice = false;
        super.destroy();
    }

    open(dataSource, range) {
        this._dataSource = dataSource;
        try {
            this._range = range;
            // seek
            if (this._p2pIO) {
                this._destroyP2pIO();
            }
            if (window.YFCloudIO && !this._noResource) {
                this._createP2pIO();
                //this._p2pConfig.domain = dataSource.url.match(/\/?([a-zA-Z0-9.-]+)\//)[1];
                this._p2pConfig.domain = 'upos-hz-mirrorks3u.acgvideo.com';
                this._p2pIO.init(this._mediaElement, dataSource.url, this._p2pConfig);
                this._p2pIO.load(range, this._bNewSlice, this._stashSize);
            } else {
                if (this.onNeedStashBuffer) {
                    this.onNeedStashBuffer(this._backupLoader.needStashBuffer);
                }
                this._backupLoader.open(this._dataSource, range);
            }
            this.status = LoaderStatus.kConnecting;
            if (this.onStarted) {
                this.onStarted(Date.now());
            }
        } catch (e) {
            this.status = LoaderStatus.kError;
            let info = { code: e.code, msg: e.message };
            if (this._onError) {
                this._onError(LoaderErrors.EXCEPTION, info);
            } else {
                throw new RuntimeException(info.msg);
            }
        }
    }

    abort() {
        let p2pIO = this._p2pIO;
        if (p2pIO && this._requestAbort == false) {
            // CONNECTING
            p2pIO.pause();
        }
        this._backupLoader.abort();
        this._requestAbort = true;
        // this._loadInfo = { cdnloaded: 0, scdnloaded: 0 };
        this.status = LoaderStatus.kComplete;
    }

    resume(range) {
        if (this._p2pIO) {
            this._requestAbort = false;
            this._p2pIO.seek(range);
            this.status = LoaderStatus.kConnecting;
            if (this.onStarted) {
                this.onStarted(Date.now());
            }
        }
    }

    setStashSize(stashSize) {
        if (this._stashSize === stashSize) {
            return;
        }
        this._stashSize = stashSize;
        if (this._p2pIO) {
            this._p2pIO.setThreshold(this._stashSize);
        }
    }

    get noResource() {
        return this._noResource;
    }

    set noResource(noResource) {
        this._noResource = noResource;
    }

    useP2pIO() {
        return this._p2pIO != null;
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

    _createP2pIO() {
        // Log.w(this.TAG, 'create p2pio');
        let YFCloudIO = window.YFCloudIO;
        this._p2pIO = new YFCloudIO();
        this._p2pIO.onLoadError = this._onLoaderError.bind(this);
        this._p2pIO.onDataArrive = this._onLoad.bind(this);
        this._p2pIO.onIOComplete = this._onLoaderComplete.bind(this);
        this._p2pIO.noResources = this._onNoResources.bind(this);
        if (this.onURLRedirect) {
            this._p2pIO.onURLRedirect = this.onURLRedirect.bind(this);
        }
        this._p2pConfig = {
            limitBufferLength: 150,
            taccesskey: 'b0c2a0fef8cf47608ec06008e089b87f3d4a965b',
            tokenid: 'b048975020d226f7bb64eff579a5751f6738367c',
        };
        if (this.onNeedStashBuffer) {
            this.onNeedStashBuffer(false);
        }
    }

    _destroyP2pIO() {
        if (this._p2pIO) {
            // Log.w(this.TAG, 'destroy p2pio');
            this._p2pIO.pause();
            this._p2pIO.destroy();
            this._p2pIO = null;
            this._p2pConfig = null;
        }
    }

    _onLoad(chunk, byteStart) {
        if (this._status === LoaderStatus.kError) {
            // Ignore error response
            return;
        }
        if (this._p2pIO == null) {
            return;
        }
        let data = Buffer.from(chunk).buffer;
        this._receivedLength += data.byteLength;
        let loadinfo = this._p2pIO.loadedInfo();
        //Log.v(this.TAG, 'Load Info:' + JSON.stringify(loadinfo));
        if (this._onDataArrival) {
            this._onDataArrival(data, byteStart, this._receivedLength, {
                cdn: loadinfo.cdnloaded - this._loadInfo.cdnloaded,
                p2p: loadinfo.scdnloaded - this._loadInfo.scdnloaded,
                backup: 0,
            });
            this._loadInfo = loadinfo;
        }
        if (this._noResource && !this._bNewSlice) {
            this._switchIO();
        } else if (this._bNewSlice === true) {
            this._bNewSlice = false;
        }
    }

    _onBackupLoaderLoad(chunk, byteStart, receivedLength) {
        this._receivedLength += chunk.byteLength;
        if (this._onDataArrival) {
            this._onDataArrival(chunk, byteStart, this._receivedLength, { cdn: 0, p2p: 0, backup: chunk.byteLength });
        }
    }

    _onLoaderComplete() {
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
        Log.w(this.TAG, 'YFIOError: code-' + String(e));
        this._switchIO();
    }

    _onNoResources() {
        this._noResource = true;
    }
}

export default YFLoader;
