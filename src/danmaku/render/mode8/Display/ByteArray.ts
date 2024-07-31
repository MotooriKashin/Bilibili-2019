export class ByteArray extends Array<number>{

    private $readPosition = 0;

    get bytesAvailable() {
        return this.length - this.$readPosition;
    }

    get position() {
        return this.$readPosition;
    }

    set position(p: number) {
        this.$readPosition = p;
    }

    constructor(...params: number[]) {
        super(...params);
        try {
            Object['setPrototypeOf'](this, ByteArray.prototype);
        } catch (e) { }
    }

    clear() {
        this.length = 0;
        this.$readPosition = 0;
    }

    /** @deprecated */
    compress(algorithm = 'zlib') {
        this.$readPosition = 0;
    }

    /** @deprecated */
    uncompress(algorithm = 'zlib') {
        this.$readPosition = 0;
    }

    /** @deprecated */
    deflate() { }

    /** @deprecated */
    inflate() { }

    readUTFBytes(length: number) {
        const subArray = this.slice(this.$readPosition, length);
        this.$readPosition += Math.min(length, this.length - this.$readPosition);

        return subArray.reduce((s, d) => {
            s += String.fromCharCode(d);
            return s;
        }, '');
    }

    readUnsignedByte() {
        return this[this.$readPosition] & 0xff;
    }

    readUnsignedShort() {
        const top = this.readUnsignedByte(),
            bottom = this.readUnsignedByte();
        return ((top << 8) + bottom) & 0xffff;
    }

    readUnsignedInt() {
        const a = this.readUnsignedByte(),
            b = this.readUnsignedByte(),
            c = this.readUnsignedByte(),
            d = this.readUnsignedByte();
        return ((a << 24) + (b << 16) + (c << 8) + d) & 0xffffffff;
    }

    readByte() {
        return this.readUnsignedByte() - 128;
    }

    readShort() {
        return this.readUnsignedShort() - 0x7fff;
    }

    readBoolean() {
        return this.readUnsignedByte() !== 0;
    }

    readFloat() {
        const source = this.readUnsignedInt();
        let x = (source & 0x80000000) ? -1 : 1;
        let m = ((source >> 23) & 0xff);
        const s = (source & 0x7fffff);
        switch (x) {
            case 0:
                break;
            case 0xFF:
                if (m) {
                    return NaN;
                } else if (s > 0) {
                    return Number.POSITIVE_INFINITY;
                } else {
                    return Number.NEGATIVE_INFINITY;
                }
            default:
                x -= 127;
                m += 0x800000;
                return s * (m / 8388608.0) * Math.pow(2, x);
        }
    }

    writeByte(value: number) {
        this.push(value & 0xff);
    }

    writeBytes(bytes: number[], offset = 0, length = 0) {
        for (let i = offset; i < Math.min(bytes.length - offset, length); i++) {
            this.writeByte(bytes[i]);
        }
    }

    writeUTFBytes(value: string) {
        const bytesString = unescape(encodeURIComponent(value));
        for (let i = 0; i < value.length; i++) {
            this.push(bytesString.charCodeAt(i));
        }
    }

    clone() {
        const cloned = new ByteArray();
        this.forEach(function (item) { cloned.push(item) });
        return cloned;
    }
}