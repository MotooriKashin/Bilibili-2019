import { Player } from "../player";
import { toastr } from "../toastr";
import stylesheet from "./index.css" with {type: 'css'};

document.adoptedStyleSheets = [stylesheet];

const player = new Player();
player.classList.add('bilibili-player');

document.body.querySelector('.player-box')?.appendChild(player);

const toast = toastr.info(
    '欢迎使用 Bilibili-2019 核心播放器~',
    '您可以点击播放器右上角三点【加载文件】来作为离线播放器使用',
    '格式支持：',
    '视频：.mp4',
    '弹幕：.xml .json',
    '字幕：.vtt',
);
toast.$delay = 60;