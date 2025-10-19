// так же у всех классов е
// мне нужно создать (общий класс) в файле screen.js, в котором он объединяет все классы gameScreen.js, screen2.js, screen3.js через es6
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
        if(this.board.parentNode){

        }
        this.gameObject.gameContent.append(this.board);

    }

}
// нужно исправить, что бы борды не добавлялись в общий эран.
// либо удалять
// нужно спрятать,
//
// то есть добавить метод в котором при условиях будет удаляться board
// если board относиться к родительскому элементу то удалять
