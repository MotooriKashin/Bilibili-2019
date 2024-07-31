import { Root } from "protobufjs"
import dm from './json/bilibili.community.service.dm.v1.json';
import broadcast from './json/bilibili.broadcast.v1.json';
import broadcastMessage from './json/bilibili.broadcast.message.main.json';

/** Protobuf Root实例 */
export class ProtobufRoot {

    static #dm: Root;

    static #broadcast: Root;

    static #broadcastMessage: Root;

    /** 弹幕 */
    static get dm() {
        return this.#dm || (this.#dm = Root.fromJSON(dm));
    }

    /** broadcast */
    static get broadcast() {
        return this.#broadcast || (this.#broadcast = Root.fromJSON(broadcast));
    }

    /** broadcast Message */
    static get broadcastMessage() {
        return this.#broadcastMessage || (this.#broadcastMessage = Root.fromJSON(broadcastMessage));
    }
}