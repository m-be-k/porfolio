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
        }
        const now = Date.now();


        if (this.startTime === 0) {

            this.startTime = now;
            this.nextTrigger = this.tickSize;
            this.elapsedTime = 0;
        } else if (this.pausedAt) {
            const pausedTime = now - this.pausedAt;
            this.startTime += pausedTime;
            this.pausedAt = 0;
        }

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


    pause() {

        if (!this.intervalId) {
            return;
        }
        clearInterval(this.intervalId);

        this.pausedAt = Date.now();
        this.intervalId = null;
        this.elapsedTime = this.pausedAt - this.startTime;
    }

    reset() {

        const wasRunning = this.intervalId;

        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.startTime = 0;
        this.pausedAt = 0;
        this.elapsedTime = 0;
        this.nextTrigger = this.tickSize;
        if (typeof this.callback === 'function') {
            this.callback(0);
        }

        if (wasRunning) {
            this.start();
        }
    }

    stop() {
        this.pause();
        this.reset();
    }

}