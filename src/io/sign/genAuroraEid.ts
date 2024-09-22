import { base64 } from "../../utils/base64";

export function genAuroraEid(uid: bigint) {
    if (uid === 0n) return '';
    const encoder = new TextEncoder();
    const bytes = encoder.encode(String(uid));
    const mod = encoder.encode('ad1va46a7lza');
    const res = bytes.map((d, i) => {
        return d ^ mod[i % 12];
    });
    return base64.fromUint8Array(res);
}