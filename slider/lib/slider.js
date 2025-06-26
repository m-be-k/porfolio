self.Slider = class Slider  {
    static sliderCounter = 0;
    static sliderPromise = new Promise((resolve, reject) => {
        const style = document.createElement('link');
        const url =new URL("slider.css", import.meta.url);
        style.rel = 'stylesheet';
        style.href = url.href;

        style.onload = function () {
            resolve();
        }
        style.onerror = function () {
            reject();
        }
        document.head.append(style);
    });

    constructor(hostElement, imagesCount = 3, mainImageId = 1, slideByCount = 1) {
        this.imagesCount = imagesCount;
        this.mainImageId = mainImageId;
        this.slideByCount = slideByCount;
        this.noTransition = false;
        this.sliderId = 'photos' + Slider.sliderCounter;
        this.slidingOffset = 0;
        this.hostElement = hostElement;

        Slider.sliderCounter++;
        Slider.sliderPromise.then(() => {

            let container = document.createElement("div");
            container.classList.add('container');

            let arrowLeft = document.createElement("div");
            arrowLeft.classList.add('arrow', 'left');

            let arrowRight = document.createElement("div");
            arrowRight.classList.add('arrow', 'right');

            let photoContainer = document.createElement("div");
            photoContainer.classList.add('photo-container');
            // photoContainer.style.width = this.imagesCount * this.slidingOffset + 'px';

            let photo = document.createElement("div");
            photo.classList.add('photo');
            photo.id = this.sliderId;
            photo.style.left = "0px";

            hostElement.append(container);
            container.append(arrowLeft, photoContainer, arrowRight);
            photoContainer.append(photo);

            arrowLeft.addEventListener('click', () => this.moveLeft());
            arrowRight.addEventListener('click', () => this.moveRight());

        });
    }

    moveLeft() {
        this.movePhotos('left');
    }

    moveRight() {
        this.movePhotos('right');
    }

    movePhotos(moveTo) {
        if (this.noTransition) {
            return;
        }
        this.noTransition = true;

        const photo = this.hostElement.querySelector(`#${this.sliderId}`);
        // так как getElementById работает на уровне document, а this.hostElement это не документ
        // заменить на querySelector, и изменить
        const move = this.slideByCount * this.slidingOffset;

        photo.style.transition = 'transform 0.5s ease';
        if (moveTo === 'left') {
            photo.style.transform = `translateX(-${move}px)`;
        } else if (moveTo === 'right') {
            photo.style.transform = `translateX(${move}px)`;
        }

        setTimeout(() => {
            photo.style.transition = 'none';
            photo.style.transform = 'translateX(0px)';
            for (let i = 0; i < this.slideByCount; i++) {
                if (moveTo === 'left') {
                    photo.append(photo.firstElementChild);
                } else if (moveTo === 'right') {
                    photo.prepend(photo.lastElementChild);
                }
            }
            this.highMainImg();
            this.noTransition = false;
        }, 500);
    }

    loadImages(imagesLinks) {
        Slider.sliderPromise.then(() => {
            const elem = this.hostElement.querySelector(`#${this.sliderId}`);

            for (let i = 0; i < this.imagesCount + (this.slideByCount * 2); i++) {
                let cell = document.createElement("div");
                cell.classList.add('picture', 'simple');
                elem.append(cell);
            }

            const containers = elem.getElementsByClassName('picture');
            for (let i = 0; i < containers.length; i++) {
                let img = document.createElement('img');
                img.src = imagesLinks[i % imagesLinks.length];
                containers[i].append(img);
            }

            this.calculateRightDistance();
            this.highMainImg();
            this.calculatePhotoContainerWidth();
        });
    }

    highMainImg() {
        const pictures = this.hostElement.querySelectorAll(`#${this.sliderId} .picture`);

        pictures.forEach((picture, index) => {
            if (index === this.mainImageId + this.slideByCount) {
                picture.classList.add('main');
            } else {
                picture.classList.remove('main');
            }
        });
    }

    calculateRightDistance() {
        const pictures = this.hostElement.querySelectorAll(`#${this.sliderId} .picture`);

        if (pictures.length < 2) {
            return 0;
        }
        const rect1 = pictures[0].getBoundingClientRect();
        const rect2 = pictures[1].getBoundingClientRect();

        this.slidingOffset = rect2.right - rect1.right;
        // if(this.slidingOffset === 0){
        //     this.slidingOffset = pictures[0].offsetWidth;
        // }
        return this.slidingOffset;
    }

    calculatePhotoContainerWidth() {
        const photoContainer = this.hostElement.querySelector('.photo-container');
        if (photoContainer) {
            const width = this.imagesCount * this.calculateRightDistance();

            photoContainer.style.width = width + 'px';
        }
    }
}

// создать переменную Promise
// в которой будет хранить в себе Promise
// что бы использовать при повторной загрузки css