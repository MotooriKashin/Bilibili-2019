import { crypto } from "./md5";

/** 密码有效秒数 */
const STEP = 30;
/** 生成密码位数 */
const DIGIT = 6;

/** 基于哈希消息认证码的一次性口令 */
export function TOTP() {

    const count = Math.floor((Date.now() / 1000) / STEP);

    const stringArray = crypto.sha1.hmac.raw(__TOTP_KEY__, count.toString()); // HSA1加密

    // Truncate 截断函数
    const offset = stringArray[19] & 15; // 选取最后一个字节的低字节位4位的整数值作为偏移量
    // 从指定偏移位开始，连续截取 4 个字节（32 位），最后返回 32 位中的后面 31 位
    const p = (stringArray[offset] & 127) << 24 |
        (stringArray[offset + 1] & 255) << 16 |
        (stringArray[offset + 2] & 255) << 8 |
        (stringArray[offset + 3] & 255);
    const result = (p % Math.pow(10, DIGIT)).toString();

    return result;
}

//////////////////////////// 全局增强 ////////////////////////////
declare global {
    /** 基于哈希消息认证码的一次性口令的密钥 */
    const __TOTP_KEY__: string;
}