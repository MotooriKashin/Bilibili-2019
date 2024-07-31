export class Sound {

    #sound: HTMLAudioElement;

    constructor(name: string, onload?: (ev: Event) => void) {
        const url = `//i2.hdslb.com/soundlib/${name}.mp3`;
        this.#sound = new Audio(url);
        onload && this.#sound.addEventListener('load', onload);
    }

    loadPercent() {
        return Math.floor(this.#sound.buffered.end(0) / this.#sound.duration);
    }

    play(startTime: number, loops: number) {
        startTime && (this.#sound.currentTime = startTime / 1000);
        this.#sound.play();
    }

    stop() {
        this.#sound.currentTime = this.#sound.duration;
    }

    remove() {
        this.#sound.remove();
    }
}