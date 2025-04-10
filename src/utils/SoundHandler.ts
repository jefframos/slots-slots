import { Howl } from "howler";

type SoundOptions = {
    loop?: boolean;
    volume?: number;
    rate?: number;
};

export class SoundHandler {
    private static _instance: SoundHandler;
    private sounds: Map<string, { sound: Howl, src: string }> = new Map();
    private playingSounds: Set<string> = new Set();
    private playingMusic: Set<string> = new Set();

    private constructor() { }

    public static get instance(): SoundHandler {
        if (!SoundHandler._instance) {
            SoundHandler._instance = new SoundHandler();
        }
        return SoundHandler._instance;
    }

    public getCopy(alias: string): Howl | undefined {
        const original = this.sounds.get(alias);
        if (!original) {
            console.warn(`Sound not found: ${alias}`);
            return undefined;
        }

        return new Howl({
            src: original.src,
        });
    }
    public async add(alias: string, url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const sound = new Howl({
                src: [url],
                onload: () => {
                    this.sounds.set(alias, { src: url, sound });
                    console.log(`Sound added: ${alias} from ${url}`);
                    resolve();
                },
                onloaderror: (_, err) => {
                    console.error(`Failed to load sound: ${alias}`, err);
                    reject(err);
                },
            });
        });
    }

    public play(alias: string, options: SoundOptions = {}): Howl | undefined {
        const sound = this.sounds.get(alias)?.sound;
        if (!sound) {
            console.warn(`Sound not found: ${alias}`);
            return;
        }

        const id = sound.play();
        sound.loop(options.loop ?? false, id);
        sound.volume(options.volume ?? 1, id);
        sound.rate(options.rate ?? 1, id);

        this.playingSounds.add(alias);
        sound.once("end", () => {
            this.playingSounds.delete(alias);
        });

        return sound;
    }

    public playUnique(alias: string, options: SoundOptions = {}): void {
        if (this.playingSounds.has(alias)) {
            return;
        }
        this.play(alias, options);
    }

    public playMusic(alias: string, options: SoundOptions = {}): void {
        const sound = this.sounds.get(alias)?.sound;
        if (!sound) {
            console.warn(`Music not found: ${alias}`);
            return;
        }

        if (this.playingMusic.has(alias)) {
            return;
        }

        const id = sound.play();
        sound.loop(options.loop ?? true, id);
        sound.volume(options.volume ?? 1, id);
        sound.rate(options.rate ?? 1, id);

        this.playingMusic.add(alias);
        sound.once("end", () => {
            this.playingMusic.delete(alias);
        });

        console.log(`Playing music: ${alias}`);
    }

    public stopMusic(alias: string): void {
        const sound = this.sounds.get(alias)?.sound;
        if (!sound) {
            return;
        }
        sound.stop();
        this.playingMusic.delete(alias);
        console.log(`Stopped music: ${alias}`);
    }
}
