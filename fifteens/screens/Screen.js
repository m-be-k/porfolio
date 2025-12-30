// так же у всех классов е
// мне нужно создать (общий класс) в файле Screen.js, в котором он объединяет все классы GameScreen.js, MainScreen.js, WinScreen.js через es6
//  есть класс, создать общую структуру для экранов (когда заходишь в игру появляться главный экран, потом сама игра и после победа)
// в данный момент нужно обозначить структуру. Что это Животное
//

export class Screen {
    board;
    gameObject;
    constructor(gameObject) {
        this.gameObject = gameObject;
        this.board = document.createElement("div");
        this.board.id = 'board';
        this.board.classList.add('board');
    }
    show(){
        if (this.gameObject.gameContent.lastChild) {
            this.gameObject.gameContent.removeChild(this.gameObject.gameContent.lastChild);
        }
        // this.gameObject.gameContent.lastChild?.remove();
        this.gameObject.gameContent.append(this.board);
    }

    stateProcessing(){

    }
}
// нужно исправить, что бы борды не добавлялись в общий эран.
// либо удалять
// нужно спрятать,
//
// то есть добавить метод в котором при условиях будет удаляться board
// если board относиться к родительскому элементу то удалять
// удаляем все и обратно добавлять
// проверяет, является ли в контейнере gameContent lastChild
//
