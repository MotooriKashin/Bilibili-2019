/*
 * Copyright (C) 2016 Bilibili. All Rights Reserved.
 *
 * @author tqr
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

class Utils {
    static cloneDeep(obj, deep) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        let target;

        if (Utils.isTypedArray(obj) && typeof obj.slice === 'function') {
            target = obj.slice();
            return target;
        }

        target = Array.isArray(obj) ? [] : {};
        for (const name in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, name)) {
                const value = obj[name];
                if (deep) {
                    if (typeof value === 'object') {
                        target[name] = this.cloneDeep(value, deep);
                    } else {
                        target[name] = value;
                    }
                } else {
                    target[name] = value;
                }
            }
        }
        return target;
    }

    static isTypedArray(obj) {
        return !!(obj && obj.buffer instanceof ArrayBuffer && obj.BYTES_PER_ELEMENT);
    }

    static downloadFile(fileName, contentOrPath) {
        let aLink = document.createElement('a'),
            isData = contentOrPath.slice && contentOrPath.slice(0, 5) === 'data:',
            isPath = contentOrPath.lastIndexOf && contentOrPath.lastIndexOf('.') > -1;

        aLink.download = fileName;
        aLink.style.display = 'none';

        aLink.href = isPath || isData ? contentOrPath : URL.createObjectURL(new Blob([contentOrPath]));
        document.body.appendChild(aLink);
        aLink.click();
        document.body.removeChild(aLink);
    }

    static concatArrayBuffer(buffer1, buffer2) {
        if (!buffer1) {
            return buffer2;
        } else if (!buffer2) {
            return buffer1;
        }

        let tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
        tmp.set(new Uint8Array(buffer1), 0);
        tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
        return tmp.buffer;
    }

    static concatUint8Array(array1, array2) {
        if (!array1) {
            return array2;
        } else if (!array2) {
            return array1;
        }

        let tmp = new Uint8Array(array1.byteLength + array2.byteLength);
        tmp.set(array1, 0);
        tmp.set(array2, array1.byteLength);
        return tmp;
    }
}

export default Utils;
