import * as PIXI from 'pixi.js';
import { Signal } from 'signals';
import { AssetLoader } from '../utils/AssetLoader';
import BaseButton, { ButtonData } from './BaseButton';
export class UI {
    public container: PIXI.Container;
    private app: PIXI.Application;
    private spinButton!: BaseButton;

    public onStartReel: Signal = new Signal();

    constructor(app: PIXI.Application) {
        this.app = app;
        this.container = new PIXI.Container();

        this.createSpinButton();
    }

    private createSpinButton(): void {
        try {

            const buttondata: ButtonData = {
                standard: {
                    fontStyle: new PIXI.TextStyle({
                        fontSize: 40,
                        fill: '#ffffff',
                        fontFamily: 'Arial',
                        fontWeight: 'bold',
                        align: 'center',
                    }),
                    texture: AssetLoader.getTexture('button_spin.png'),
                    width: 150,
                    height: 80,
                    fitText: 0.5,
                    textResolution: 1.5,
                    allPadding: 50
                },
                over: {
                    texture: AssetLoader.getTexture('button_spin_over.png'),
                },
                disabled: {
                    fontStyle: new PIXI.TextStyle({
                        fontSize: 40,
                        fill: '#aaaaaa',
                        fontFamily: 'Arial',
                        fontWeight: 'bold',
                        align: 'center',
                    }),
                    texture: AssetLoader.getTexture('button_spin_disabled.png'),
                },
                click: {
                    callback: () => {
                        this.onStartReel.dispatch();
                    }
                }

            }
            this.spinButton = new BaseButton(buttondata)

            this.spinButton.x = this.app.screen.width / 2 - this.spinButton.width / 2;
            this.spinButton.y = this.app.screen.height - 50 - this.spinButton.height / 2;

            this.spinButton.setLabel('SPIN');
            this.container.addChild(this.spinButton);

        } catch (error) {
            console.error('Error creating spin button:', error);
        }
    }
    public reelStarted(): void {
        this.spinButton.disable();
    }
    public reelFinished(): void {
        this.spinButton.enable();
    }
}