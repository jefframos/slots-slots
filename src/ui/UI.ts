import * as PIXI from 'pixi.js';
import { Signal } from 'signals';
import { AssetLoader } from '../utils/AssetLoader';
import BaseButton, { ButtonData, ButtonState } from './BaseButton';
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

            //Im using my personal button class here
            //the button date below let you set how the state of the button will look
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
                }

            }

            this.spinButton = new BaseButton(buttondata)
            this.spinButton.setLabel('SPIN');

            //this let me inject a callback for when the click happen
            //the reason for this is that the buton data can be used for multiple buttons but the callback will vary
            //callbacks can be added for each state
            this.spinButton.overrider(ButtonState.CLICK, {
                callback: () => {
                    this.onStartReel.dispatch();
                }
            })

            this.container.addChild(this.spinButton);
            this.spinButton.x = this.app.screen.width / 2 - this.spinButton.width / 2;
            this.spinButton.y = this.app.screen.height - 50 - this.spinButton.height / 2;

        } catch (error) {
            console.error('Error creating spin button:', error);
        }
    }
    //the game controller handles this logic
    public reelStarted(): void {
        this.spinButton.disable();
    }
    //the game controller handles this logic
    public reelFinished(): void {
        this.spinButton.enable();
    }
}