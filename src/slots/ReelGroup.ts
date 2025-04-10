import * as PIXI from 'pixi.js';
import PromiseUtils from '../utils/PromiseUtils';
import { Reel } from './Reel';

export class ReelGroup {
    public container: PIXI.Container;
    private reels: Reel[] = [];
    private spacing: number;
    private maskGraphic?: PIXI.Graphics;

    //the group makes easier to mask and manage the reels
    constructor(spacing: number = 100, bounds?: PIXI.Rectangle) {
        this.container = new PIXI.Container();
        this.spacing = spacing;

        if (bounds) {
            this.maskGraphic = new PIXI.Graphics();
            this.maskGraphic.beginFill(0x000000)
                .drawRect(bounds.x, bounds.y, bounds.width, bounds.height)
                .endFill();

            this.container.addChild(this.maskGraphic);
            this.container.mask = this.maskGraphic;
        }
    }

    public addReel(reel: Reel): void {
        this.container.addChild(reel.container);
        reel.container.y = this.reels.length * (reel.container.height + this.spacing);
        this.reels.push(reel);
    }


    public async startSpin(willWin: boolean): Promise<void> {
        //ideally if willWin is true, we can rig the reels to stop at a winning combination
        //probably better if this recieve the final setting for the reels and not a boolean
        //this is just a placeholder for now
        const spinDelay = 100
        for (const reel of this.reels) {
            await PromiseUtils.delay(spinDelay);
            reel.startSpin();
        }
        await PromiseUtils.delay(this.reels.length * spinDelay);
    }
    //add some noise for stopping the reels
    public async stopSpin(): Promise<void> {
        const stopTime = 350
        for (const reel of this.reels) {
            const stopDelay = 100 + Math.random() * 600;
            await PromiseUtils.delay(stopDelay);
            reel.stopSpin();
        }
        await PromiseUtils.delay(stopTime);
    }

    public update(delta: number): void {
        for (const reel of this.reels) {
            reel.update(delta);
        }
    }
}
