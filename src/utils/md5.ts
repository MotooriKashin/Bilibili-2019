/** 低级加密原语 */
export namespace crypto {
    const hexcase = 0;
    const b64pad = "";
    const chrsz = 8;

    function safe_add(x: number, y: number) {
        const lsw = (x & 0xFFFF) + (y & 0xFFFF);
        const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF)
    }

    export namespace sha1 {

        /**
         * 
         * @param key 密钥
         * @param data 待签名数据
         * @returns 16进制字符串
         */
        export function toHex(s: string) {
            return binb2hex(raw(str2binb(s), s.length * chrsz))
        }

        /**
         * 
         * @param key 密钥
         * @param data 待签名数据
         * @returns Base64进制字符串
         */
        export function toBase64(s: string) {
            return binb2b64(raw(str2binb(s), s.length * chrsz))
        }

        /**
         * 
         * @param key 密钥
         * @param data 待签名数据
         * @returns 原始字符串
         */
        export function toString(s: string) {
            return binb2str(raw(str2binb(s), s.length * chrsz))
        }

        /**
         * 密钥散列消息认证码
         * @see RFC 2104 {@link https://www.ietf.org/rfc/rfc2104.txt}
         */
        export namespace hmac {

            /**
             * 
             * @param key 密钥
             * @param data 待签名数据
             * @returns 16进制字符串
             */
            export function toHex(key: string, data: string) {
                return binb2hex(raw(key, data))
            }

            /**
             * 
             * @param key 密钥
             * @param data 待签名数据
             * @returns Base64进制字符串
             */
            export function toBase64(key: string, data: string) {
                return binb2b64(raw(key, data))
            }

            /**
             * 
             * @param key 密钥
             * @param data 待签名数据
             * @returns 原始字符串
             */
            export function toString(key: string, data: string) {
                return binb2str(raw(key, data))
            }

            /**
             * 
             * @param key 密钥
             * @param data 待签名数据
             * @returns 原始数组
             */
            export function raw(key: string, data: string) {
                let bkey = str2binb(key);
                if (bkey.length > 16)
                    bkey = sha1.raw(bkey, key.length * chrsz);
                const ipad = Array(16),
                    opad = Array(16);
                for (let i = 0; i < 16; i++) {
                    ipad[i] = bkey[i] ^ 0x36363636;
                    opad[i] = bkey[i] ^ 0x5C5C5C5C
                }
                const hash = sha1.raw(ipad.concat(str2binb(data)), 512 + data.length * chrsz);
                return sha1.raw(opad.concat(hash), 512 + 160)
            }
        }

        /**
         * 
         * @param key 密钥
         * @param data 待签名数据
         * @returns 原始数组
         */
        export function raw(x: number[], len: number) {
            x[len >> 5] |= 0x80 << (24 - len % 32);
            x[((len + 64 >> 9) << 4) + 15] = len;
            const w = Array(80);
            let a = 1732584193;
            let b = -271733879;
            let c = -1732584194;
            let d = 271733878;
            let e = -1009589776;
            for (let i = 0; i < x.length; i += 16) {
                const olda = a;
                const oldb = b;
                const oldc = c;
                const oldd = d;
                const olde = e;
                for (let j = 0; j < 80; j++) {
                    if (j < 16)
                        w[j] = x[i + j];
                    else
                        w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
                    const t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
                    e = d;
                    d = c;
                    c = rol(b, 30);
                    b = a;
                    a = t
                }
                a = safe_add(a, olda);
                b = safe_add(b, oldb);
                c = safe_add(c, oldc);
                d = safe_add(d, oldd);
                e = safe_add(e, olde)
            }
            return Array(a, b, c, d, e)
        }

        function sha1_ft(t: number, b: number, c: number, d: number) {
            if (t < 20)
                return (b & c) | ((~b) & d);
            if (t < 40)
                return b ^ c ^ d;
            if (t < 60)
                return (b & c) | (b & d) | (c & d);
            return b ^ c ^ d
        }

        function sha1_kt(t: number) {
            return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514
        }

        function rol(num: number, cnt: number) {
            return (num << cnt) | (num >>> (32 - cnt))
        }

        function str2binb(str: string) {
            const bin: number[] = [];
            const mask = (1 << chrsz) - 1;
            for (let i = 0; i < str.length * chrsz; i += chrsz)
                bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (32 - chrsz - i % 32);
            return bin
        }

        function binb2str(bin: number[]) {
            let str = "";
            const mask = (1 << chrsz) - 1;
            for (let i = 0; i < bin.length * 32; i += chrsz)
                str += String.fromCharCode((bin[i >> 5] >>> (32 - chrsz - i % 32)) & mask);
            return str
        }

        function binb2hex(binarray: number[]) {
            const hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
            let str = "";
            for (let i = 0; i < binarray.length * 4; i++) {
                str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF)
            }
            return str
        }

        function binb2b64(binarray: number[]) {
            const tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            let str = "";
            for (let i = 0; i < binarray.length * 4; i += 3) {
                const triplet = (((binarray[i >> 2] >> 8 * (3 - i % 4)) & 0xFF) << 16) | (((binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8) | ((binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 0xFF);
                for (let j = 0; j < 4; j++) {
                    if (i * 8 + j * 6 > binarray.length * 32)
                        str += b64pad;
                    else
                        str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F)
                }
            }
            return str
        }
    }
    export namespace md5 {

        /**
         * 
         * @param key 密钥
         * @param data 待签名数据
         * @returns 16进制字符串
         */
        export function toHex(s: string) {
            return binl2hex(raw(str2binl(s), s.length * chrsz))
        }

        /**
         * 
         * @param key 密钥
         * @param data 待签名数据
         * @returns Base64进制字符串
         */
        export function toBase64(s: string) {
            return binl2b64(raw(str2binl(s), s.length * chrsz))
        }

        /**
         * 
         * @param key 密钥
         * @param data 待签名数据
         * @returns 原始字符串
         */
        export function toString(s: string) {
            return binl2str(raw(str2binl(s), s.length * chrsz))
        }

        /**
         * 密钥散列消息认证码
         * @see RFC 2104 {@link https://www.ietf.org/rfc/rfc2104.txt}
         */
        export namespace hmac {

            /**
             * 
             * @param key 密钥
             * @param data 待签名数据
             * @returns Base64进制字符串
             */
            export function toHex(key: string, data: string) {
                return binl2hex(raw(key, data))
            }

            /**
             * 
             * @param key 密钥
             * @param data 待签名数据
             * @returns Base64进制字符串
             */
            export function toBase64(key: string, data: string) {
                return binl2b64(raw(key, data))
            }

            /**
             * 
             * @param key 密钥
             * @param data 待签名数据
             * @returns 原始字符串
             */
            export function toString(key: string, data: string) {
                return binl2str(raw(key, data))
            }

            /**
             * 
             * @param key 密钥
             * @param data 待签名数据
             * @returns 原始数组
             */
            export function raw(key: string, data: string) {
                let bkey = str2binl(key);
                if (bkey.length > 16)
                    bkey = md5.raw(bkey, key.length * chrsz);
                const ipad = Array(16),
                    opad = Array(16);
                for (let i = 0; i < 16; i++) {
                    ipad[i] = bkey[i] ^ 0x36363636;
                    opad[i] = bkey[i] ^ 0x5C5C5C5C
                }
                const hash = md5.raw(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
                return md5.raw(opad.concat(hash), 512 + 128)
            }
        }

        /**
         * 
         * @param key 密钥
         * @param data 待签名数据
         * @returns 原始数组
         */
        export function raw(x: number[], len: number) {
            x[len >> 5] |= 0x80 << ((len) % 32);
            x[(((len + 64) >>> 9) << 4) + 14] = len;
            let a = 1732584193;
            let b = -271733879;
            let c = -1732584194;
            let d = 271733878;
            for (let i = 0; i < x.length; i += 16) {
                const olda = a;
                const oldb = b;
                const oldc = c;
                const oldd = d;
                a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
                d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
                c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
                b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
                a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
                d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
                c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
                b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
                a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
                d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
                c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
                b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
                a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
                d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
                c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
                b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
                a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
                d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
                c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
                b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
                a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
                d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
                c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
                b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
                a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
                d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
                c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
                b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
                a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
                d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
                c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
                b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
                a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
                d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
                c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
                b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
                a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
                d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
                c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
                b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
                a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
                d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
                c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
                b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
                a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
                d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
                c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
                b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
                a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
                d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
                c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
                b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
                a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
                d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
                c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
                b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
                a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
                d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
                c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
                b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
                a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
                d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
                c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
                b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
                a = safe_add(a, olda);
                b = safe_add(b, oldb);
                c = safe_add(c, oldc);
                d = safe_add(d, oldd)
            }
            return Array(a, b, c, d)
        }

        function md5_cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
            return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b)
        }

        function md5_ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
            return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t)
        }

        function md5_gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
            return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t)
        }

        function md5_hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
            return md5_cmn(b ^ c ^ d, a, b, x, s, t)
        }

        function md5_ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
            return md5_cmn(c ^ (b | (~d)), a, b, x, s, t)
        }

        function bit_rol(num: number, cnt: number) {
            return (num << cnt) | (num >>> (32 - cnt))
        }

        function str2binl(str: string) {
            const bin: number[] = [];
            const mask = (1 << chrsz) - 1;
            for (let i = 0; i < str.length * chrsz; i += chrsz)
                bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32);
            return bin
        }

        function binl2str(bin: number[]) {
            let str = "";
            const mask = (1 << chrsz) - 1;
            for (let i = 0; i < bin.length * 32; i += chrsz)
                str += String.fromCharCode((bin[i >> 5] >>> (i % 32)) & mask);
            return str
        }

        function binl2hex(binarray: number[]) {
            const hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
            let str = "";
            for (let i = 0; i < binarray.length * 4; i++) {
                str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF)
            }
            return str
        }

        function binl2b64(binarray: number[]) {
            const tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            let str = "";
            for (let i = 0; i < binarray.length * 4; i += 3) {
                const triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 0xFF) << 16) | (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 0xFF) << 8) | ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 0xFF);
                for (let j = 0; j < 4; j++) {
                    if (i * 8 + j * 6 > binarray.length * 32)
                        str += b64pad;
                    else
                        str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F)
                }
            }
            return str
        }
    }
}