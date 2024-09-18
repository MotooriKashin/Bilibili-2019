/** av号工具 */
export namespace AV {
    const XOR_CODE = 23442827791579n;
    const MASK_CODE = 2251799813685247n;

    const MAX_AID = 1n << 51n;

    const BASE = 58n;
    const BYTES = ['B', 'V', 1, '', '', '', '', '', '', '', '', ''];
    const BV_LEN = BYTES.length;

    const ALPHABET = 'FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf';
    const DIGIT_MAP = [0, 1, 2, 9, 7, 5, 6, 4, 8, 3, 10, 11];

    /**
     * aid => BV
     * 
     * @example
     * toBV(170001) // BV17x411w7KC
     */
    export function toBV(avid: bigint | number) {
        typeof avid === "bigint" || (avid = BigInt(avid));

        const bytes = Array.from(BYTES);

        let bv_idx = BV_LEN - 1;
        let tmp = (MAX_AID | avid) ^ XOR_CODE;
        while (tmp !== 0n) {
            let table_idx = tmp % BASE;
            bytes[DIGIT_MAP[Number(bv_idx)]] = ALPHABET[Number(table_idx)];
            tmp /= BASE;
            bv_idx -= 1;
        }

        return bytes.join('');
    }

    /**
     * BV => aid
     * 
     * @example
     * fromBV('BV17x411w7KC') // 170001
     * fromBV('17x411w7KC') // 170001
     */
    export function fromBV(bvid: string) {
        if (/^1[FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf]{9}$/.test(bvid)) {
            bvid = 'BV' + bvid;
        }

        let r = 0n;
        for (let i = 3; i < BV_LEN; i++) {
            r = r * BASE + BigInt(ALPHABET.indexOf(bvid[DIGIT_MAP[i]]));
        }

        return `${(r & MASK_CODE) ^ XOR_CODE}`;
    }

    /**
     * 替换文本中所有BV号
     * 
     * @param str 含有BV号的文本
     * @returns 替换为av号的文本
     * @example
     * fromStr('***BV17x411w7KC***') // ***av170001***
     */
    export function fromStr(str: string) {
        return str.replace(/[Bb][Vv]1[FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf]{9}/g, (s: string) => "av" + fromBV(s));
    }
}