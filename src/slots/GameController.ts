import { UI } from "../ui/UI";
import { SlotMachine } from "./SlotMachine";

//this class connects the slot machine and the UI
//the ui and the slot machine dont need to be aware of each other
//this is a good practice to keep the code clean and easy to maintain
export class GameController {
    constructor(
        private slotMachine: SlotMachine,
        private ui: UI
    ) {
        this.ui.onStartReel.add(this.handleStartReel.bind(this));
        this.slotMachine.onReelStarted.add(this.handleReelStarted.bind(this));
        this.slotMachine.onReelFinished.add(this.handleReelFinished.bind(this));
    }

    //this method is called when the spin button is clicked
    private handleStartReel(): void {
        this.slotMachine.spin();
    };
    //this method is called when the spin animation starts
    private handleReelStarted(): void {
        this.ui.reelStarted();
    };
    //this method is called when the spin animation ends
    private handleReelFinished(): void {
        this.ui.reelFinished();
    };
}