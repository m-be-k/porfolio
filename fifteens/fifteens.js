import {GameScreen} from "./screens/GameScreen.js";
import {MainScreen} from "./screens/MainScreen.js";
import {Timer} from './helpers/timer.js';
import {gameStateEnum} from "./helpers/enums.js";
import {WinScreen} from "./screens/WinScreen.js";
import {LeaderBoard} from "./screens/LeaderBoard.js";
import local from './locals/local.js';
const {timerInGame, pointInGame,leaders,exit,startInGame} = local;

class FifteenGame {

    constructor(x, y, z) {


        const that = this;
        this.gameContent = document.querySelector(".game-content");
        this.cellsCount = 16;
        this.screens = {
            gameScreen: new GameScreen(this),
            mainScreen: new MainScreen(this),
            winScreen: new WinScreen(this),
            leaderBoard: new LeaderBoard(this),
        };
        this.screens.mainScreen.show();

        ///
        document.getElementById('move').innerText = `${pointInGame} 0`;
        document.getElementById('time').innerText = `${timerInGame} 0`;
        document.getElementById('leaderboard').innerText =leaders ;
        document.getElementById('exit').innerText =exit;
        document.getElementById('start').innerText =startInGame;


        ///




        this.state = {
            "#gameProcess": gameStateEnum.stopped, // stopped | paused | active
            get gameProcess() {
                return this["#gameProcess"];
            },
            set gameProcess(newValue) {
                this["#gameProcess"] = newValue;
                for (let key in that.screens) {
                    that.screens[key].stateProcessing();
                }
            }
        };
        this.locals = document.getElementById('language');
        if (this.locals) {
            const savedLocal = localStorage.getItem('local');

            if (savedLocal) {
                //Перебрать опшены селекта через цикл

                for (let option of this.locals.options) {
                    // если значение массива строга совпадает с локалСтореджем
                    // то пусть значение селекта будет тру
                    // и остановить, если нашел схожее значение.
                    if (option.value === savedLocal) {
                        option.selected = true;
                        break;
                    }
                }
            }



            //Проверить, есть ли локаль в сторейдже
            //если есть, перебрать опшены селекта
            //опшен, value которого совпадет с локалью из сторейджа, должен получить .selected = true

            this.locals.addEventListener('change', (e) => {
                localStorage.setItem('local',this.locals.value);
            });
        }
        // нужно раздать State всем кто подписался на событие, в котором выполниться наше условие.
        //
        this.leaderboardButton = document.getElementById('leaderboard');

        if (this.leaderboardButton) {
            this.leaderboardButton.addEventListener('click', () => {
                this.leaderButton();
            });
        }

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
            this.timeDisplay.textContent = `${timerInGame} ${hours}:${minutes}:${seconds}`;
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
        this.exitButton = document.getElementById('exit');

        this.startButton.addEventListener('click', () => {
            if (this.state.gameProcess === gameStateEnum.active) {
                // поставить на паузу
                this.timer.pause();
                this.state.gameProcess = gameStateEnum.paused;

            } else if (this.state.gameProcess === gameStateEnum.paused) {
                // продолжить игру
                this.timer.start();
                this.state.gameProcess = gameStateEnum.active;
            } else {
                // старт новой игры
                this.startGame();
            }

        });
        this.exitButton.addEventListener('click', () => {
            this.exitToMainScreen();
        });
    }


    // нужно реализовать стар и пауза одной кнопкой
    // для это мне надо обратиться в state.
    // переход со стартового экрана в игровое поле
    startGame(reset = false) {
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

        // подсчет ходов если активна
        if (this.state.gameProcess !== gameStateEnum.active) {
            return;
        }
        this.moveCount++;
        if (this.moveDisplay) {
            this.moveDisplay.textContent = `${pointInGame} ${this.moveCount}`;
        }
    }

    exitToMainScreen() {

        // останавливаем таймер
        this.timer.stop();
        this.timer.reset();
        // сбрасываем состояние
        this.state.gameProcess = gameStateEnum.stopped;
        this.moveCount = 0;
        this.moveDisplay.textContent = `${pointInGame} 0`;
        this.timeDisplay.textContent = `${timerInGame} 00:00:00`;
        // показываем стартовый экран
        this.screens.mainScreen.show();

    }

    victoryProcessing() {

        this.timer.pause();
        this.state.gameProcess = gameStateEnum.winner;
        this.screens.winScreen.show();
    }

    leaderButton() {
        this.screens.leaderBoard.show();

    }
}

const gameObject = new FifteenGame();


