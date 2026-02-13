// добавить список лидеров.
// для этого нужно
// импортировать экран
// подключить кнопку лидеров.
import {Screen} from "./Screen.js";

export class LeaderBoard extends Screen {
    playerName;

    constructor(gameObject) {
        super(gameObject);
    }

    show() {
        // для нового борда мне нужно очистить родительский элемент
        // и добавить элементы в борд

        this.board.replaceChildren();
        this.board.className = "leaderboard-wrapper";
// создаю заголовок для борда
        const title = document.createElement("h2");
        title.textContent = "ТОП ИГРОКОВ";
        this.board.append(title);
        // список лидеров
        const list = document.createElement("div");
        list.className = "leader-list";
        this.board.append(list);
// делаю запрос на сервер
        fetch('http://localhost:3000/api/get_top_players')
            .then(res => res.json())

            .then(data => {
                const playerList = document.createElement("ol");
                for (let i = 0; i < data.length; i++) {
                    const player = data[i];
                    const li = document.createElement("li");
                    const playerName = player.name;
                    const playerPoints = player.scores;
                    li.textContent = `Игрок: ${playerName} - Очки: ${playerPoints}`;

                    playerList.append(li);
                }
                list.append(playerList);

                // console.log(data);
            })
        //     const item = document.createElement("div");
        // item.className = "leader-item";

// теперь нужен список всех игровко и очки.
// список находиться в дате, теперь мне нужно вывести его. Можно через массив.


        super.show();
    }
}