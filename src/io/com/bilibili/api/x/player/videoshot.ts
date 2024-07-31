import { Api } from "../..";
import { https } from "../../../../../../utils/https";

export async function videoshot(
    cid: number,
    aid: number,
) {
    const url = new URL(Api + '/x/player/videoshot');
    url.searchParams.set('cid', <any>cid);
    url.searchParams.set('aid', <any>aid);
    const response = await fetch(url, { credentials: 'include' });
    const res = (await response.json()).data;
    return new Promise(async (resolve: (value: IPvData) => void, reject) => {
        if (res.pvdata) {
            const d = await videoShotIndex(res.pvdata);
            if (res.image) {
                if (res.img_x_size && res.img_y_size) {
                    resolve({
                        pv_img: res.image,
                        pv_x_len: res.img_x_len,
                        pv_y_len: res.img_y_len,
                        pv_x_size: res.img_x_size,
                        pv_y_size: res.img_y_size,
                        pv_index: d
                    });
                } else {
                    // 接口不提供缩略图大小，通过图片总大小求取
                    let i = 0;
                    const img = new Image();
                    img.setAttribute("crossOrigin", "anonymous");
                    img.src = res.image[i];
                    img.addEventListener('load', () => {
                        res.img_x_size = img.width / res.img_x_len;
                        res.img_y_size = img.height / res.img_y_len;
                        resolve({
                            pv_img: res.image,
                            pv_x_len: res.img_x_len,
                            pv_y_len: res.img_y_len,
                            pv_x_size: res.img_x_size,
                            pv_y_size: res.img_y_size,
                            pv_index: d
                        });
                    });
                    img.addEventListener('error', () => {
                        const src = res.image[++i];
                        src && (img.src = src);
                    });
                }
            } else {
                reject(res);
            }
        } else {
            reject(res);
        }
    })
}

async function videoShotIndex(url: string) {
    const response = await fetch(https(url));
    const buffer = await response.arrayBuffer();
    const dataview = new DataView(buffer);
    const uint = new Uint8Array(buffer.byteLength);
    const indexList: number[] = [];
    for (let i = 0; i < uint.length; i += 2) {
        const high = dataview.getUint8(i) << 8;
        const low = dataview.getUint8(i + 1);
        const index = high | low;
        indexList.push(index);
    }
    return indexList
}

interface IPvData {
    pv_img: string[];
    pv_x_len: number;
    pv_y_len: number;
    pv_x_size: number;
    pv_y_size: number;
    pv_index: number[];
}