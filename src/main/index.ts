import { InitComment } from "./comment/initComment";
import { Av } from "./html/av";
import { Bangumi } from "./html/bangumi";
import { BiliHeader } from "./html/header/BiliHeader";
import { Home } from "./html/home";
import { Toview } from "./html/watchlater";
import { Nano } from "./player/nano";
import "./WebRTC";

switch (location.hostname) {
    case 'www.bilibili.com': {
        switch (true) {
            case /^\/video\/av\d+\/?$/i.test(location.pathname):
            case /^\/video\/bv1[a-z0-9]{9}\/?$/i.test(location.pathname): {
                new Av();
                break;
            }
            case /^\/bangumi\/play\/ss\d+\/?$/i.test(location.pathname):
            case /^\/bangumi\/play\/ep\d+\/?$/i.test(location.pathname): {
                new Bangumi();
                break;
            }
            case location.pathname === '/':
            case location.pathname === '/index.html': {
                new Home();
                break;
            }
            case location.pathname === '/watchlater/':
            case location.pathname === '/medialist/play/watchlater':
            case location.pathname === '/list/watchlater': {
                if (location.hash === '#/list') break;
                new Toview();
                break;
            }
            default: {
                new BiliHeader();
                new Nano();
                new InitComment();
                break;
            }
        }
        break;
    }
    case 'live.bilibili.com': {
        import('./html/live/index');
        break;
    }
    default: {
        new BiliHeader();
        new Nano();
        new InitComment();
        break;
    }
}