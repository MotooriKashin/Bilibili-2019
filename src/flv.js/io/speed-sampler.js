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

import EventEmitter from 'events';
import PlayerEvents from '../player/player-events.js';

// Utility class to calculate realtime network I/O speed
class SpeedSampler {
    constructor() {
        // milliseconds
        this._firstCheckpoint = 0;
        this._lastCheckpoint = 0;
        this._intervalBytes = 0;
        this._totalBytes = 0;
        this._p2pLoadedBytes = 0;
        this._CDNLoadedBytes = 0;
        this._backupLoaderLoadedBytes = 0;
        this._lastSecondBytes = 0;
        this._emitter = new EventEmitter();

        // compatibility detection
        if (self.performance && self.performance.now) {
            this._now = self.performance.now.bind(self.performance);
        } else {
            this._now = Date.now;
        }
    }

    destroy() {
        this._emitter.removeAllListeners();
        this._emitter = null;
    }

    reset() {
        this._emitter.emit(PlayerEvents.HTTP_REQUEST_ENDED, this._totalBytes);
        if (this._CDNLoadedBytes + this._p2pLoadedBytes + this._backupLoaderLoadedBytes > 0)
            this._emitter.emit(
                PlayerEvents.P2P_REQUEST_ENDED,
                this._CDNLoadedBytes,
                this._p2pLoadedBytes,
                this._backupLoaderLoadedBytes,
            );
        this._firstCheckpoint = this._lastCheckpoint = 0;
        this._totalBytes = this._intervalBytes = 0;
        this._lastSecondBytes = 0;
        this._p2pLoadedBytes = 0;
        this._CDNLoadedBytes = 0;
        this._backupLoaderLoadedBytes = 0;
    }

    addBytes(bytes, p2pLoadInfo) {
        if (this._firstCheckpoint === 0) {
            this._firstCheckpoint = this._now();
            this._lastCheckpoint = this._firstCheckpoint;
            this._intervalBytes += bytes;
            this._totalBytes += bytes;
        } else if (this._now() - this._lastCheckpoint < 1000) {
            this._intervalBytes += bytes;
            this._totalBytes += bytes;
        } else {
            // duration >= 1000
            this._lastSecondBytes = this._intervalBytes;
            this._intervalBytes = bytes;
            this._totalBytes += bytes;
            this._lastCheckpoint = this._now();
        }
        if (p2pLoadInfo) {
            this._CDNLoadedBytes += p2pLoadInfo.cdn ? p2pLoadInfo.cdn : 0;
            this._p2pLoadedBytes += p2pLoadInfo.p2p ? p2pLoadInfo.p2p : 0;
            this._backupLoaderLoadedBytes += p2pLoadInfo.backup ? p2pLoadInfo.backup : 0;
        }
    }

    get currentKBps() {
        this.addBytes(0);

        let durationSeconds = (this._now() - this._lastCheckpoint) / 1000;
        if (durationSeconds == 0) durationSeconds = 1;
        return this._intervalBytes / durationSeconds / 1024;
    }

    get lastSecondKBps() {
        this.addBytes(0);

        if (this._lastSecondBytes !== 0) {
            return this._lastSecondBytes / 1024;
        } else {
            // lastSecondBytes === 0
            if (this._now() - this._lastCheckpoint >= 500) {
                // if time interval since last checkpoint has exceeded 500ms
                // the speed is nearly accurate
                return this.currentKBps;
            } else {
                // We don't know
                return 0;
            }
        }
    }

    get averageKBps() {
        let durationSeconds = (this._now() - this._firstCheckpoint) / 1000;
        return this._totalBytes / durationSeconds / 1024;
    }

    on(event, listener) {
        this._emitter.addListener(event, listener);
    }

    off(event, listener) {
        this._emitter.removeListener(event, listener);
    }
}

export default SpeedSampler;
