import {Screen} from "./Screen.js";
import local from "../locals/local.js";

const {mainText} = local;

export class MainScreen extends Screen {
    constructor(gameObject) {
        super(gameObject);


    }

    show() {
        this.board.replaceChildren();
        this.board.className = "mainScreen";

        const title = document.createElement("div");
        title.textContent = mainText;
        this.board.append(title);
        super.show();
    }

//     startGame(){
//         gameScreen = new GameScreen();
//         gameScreen.show();
// }
}