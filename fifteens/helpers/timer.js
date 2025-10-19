
export class Timer {
    elapsedTime = 0;
    callback = null;
    tickSize = 1000;
    frequency = 5;
    intervalId = null;
    startTime = 0;
    nextTrigger = 0;
    pausedAt = 0;

    constructor(callback, tickSize = 1000, frequency = 5) {
        this.callback = callback;
        this.tickSize = tickSize;
        this.frequency = frequency;

        const callbackType = typeof this.callback;
        if (callbackType !== 'function') {
            throw new Error(`callback должен быть function, а сейчас это ${callbackType} в значении ${callback}`);
        }
    }

    start() {
        if (this.intervalId) {
            return;
            // возвращает повторый запуск
        } // уже запущен
        // let lastTime = this.tickSize
        const now = Date.now();

        // нужно сохранить относительное прошедшее время.
        // Что бы при паузе и последующем возобновлений таймер продолжил считать
        // как будто остановка была заморозкой. А не сбрасывал начало
        // sTime - Date.now() когда начался отсчет
        //starTime - текущее время которая вызваеться при start()
        // pause - пауза
        // pausedAt = момент остановки pause()
        // 1) Если sTime не задан - то присваиваем startTime
        // И ставим триггер на tickSize
        // и начинаеться отчет с текущего момента.
        // то есть первый вызов колбэка будет через секунду tickSize

        // 2) если у нас есть pasuedAt
        // вычесляем прододжительность паузы
        // сдвигаем sTime вперед на длину паузы. Вычитаем паузы из прошедшего времени.
        // this.pasuedAt= 0 сбрасываю метку паузы.
        if (this.startTime === 0) {
            // первый запуск
            this.startTime = now;
            this.nextTrigger = this.tickSize;
            this.elapsedTime = 0;
        } else if (this.pausedAt) {
            const pausedTime = now - this.pausedAt;
            this.startTime += pausedTime;
            this.pausedAt = 0;
        }
        //
        this.intervalId = setInterval(() => {
            const elapsedLast = Date.now() - this.startTime;
            if (elapsedLast >= this.nextTrigger) {
                this.elapsedTime = elapsedLast;
                if (typeof this.callback === 'function') {
                    this.callback(this.elapsedTime);
                }
                this.nextTrigger += this.tickSize;
            }
        }, this.frequency);
    }
    //

    // нужно как то остановить интервал, потому что он заново начинается
    // условие возврата.
    //
    // так же переменные нужно сохранить в классе.
    // Передать настояще время в класс.
    //
    // C

    // Метод стар нужен, что бы запустить наш таймер в секундах.
    // нужно, что бы коллбэк срабатывал ровно раз в tickSize и передавал прошедшее со старта время
    // нужно возвращать
    // условие eplasedTime >= ticksize срабатывает 1 раз и после этого будет вызваться колбек
    // потому что eplisedTime всегда >= siezeTime

// избавиться от тысячных секунд.
    // вызываем ее в интервале
    pause() {
// запустить таймер
        // проверить запущен ли таймер
        if (!this.intervalId) {
            return;
        }
        clearInterval(this.intervalId);
        // остановить setinterval, что бы перестали итди секунды.
        // что бы таймер заморозился, в данном случае pausedAt
        // что бы можно снова вызывать start () нужен обнулить интервал
        this.pausedAt = Date.now();
        this.intervalId = null;
        this.elapsedTime = this.pausedAt - this.startTime;
    }

    reset() {
        // нужен сброс
        // останавливаем таймер если он сработает
        // сбрасываем все переменные
        const wasRunning = this.intervalId;

        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.startTime = 0;
        this.pausedAt = 0;
        this.elapsedTime = 0;
        this.nextTrigger = this.tickSize;
        if ( typeof this.callback === 'function') {
            this.callback(0);
        }
        // если до reset таймер был в запущенном состоянии — снова запускаем интервал
        if (wasRunning) {
            this.start();
        }
    }

    stop() {
        this.pause();
        this.reset();
    }

}