export class Label {

    address: any;

    isExists!: boolean;

    constructor() {
        this.initialize();
    }

    initialize() {
        this.address = null;
        this.isExists = false;
    }

    commitAddress(param1: any) {
        this.address = param1;
        this.isExists = true;
    }
}