class FifteenGame {
    // Добавить селекторы: доска, стар, выход, время, движение.
    // Состояние,
    constructor(x, y, z) {
        this.gameContent = document.querySelector(".game-content");
        this.board = document.createElement("div");
        this.board.id = 'board';
        this.board.classList.add('board');
        this.gameContent.append(this.board);
        this.cellsCount = 16;
        this.createBox();
        this.oneClick();

        // this.x=x;
        // this.y=y;
        // this.z=z;
        // this.cells =[];
    }

    createBox() {
        const arr = [];
        for (let i = 1; i < this.cellsCount; i++) {
            arr.push(i);
        }
        arr.sort(() => Math.random() - 0.5);
        arr.push(this.cellsCount);
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
   isSwapPossible(a,b){
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
       const c1 = Math.abs(a1-b1);
       const c2 =  Math.abs(a2-b2);
       //  координаты а
       return c1+c2 === 1;
}
    // Обработка клика: если это не пустая плитка — меняем с пустой
    clickHandler(e) {
        const clicked = e.target;
        // 1) Убедимся, что клик по .box и это не пустая плитка
        // Проверка, что клик был по боксу
        // Если клик не по плитке. То выходит
        // Или клик по айди ячейки то тоже выходим.
        //
        // if (!clicked.classList.contains("box") || clicked.id === "cell-16"){
        //   return;
        // }


        const empty = this.board.querySelector("#cell-16");
            // Направление по координатам xy
            // верхня и нижняя клетка стоит от cell 16 y=-3/y=3
            // лево и право x=-0/x=0
            // так же нужна проверка на соседство
            // Если это да то меняем местами.
            // const itNeighbour =
            // if(x+y === 1){
            //     this.swapElements(clicked, empty);
            // }
            // Нужен список всех клеток.;
            // Добавить координаты x и y в
            // Либо сделать через массив
            //
        //проверяем соседство пустая плитка сell 16. Если да то продолжаем.
        //Нужно сохранить координаты кликнутой плитки
        // сохраняем FirstRow, SecondCol в переменную
        //
        if(this.isSwapPossible(clicked,empty)) {
            const FirstRow = clicked.dataset.row;
            const SecondCol = clicked.dataset.col;
            // теперь меняем местами элементы
            this.swapElements(clicked, empty);
// Обновляем координаты. Кликнутая плитка получает координаты пустой
            // пустая плитка получает старые координаты кликнутой.
        clicked.dataset.row = empty.dataset.row;
        clicked.dataset.col = empty.dataset.col;
        empty.dataset.row = FirstRow;
        empty.dataset.col = SecondCol;
        }

    }

    swapElements(first, second) {
        const placeholder = document.createElement("div");
        placeholder.style.display = "none";

        this.board.insertBefore(placeholder, first);
        this.board.insertBefore(first, second);
        this.board.insertBefore(second, placeholder);
        this.board.removeChild(placeholder);
    }
}

const gameObject = new FifteenGame();
//
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

