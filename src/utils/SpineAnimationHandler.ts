import { Spine } from 'pixi-spine';
import { AssetLoader } from '../utils/AssetLoader';
export class SpineAnimationHandler {
    public spine!: Spine;
    public animations: Set<string> = new Set();

    constructor(private jsonPath: string) { }

    async load(): Promise<void> {
        const spineData = AssetLoader.getSpine(this.jsonPath);
        if (!spineData || !spineData.spineData) {
            throw new Error(`Spine data not found for path: ${this.jsonPath}`);
        }

        this.spine = new Spine(spineData.spineData);

        for (const animation of this.spine.spineData.animations) {
            this.animations.add(animation.name);
        }
    }

    async playAnimation(name: string, loop: boolean = false): Promise<void> {
        if (!this.spine) throw new Error('Spine not loaded. Call load() first.');
        if (!this.animations.has(name)) {
            throw new Error(`Animation "${name}" not found`);
        }

        return new Promise<void>((resolve) => {
            const trackEntry = this.spine.state.setAnimation(0, name, loop);
            if (loop) {
                resolve();
            } else {
                trackEntry.listener = {
                    complete: () => {
                        resolve();
                    }
                };
            }
        });
    }
}
