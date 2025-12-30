import {Screen} from "./Screen.js";

export class WinScreen extends Screen {
    constructor(gameObject) {
        super(gameObject);
    }
    updateResult(){
        const timeVar = this.gameObject.time;
        const moves = this.gameObject.moveCount;
        // const name = this.gameObject.name;

        // this.board.textContent= `Игрок ${name}`;

        this.board.textContent= `Время ${timeVar} / ходы ${moves}`;

        // Нужно добавить имя в нашу доску и очки которые будут добавляться по мере ходов и времени.
        // Переменная для времени, ходов, имени
        // Подсчет очков(чем меньше ходов и времени, тем больше очков)
        // и вывести наши данные.
        //
    }

    show(){
        this.updateResult();
        super.show();
    }



    // Если меньше очков, тем лучше.
    // для начало нужно вызвать победу.
    // что бы вызвать я долже обраться в клик хендлер
    //Создать структуру экрана. через криейт элемент
    // для этого мне надо удалить борд
    // создать новый див
// использую метод шоу.

}