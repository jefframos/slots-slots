import 'pixi-spine';
import * as PIXI from 'pixi.js';
import { Signal } from 'signals';
import { SoundHandler } from '../utils/SoundHandler';
import { SpineAnimationHandler } from '../utils/SpineAnimationHandler';
import { Reel } from './Reel';
import { ReelGroup } from './ReelGroup';

const REEL_COUNT = 4;
const SYMBOLS_PER_REEL = 6;
const SYMBOL_SIZE = 150;
const REEL_HEIGHT = SYMBOL_SIZE;
const REEL_SPACING = 10;
const SLOT_PANEL_WIDTH = SYMBOL_SIZE * SYMBOLS_PER_REEL;
const SLOT_PANEL_HEIGHT = REEL_HEIGHT * REEL_COUNT + REEL_SPACING * (REEL_COUNT - 1);

export class SlotMachine {
    public container: PIXI.Container;
    private reelGroup: ReelGroup;
    private app: PIXI.Application;
    private isSpinning: boolean = false;
    private frameSpine!: SpineAnimationHandler;
    private winAnimation!: SpineAnimationHandler;

    public onReelStarted: Signal = new Signal();
    public onReelFinished: Signal = new Signal();

    constructor(app: PIXI.Application) {
        this.app = app;
        this.container = new PIXI.Container();

        // Center the slot machine
        this.container.x = this.app.screen.width / 2 - (SLOT_PANEL_WIDTH / 2);
        this.container.y = this.app.screen.height / 2 - (SLOT_PANEL_HEIGHT / 2);

        this.reelGroup = new ReelGroup(REEL_SPACING, new PIXI.Rectangle(0, 0, SLOT_PANEL_WIDTH, SLOT_PANEL_HEIGHT));

        this.createBackground();

        this.createReels();

        this.initSpineAnimations();



    }

    private createBackground(): void {
        try {
            const background = new PIXI.Graphics();
            background.beginFill(0x000000, 0.5);
            background.drawRect(
                -20,
                -20,
                SLOT_PANEL_WIDTH + 40, // Width now based on symbols per reel
                SLOT_PANEL_HEIGHT + 40 // Height based on reel count
            );
            background.endFill();
            this.container.addChild(background);
        } catch (error) {
            console.error('Error creating background:', error);
        }
    }

    private createReels(): void {
        // Create each reel

        for (let i = 0; i < REEL_COUNT; i++) {
            const reel = new Reel(SYMBOLS_PER_REEL, SYMBOL_SIZE);
            this.reelGroup.addReel(reel);
        }

        this.container.addChild(this.reelGroup.container);

    }

    public update(delta: number): void {
        // Update each reel
        this.reelGroup.update(delta);
    }

    public async spin(): Promise<void> {
        if (this.isSpinning) return;

        this.isSpinning = true;

        // Disable spin button
        this.onReelStarted.dispatch();
        // Start spinning each reel with delay
        const willWin = await this.checkWin();
        await this.reelGroup.startSpin(willWin);
        await this.reelGroup.stopSpin();
        this.isSpinning = false;

        if (willWin) {
            await this.showWin();
        }
        this.onReelFinished.dispatch();

    }

    private async checkWin(): Promise<boolean> {
        return Math.random() < 0.3; // 30% chance of winning
    }


    private async showWin(): Promise<void> {

        SoundHandler.instance.play('win');
        console.log('Winner!');
        if (this.winAnimation) {
            this.winAnimation.spine.visible = true;
            await this.winAnimation.playAnimation('start');
            this.winAnimation.spine.visible = false;
        }
    }


    private initSpineAnimations(): void {
        try {
            this.frameSpine = new SpineAnimationHandler('base-feature-frame.json');
            this.frameSpine.load().then(() => {
                this.frameSpine.spine.visible = true;
                this.frameSpine.spine.y = SLOT_PANEL_HEIGHT / 2;
                this.frameSpine.spine.x = SLOT_PANEL_WIDTH / 2;
                this.container.addChild(this.frameSpine.spine);
                this.frameSpine.playAnimation('idle', true);
            });


            this.winAnimation = new SpineAnimationHandler('big-boom-h.json');
            this.winAnimation.load().then(() => {
                this.winAnimation.spine.visible = false;
                this.winAnimation.spine.x = SLOT_PANEL_HEIGHT / 2;
                this.winAnimation.spine.y = SLOT_PANEL_WIDTH / 2;
                this.container.addChild(this.winAnimation.spine);
            })

        } catch (error) {
            console.error('Error initializing spine animations:', error);
        }
    }
}
