import {Screen} from "./Screen.js";
import local from "../locals/local.js";
const {player, gameScore, yourName, send, youWinner, loseGame} = local;

export class WinScreen extends Screen {
    playerName;

    constructor(gameObject) {
        super(gameObject);
    }


    show() {

        // Нужно данные для отоброжения.
        // создать структуру с 0
        // Подгатовка данные для отоброжения
        const moves = this.gameObject.moveCount;
        const name = this.gameObject.playerName || player;
        const timeStr = this.gameObject.timeDisplay.textContent;

        // Считаем очки 10000 базовых - штраф за ходы - штраф за время
        const totalSeconds = Math.floor(this.gameObject.timer.elapsedTime / 1000) || 1;
        const score = Math.max(10000 - (moves * 50) - (totalSeconds * 10), 0);
        //
        // нжуно очистить борд и заново создать
        this.board.replaceChildren();
        this.board.classList.add("win-screen");

        const winCard = document.createElement("div");
        winCard.classList.add("win-card");

        // заголовок
        const title = document.createElement("p");
        title.textContent = 'WIN WIN';
        title.classList.add("win-title");

        const nameText = document.createElement("p");
        nameText.textContent = `${name}`;
        nameText.classList.add("win-player");

        // Создаем блок статистики
        const statsContainer = document.createElement("div");
        statsContainer.classList.add("win-stats");
        const timeP = document.createElement("p");
        timeP.textContent = timeStr;
        const movesP = document.createElement("p");
        movesP.textContent = `Ходов: ${moves}`;
        statsContainer.append(timeP, movesP);

        // Создаем яркую плашку с очками
        const scoreBadge = document.createElement('div');
        scoreBadge.classList.add('win-score-badge');
        const scoreLabel = document.createElement('small');
        scoreLabel.textContent = gameScore;
        const scoreValue = document.createElement('div');
        scoreValue.classList.add('score-num');
        scoreValue.textContent = score.toLocaleString();
        scoreBadge.append(scoreLabel, scoreValue);

        const sendSection = document.createElement("div");
        sendSection.classList.add("send-section");

        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.placeholder = yourName;
        nameInput.classList.add("win-input");

        const sendBtn = document.createElement("button");
        sendBtn.textContent = send;
        sendBtn.classList.add("win-send-btn");

        sendBtn.onclick = () => {
            const name = nameInput.value;
            fetch('http://localhost:3000/api/add_player', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name: name, scores: score})
            })
                // нужно сделать проверку на сервера
                // Что бы соединял между сервером и кодом.
                // Что бы получить ответ от сервера.
                // Нужно сделать проверку response.

                // Тут у нас обработка ответ сервера.
                // Нужно проверить сервер , что с
                .then(async response => {
                    sendSection.replaceChildren();
                    const message = document.createElement('p');
                    const data = await response.json();
                    console.log(data);
                    if (data.message === 'Player added successfully') {
                        message.textContent = youWinner + name;
                        message.classList.add('win-message');
                    } else {
                        message.textContent = loseGame;
                    }
                    sendSection.append(message);

                })

                .catch(error => console.error('Error:', error));
        };
        sendSection.append(nameInput, sendBtn);

        // Собираем всё вместе
        winCard.append(title, nameText, statsContainer, scoreBadge, sendSection);
        this.board.append(winCard);
        // вызываем
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