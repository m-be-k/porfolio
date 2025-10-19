import {GameScreen} from "./screens/gameScreen.js";
import {TestScreen} from "./screens/screen2.js";

class FifteenGame {
    // Добавить селекторы: доска, стар, выход, время, движение.
    // Состояние,
    constructor(x, y, z) {
        this.gameContent = document.querySelector(".game-content");
        this.cellsCount = 16;
        this.gameScreen = new GameScreen(this);
        this.gameScreen.show();

        setTimeout(()=>{
            (new TestScreen(this)).show();
        }, 5000);
    }

}

const gameObject = new FifteenGame();
//---------------------------------------------------------------------------------------------------
// // Функция для кнопки SWAP
//     function onSwapClick() {
//     if (selected.length !== 2) {
//         return selected;
//     }
//     const [first, second] = selected;
//     // Деструктуризация массива selected
//     const container = document.getElementById('container');
//     //Получение контейнера с блоками по его id, перестановки будут происходить внутри него.
//
//     const placeholder = document.createElement('div');
//     //Создание пустого дива
//     placeholder.style.display = 'none';
//     // и делаем его невидимым
//     container.insertBefore(placeholder, first);
//     //Помещаем невидимый плейсхолдер на место first.
//     container.insertBefore(first, second);
//     //Перемещение первого блока на место второго
//     // first вставляется сразу перед тем, что раньше был second
//     //  Плейсхолдер остаётся на старом месте first, а second смещён
//     container.insertBefore(second, placeholder);
// //second перед плейсхолдером, то есть на исходное место first.
//     container.removeChild(placeholder);
//     //Удаление плейсхолдера
//     clearSelection();


//     swapByID(idA,idB){
//         // принимаем две строки элементов
//         const cellA = document.getElementById(idA);
//         const cellB = document.getElementById(idB);
//         // проверка, что есть такие элементы.
//         if(!cellA||!cellB){
//             return cellA||cellB;
//         }
//         // обмен индекса
//         [cellA.dataset.idx, cellB.dataset.idx] =  [cellA.dataset.idx, cellB.dataset.idx];
//         // обмен текста
//         [cellA.textContent, cellB.textContent] = [cellA.textContent, cellB.textContent];
// const game = new FifteenGame();
// game.swapByID('cell-15','cell-16');
// }

// метод по айди
// переменная cellА и cellB, нужно поменять их по айдишнику местами
// для это мне нужно обращаться к айди 1-16.
//


//         const cell = e.target;
//         cell.classList.add("box");
//         const empty =this.board.querySelectorAll(".box");
// // const


// сделать клетки подвижными
// При нажатьях на клетку которая рассоложена рядом с пустой клеткой, должна меняться.
//
//----------------------------
// у каждой клетки есть id.
// проверяю является клетка рядом с пустой клеткой.
//
// при клике на любую ячейку проверяю, является ли она пустая.
// если все пункты верны то меняем местами.


// let arr = [1,2,3,4,5,6,7,8,9];
//
//
// arr.sort(()=>{
//     return Math.random()-0.5;
// });
//
// console.log(arr);

