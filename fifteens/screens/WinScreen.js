import {Screen} from "./Screen.js";

export class WinScreen extends Screen {
    playerName;
    constructor(gameObject) {
        super(gameObject);
    }


    show(){
        // Нужно данные для отоброжения.
        // создать структуру с 0
        // Подгатовка данные для отоброжения
        const moves = this.gameObject.moveCount;
        const name = this.gameObject.playerName || "Игрок";
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
        scoreLabel.textContent = 'ИТОГОВЫЙ СЧЕТ';
        const scoreValue = document.createElement('div');
        scoreValue.classList.add('score-num');
        scoreValue.textContent = score.toLocaleString();
        scoreBadge.append(scoreLabel, scoreValue);

        const sendSection = document.createElement("div");
        sendSection.classList.add("send-section");

        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.placeholder = "Твое имя...";
        nameInput.classList.add("win-input");

        const sendBtn = document.createElement("button");
        sendBtn.textContent = "Отправить";
        sendBtn.classList.add("win-send-btn");

        // Собираем всё вместе
        winCard.append(title, nameText, statsContainer,scoreBadge,nameInput,sendBtn);
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