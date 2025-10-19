import {Screen} from "./screen.js";
//
export class TestScreen extends Screen {
    constructor(gameObject) {
        super(gameObject);
        this.board.textContent = 'Test';
    }
}