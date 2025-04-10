import gsap, { Back } from 'gsap';
import * as PIXI from 'pixi.js';
import { AssetLoader } from '../utils/AssetLoader';
import { SoundHandler } from '../utils/SoundHandler';

const SYMBOL_TEXTURES = [
    'symbol1.png',
    'symbol2.png',
    'symbol3.png',
    'symbol4.png',
    'symbol5.png',
];

const SPIN_SPEED = 50; // Pixels per frame
const SLOWDOWN_RATE = 0.9; // Rate at which the reel slows down
const MAX_BLUR = 50;

export class Reel {
    public container: PIXI.Container;
    private symbols: PIXI.Sprite[] = [];
    private symbolSize: number;
    private symbolCount: number;
    private speed: number = 0;
    private isSpinning: boolean = false;

    private blurFilter: PIXI.BlurFilter;
    private reelSound?: Howl;

    constructor(symbolCount: number, symbolSize: number) {
        this.container = new PIXI.Container();
        this.symbolSize = symbolSize;
        this.symbolCount = symbolCount;


        //blur filter it is not very performatic but it looks nice
        //if i had more time i would initialize the textures, then apply a blur filter and cache the result
        //if it is spining i would replace the texture with the blurred one, and move back when it stops
        //that is an easy trick to use filters and dont have to worry about performance, it also ideal for ColorMatrix and some other filters
        //but for now i will use the filter on the container and let pixi handle it
        //this is a bit of a hack, but it works for now
        //this would be a better approach for performance
        this.blurFilter = new PIXI.BlurFilter();
        this.blurFilter.blurX = 0;
        this.blurFilter.blurY = 0;
        this.container.filters = [this.blurFilter];

        this.createSymbols();
    }

    private createSymbols(): void {
        for (let i = 0; i < this.symbolCount; i++) {
            this.addSymbol();
        }
        //this adds an extra symbol to the right side of the reel to create a seamless effect
        this.addSymbol();
    }

    private addSymbol(): void {
        const symbol = this.createRandomSymbol();
        symbol.x = this.symbols.length * this.symbolSize;
        this.container.addChild(symbol);
        this.symbols.push(symbol);
    }

    private createRandomSymbol(): PIXI.Sprite {
        const textureName = SYMBOL_TEXTURES[Math.floor(Math.random() * SYMBOL_TEXTURES.length)];
        const texture = AssetLoader.getTexture(textureName);

        const sprite = new PIXI.Sprite(texture);
        sprite.width = this.symbolSize;
        sprite.height = this.symbolSize;
        return sprite;
    }

    public update(delta: number): void {
        if (!this.isSpinning && this.speed === 0) return;

        for (const symbol of this.symbols) {
            symbol.x -= this.speed * delta;
        }

        for (let i = 0; i < this.symbols.length; i++) {
            const symbol = this.symbols[i];
            if (symbol.x + this.symbolSize < 0) {
                symbol.x = this.getRightmostSymbolX() + this.symbolSize;
                symbol.texture = AssetLoader.getTexture(
                    SYMBOL_TEXTURES[Math.floor(Math.random() * SYMBOL_TEXTURES.length)]
                );
            }
        }

        //this updates the blur effect if the reel is spinning and the filter is being used
        if (this.container.filters?.includes(this.blurFilter)) {
            const blurAmount = Math.min((this.speed / SPIN_SPEED) * MAX_BLUR, MAX_BLUR);
            this.blurFilter.blurX = blurAmount;
            this.blurFilter.blurY = 0;
        }

        if (!this.isSpinning && this.speed > 0) {
            this.speed *= SLOWDOWN_RATE;
            if (this.speed < 0.5) {
                this.speed = 0;
                this.snapToGrid();
            }
        }
    }

    //check the symbol on the right siide
    private getRightmostSymbolX(): number {
        return Math.max(...this.symbols.map(s => s.x));
    }

    //use a tween to smooth snap to the grid
    private snapToGrid(): void {
        this.container.filters = [];
        this.symbols.sort((a, b) => a.x - b.x);
        for (let i = 0; i < this.symbols.length; i++) {
            gsap.to(this.symbols[i], {
                x: i * this.symbolSize,
                duration: 0.2,
                ease: Back.easeOut,
            });
        }
    }

    //start spinning the reel, also play the sound
    public startSpin(): void {
        if (!this.reelSound) {
            this.reelSound = SoundHandler.instance.getCopy('Reel spin');
        }
        this.reelSound?.play();
        this.isSpinning = true;
        this.speed = SPIN_SPEED;
        this.container.filters = [this.blurFilter];
    }

    public stopSpin(): void {
        this.reelSound?.stop();
        this.isSpinning = false;
    }
}