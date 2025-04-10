import { UI } from "../ui/UI";
import { SlotMachine } from "./SlotMachine";

export class GameController {
    constructor(
        private slotMachine: SlotMachine,
        private ui: UI
    ) {
        this.ui.onStartReel.add(this.handleStartReel.bind(this));
        this.slotMachine.onReelStarted.add(this.handleReelStarted.bind(this));
        this.slotMachine.onReelFinished.add(this.handleReelFinished.bind(this));
    }

    private handleStartReel = () => {
        this.slotMachine.spin();
    };

    private handleReelStarted = () => {
        this.ui.reelStarted();
    };

    private handleReelFinished = () => {
        this.ui.reelFinished();
    };
}