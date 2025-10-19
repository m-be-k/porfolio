import {Screen} from './screen.js';
export class GameScreen extends Screen {
// весь процесс игры внутри пятнашек, использовать в новом классе.
    // Для того чтобы перенести весть процесс контента игры в класс GameScreem.
    // То есть методы, которые использовали в FifteenGame (CreateBox/IsSwapPossible/victoryDetect/swapElements)
    // Нужно, что бы this.gameScreen = new FifteenGame(this)/ смогли использовать в classe GameScreen.

    constructor(gameObject) {
        super(gameObject);
        this.oneClick();
        this.createBox();
    }

    createBox() {
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
        })
    }

    // обработка клика по плитке.

    oneClick() {
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

    }

    // Обработка клика: если это не пустая плитка — меняем с пустой
    clickHandler(e) {
        const clicked = e.target;


        const empty = this.board.querySelector("#cell-16");

        if (this.isSwapPossible(clicked, empty)) {

            this.swapElements(clicked, empty);
            if (this.victoryDetect()) {
                setTimeout(() => {
                    alert("WON");
                }, 0);

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
}