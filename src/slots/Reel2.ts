import gsap, { Back } from 'gsap';
import * as PIXI from 'pixi.js';
import { AssetLoader } from '../utils/AssetLoader';

const SYMBOL_TEXTURES = [
    'symbol1.png',
    'symbol2.png',
    'symbol3.png',
    'symbol4.png',
    'symbol5.png',
];

const SPIN_SPEED = 50; // Pixels per frame
const SLOWDOWN_RATE = 0.95; // Rate at which the reel slows down

export class Reel {
    public container: PIXI.Container;
    private symbols: PIXI.Sprite[];
    private symbolSize: number;
    private symbolCount: number;
    private speed: number = 0;
    private isSpinning: boolean = false;

    constructor(symbolCount: number, symbolSize: number) {
        this.container = new PIXI.Container();
        this.symbols = [];
        this.symbolSize = symbolSize;
        this.symbolCount = symbolCount;

        this.createSymbols();
    }

    private createSymbols(): void {
        for (let i = 0; i < this.symbolCount; i++) {
            const symbol = this.createRandomSymbol();
            symbol.x = i * this.symbolSize;
            this.container.addChild(symbol);
            this.symbols.push(symbol);
        }
    }

    private createRandomSymbol(): PIXI.Sprite {
        // Get a random texture name from SYMBOL_TEXTURES
        const textureName = SYMBOL_TEXTURES[Math.floor(Math.random() * SYMBOL_TEXTURES.length)];
        const texture = AssetLoader.getTexture(textureName);

        // Create a sprite with the texture
        const sprite = new PIXI.Sprite(texture);
        sprite.width = this.symbolSize;
        sprite.height = this.symbolSize;
        return sprite;
    }

    public update(delta: number): void {
        if (!this.isSpinning && this.speed === 0) return;

        // Move symbols horizontally
        for (const symbol of this.symbols) {
            symbol.x -= this.speed * delta;
        }

        // Check if any symbol moved out of view to the left
        for (let i = 0; i < this.symbols.length; i++) {
            const symbol = this.symbols[i];
            if (symbol.x + this.symbolSize < 0) {
                // Recycle symbol to the right end
                symbol.x = this.getRightmostSymbolX() + this.symbolSize;
                symbol.texture = AssetLoader.getTexture(
                    SYMBOL_TEXTURES[Math.floor(Math.random() * SYMBOL_TEXTURES.length)]
                );
            }
        }

        // If we're stopping, slow down the reel
        if (!this.isSpinning && this.speed > 0) {
            this.speed *= SLOWDOWN_RATE;

            // If speed is very low, stop completely and snap to grid
            if (this.speed < 0.5) {
                this.speed = 0;
                this.snapToGrid();
            }
        }
    }

    private getRightmostSymbolX(): number {
        return Math.max(...this.symbols.map(s => s.x));
    }

    private snapToGrid(): void {
        // Sort symbols left to right
        this.symbols.sort((a, b) => a.x - b.x);
        for (let i = 0; i < this.symbols.length; i++) {
            gsap.to(this.symbols[i], { x: i * this.symbolSize, duration: 0.2, ease: Back.easeOut });
        }
    }

    public startSpin(): void {
        this.isSpinning = true;
        this.speed = SPIN_SPEED;
    }

    public stopSpin(): void {
        this.isSpinning = false;
        // The reel will gradually slow down in the update method
    }
}
