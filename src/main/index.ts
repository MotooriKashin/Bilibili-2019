// 用户脚本

import { Router, ROUTER } from "./bilibili";
import "./support/index";

const router = new Router();

navigation?.addEventListener('navigate', e => {
    if (e.canIntercept && e.navigationType !== 'reload') {

        const url = new URL(e.destination.url, location.origin);

        if (url.pathname !== location.pathname || url.search !== location.search) {

            switch (url.hostname) {
                case 'www.bilibili.com': {
                    switch (true) {
                        case /^\/video\/av\d+\/?$/i.test(url.pathname):
                        case /^\/video\/bv1[a-z0-9]{9}\/?$/i.test(url.pathname): {
                            // av页面
                            e.intercept({
                                handler() {
                                    return router.navigate(ROUTER.AV, url);
                                }
                            })
                            break;
                        }
                        case /^\/bangumi\/play\/ss\d+\/?$/i.test(url.pathname):
                        case /^\/bangumi\/play\/ep\d+\/?$/i.test(url.pathname): {
                            // Bangumi页面
                            e.intercept({
                                handler() {
                                    return router.navigate(ROUTER.BANGUMI, url);
                                }
                            })
                            break;
                        }
                        case url.pathname === '/':
                        case url.pathname === '/index.html': {
                            // Bangumi页面
                            e.intercept({
                                handler() {
                                    return router.navigate(ROUTER.HOME, url);
                                }
                            })
                            break;
                        }
                        case url.pathname === '/404': {
                            // 禁止404重定向
                            e.intercept({
                                handler() {
                                    return Promise.resolve();
                                }
                            });
                            break;
                        }
                        case url.pathname === '/watchlater/':
                        case url.pathname === '/medialist/play/watchlater':
                        case url.pathname === '/list/watchlater': {
                            // 稍后再看页面
                            if (url.hash === '#/list') break;
                            e.intercept({
                                handler() {
                                    return router.navigate(ROUTER.TOVIEW, url);
                                }
                            })
                            break;
                        }
                        case /^\/list\/ml\d+\/?$/i.test(url.pathname): {
                            // 播放列表页面
                            e.intercept({
                                handler() {
                                    return router.navigate(ROUTER.MEDIALIST, url);
                                }
                            })
                            break;
                        }
                    }
                    break;
                }
            }
        } else if (url.hash !== location.hash && url.pathname === '/watchlater/') {
            // 稍后再看页面
            e.intercept({
                handler() {
                    return router.navigate(ROUTER.TOVIEW, url);
                }
            })
        }
    }
});