import {Screen} from './Screen.js';
import {gameStateEnum} from "../helpers/enums.js";

/*
Нужно сделать механизм постановки игрового поля на паузу (и снятия с нее) по запросу:
   -навешивание плашки
   -блокировку фишек (чтобы нельзя было на паузе играть)
 */

export class GameScreen extends Screen {
    cell;

    constructor(gameObject) {
        super(gameObject);
        this.setupEventListeners();
        this.createBox();
    }

    createBox() {
        // теперь очищаем доску методом
        this.resetBox();

        const arr = [];
        for (let i = 1; i < this.gameObject.cellsCount; i++) {
            arr.push(i);
        }
        // arr.sort(() => Math.random() - 0.5);
        arr.push(this.gameObject.cellsCount);

        arr.forEach((num, index) => {
            const cell = document.createElement("div");
            cell.classList.add("box");
            cell.id = `cell-${num}`;

            // добавить координаты
            // нужно узнать как найти плитку на доске
            // здесь же arr наш массив 1до16 перемещённый
            // forEach переберет каждый элемент массива
            // где num значение плитки
            // и index будет позиций плитки.
            // как умножение.
            //  нам нужно разделить индекс и получить номер строки(координат y)
            // так же разделить индекс получить (координат x)
            const row = Math.trunc(index / 4); // координаты строки
            const col = index % 4;// координат столбец
            //назачить координаты
            cell.dataset.row = row.toString();
            cell.dataset.col = col.toString();
            cell.dataset.num = num.toString();
            if (num !== 16) {
                cell.textContent = num;
            }
            // cell.textContent = `${row}/${col}`;
            this.board.append(cell);
        });
        this.createPausedBoard();
    }


    resetBox() {

        /*
        Удаление старых плиток:
            - Очищение доску перед созданием новых плиток.
         Мне нужно сделать через цикл
         вывести доску и удалить все родительские элементы
     так наш борд не являться массивом нужно его сохранить как массив
    через оператор spread
         */

        [...this.board.children].forEach((cell) => {
            cell.remove();
        });


    }

    setupEventListeners() {
        this.board.addEventListener("click", this.clickHandler.bind(this));
    }

    isSwapPossible(a, b) {
        const a1 = a.dataset.row;// координаты строк
        const a2 = a.dataset.col;// координаты столбца
        const b1 = b.dataset.row;// пустого координаты строк
        const b2 = b.dataset.col;// пустого координаты столбца

        // проверка на соседства
        // известны строки и колоны.
        // теперь нужно поставить координаты двух плиток.

        // и вычислить расстояние по горизонтали и вертикали
        // и вычислить сумму, То есть должна быть смещение на 1
        //
        const c1 = Math.abs(a1 - b1);
        const c2 = Math.abs(a2 - b2);
        //  координаты а
        return c1 + c2 === 1;
    }

    victoryDetect() {
        // Координаты должны совпадать каждой плитки
        //
        // Нужно проверить что все плитки стоят на своих местах.
        // 1. Нужно вытащить все плитки
        const allCounter = this.board.querySelectorAll(".box");
        // 2. нужно проверить каждую плитку можем проверить через метод
        // можем проверить его текст, если текст
        // допустим что выигрыш есть и проверим в цикле

        for (let i = 0; i < allCounter.length; i++) {
            const cellNumberExpected = (i + 1).toString();
            // считаем текст и приводим к числу.
            const cellNumberReal = allCounter[i].dataset.num;

            let val = cellNumberReal;
            // Сохроняем переменную
            // если текст пустая строка то это свободный бокс и сохраняем в cellCount
            if (cellNumberReal === '') {
                val = this.gameObject.cellsCount;
                //нужно получить число из текста
            }
            // сравниваем боксы, если не совпадает то это не победа
            if (val !== cellNumberExpected) {
                return false;
            }
        }
        return true;
        // если количество плиток не совпадает с количеством в массиве строк

        // 3. поиск плитки
        // 4. если все плитки на месте то возвращаем тру.
        // Если все совпадает вызвать метод.
// мне надо вызвать
    }

    clickHandler(e) {
        if (this.gameObject.state.gameProcess !== gameStateEnum.active) {
            return;
        }

        const clicked = e.target;
        const empty = this.board.querySelector("#cell-16");

        if (this.isSwapPossible(clicked, empty)) {
            this.swapElements(clicked, empty);
            this.gameObject.renderMoveCount();
            if (this.victoryDetect()) {
                this.gameObject.victoryProcessing();


                // остановить время.
                // остановить ходы.
                // Меняем состояние.
                // поменять экран.
                // setTimeout(() => {
                //     alert("WON");
                // }, 0);
                // обратиться через геймобжект к стейту и процессу игры и переключить его на победу.
                // так же остановить таймер то есть поставить на стоп.
                //
            }
        }

    }

    swapElements(first, second) {
        const placeholder = document.createElement("div");
        placeholder.style.display = "none";

        this.board.insertBefore(placeholder, first);
        this.board.insertBefore(first, second);
        this.board.insertBefore(second, placeholder);
        this.board.removeChild(placeholder);

        const typeRow = first.dataset.row;
        const typeCol = first.dataset.col;
        first.dataset.row = second.dataset.row;
        first.dataset.col = second.dataset.col;
        second.dataset.row = typeRow;
        second.dataset.col = typeCol;
    }

    // Создание вида доски.
// Создаю переменную и назначаем элемент див.
    // Присваиваю класс pause-ribbon.
    // Даю ему название (Игра на паузе)
    // добавляю борд в мой див так что бы вставлял внутри игровой доски

    createPausedBoard() {
        const pause = document.createElement("div");
        pause.classList.add("pause-ribbon");
        pause.textContent = "Игра на паузе";
        this.board.append(pause);
    }

// Переключение
    // Переменная где храниться наш игровой процесс (пауза, остановка)
    // и делаю условие, если игра запущена активна, то пауза удаляться
    //
    stateProcessing() {

        const state = this.gameObject.state.gameProcess;
        const start = document.getElementById('start');

        switch (state) {
            case gameStateEnum.active: {
                this.board.classList.remove('paused');
                if (start) {
                    start.textContent = 'Пауза';
                }
                break;
            }
            case gameStateEnum.stopped: {
                this.board.classList.add('paused');
                if (start) {
                    start.textContent = 'Старт';
                }
                this.createBox();
                break;
            }
            case gameStateEnum.winner: {
                if(start) {
                    start.textContent = 'Заново';
                }
                break;
            }
            default: {
                this.board.classList.add('paused');
                if (start) {
                    start.textContent = 'Старт';
                }
            }
        }
    }

}

// Плашка для игрового борда
// css мы должны обратиться к борду - пауза. Визуал
// 1. визуальная блокировка поля.
// в html добавить div - pause bord
// так же GameScreen добавить метод в котором опишу детали создания паузы для борда.
//