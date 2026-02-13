import {Screen} from "./Screen.js";
// import {GameScreen} from "./GameScreen";
//
export class MainScreen extends Screen {
    constructor(gameObject) {
        super(gameObject);


    }
    show(){
        this.board.replaceChildren();
        this.board.className = "mainScreen";

        const title = document.createElement("div");
        title.textContent = 'ПЯТНАШКИ';
        this.board.append(title);
        super.show();
}
//     startGame(){
//         gameScreen = new GameScreen();
//         gameScreen.show();
// }
}