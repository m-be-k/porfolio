import {GameScreen} from "./screens/GameScreen.js";
import {MainScreen} from "./screens/MainScreen.js";
import {Timer} from './helpers/timer.js';

const gameStateEnum = {
    stopped: 0,
    paused: 1,
    active: 2,
}

class FifteenGame {

    constructor(x, y, z) {
        this.gameContent = document.querySelector(".game-content");
        this.cellsCount = 16;
        this.screens = {
            gameScreen: new GameScreen(this),
            mainScreen: new MainScreen(this),
        };
        this.screens.mainScreen.show();

        this.state = {
            gameProcess: gameStateEnum.stopped, // stopped | paused | active
        };

        this.moveCount = 0;
        this.time = 0;
        this.moveDisplay = document.getElementById('move');
        this.timeDisplay = document.getElementById('time');
        this.timer = new Timer((ms) => {
            // рассчитать время с момента запуска.
            const time = new Date(ms);
            const hours = time.getUTCHours().toString().padStart(2, "0");
            const minutes = time.getUTCMinutes().toString().padStart(2, "0");
            const seconds = time.getUTCSeconds().toString().padStart(2, "0");
            this.timeDisplay.textContent = `Время: ${hours}:${minutes}:${seconds}`;
            this.time = time;
        }, 1000, 50);

        // this.timer.start();

        // подключить кнопки управление Стар и выход
        // можно подключиться через елемент айдишника

        /*
        1) Переименование кнопки в зависимости от состояния
        2) После возобновления игры счетчик ходов не должен сбрасываться
        3) Поле должно фризиться и не позволять делать ходы

         */
        this.startButton = document.getElementById('start');
        this.startButton.addEventListener('click', () => {


            if (this.state.gameProcess === gameStateEnum.active) {
                this.timer.pause();
                this.state.gameProcess = gameStateEnum.paused;
                this.startButton.textContent = 'Старт';
            } else {
                this.startGame();
                this.startButton.textContent = 'Пауза';
// что бы сохранить ходы и не сбрасывались ходы после паузы.
                //
            }
        });
    }


    // нужно реализовать стар и пауза одной кнопкой
    // для это мне надо обратиться в state.
    // переход со стартового экрана в игровое поле
    startGame(reset = false){
        // this.timer.pause()
        this.screens.gameScreen.show();
        this.timer.start();
        this.state.gameProcess = gameStateEnum.active;
    }
    // поставить на паузу и остановить таймер
    // когда запускаем игру должно быть что таймер остановился и стате долже быть на паузе
    // то есть если стате будет, активен то он должен быть на паузе.
    // startPause(){
    //     if (this.state.gameProcess === gameStateEnum.active){
    //         this.s;
    //     }
    // }
    // stopTimer(){
    //     this.stopTimer()
    // }
    renderMoveCount() {
        this.moveCount++;

        if (this.moveDisplay) {
            this.moveDisplay.textContent = `ход: ${this.moveCount}`;
        }

    }

}

const gameObject = new FifteenGame();


