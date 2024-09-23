/**
 * 今天过了多少毫秒？  
 * 可作为全局唯一 int32 范围内的整数主键使用
 */
export function msToday() {
    const td = new Date();
    td.setHours(0);
    td.setMinutes(0);
    td.setSeconds(0);
    td.setMilliseconds(0);
    return Date.now() - td.getTime();
}