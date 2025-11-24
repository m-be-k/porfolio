import {Screen} from "./Screen.js";
// import {GameScreen} from "./GameScreen";
//
export class MainScreen extends Screen {
    constructor(gameObject) {
        super(gameObject);
        this.board.textContent = 'Test';
    }
//     startGame(){
//         gameScreen = new GameScreen();
//         gameScreen.show();
// }
}