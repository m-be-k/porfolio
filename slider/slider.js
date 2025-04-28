class Slider {
    static sliderCounter = 0;
    constructor(sliderId, imagesCount = 3, mainImageId = 1, slideByCount = 1) {
        this.imagesCount = imagesCount;
        this.mainImageId = mainImageId;
        this.slideByCount = slideByCount;
        this.noTransition = false;
        // добавить айди
        this.sliderId = 'photos' + Slider.sliderCounter;
        Slider.sliderCounter++;

        let container = document.createElement("div");
        container.classList.add('container');

        let arrowLeft = document.createElement("div");
        arrowLeft.classList.add('arrow', 'left');

        let arrowRight = document.createElement("div");
        arrowRight.classList.add('arrow', 'right');

        let photoContainer = document.createElement("div");
        photoContainer.classList.add('photo-container');
        photoContainer.style.width = this.imagesCount * 175 + 'px';

        let photo = document.createElement("div");
        photo.classList.add('photo');
        photo.id = this.sliderId; // присвоить для каждого слайдера свой айдишник
        photo.style.left = "0px";

        sliderId.append(container);
        container.append(arrowLeft, photoContainer, arrowRight);
        photoContainer.append(photo);

        arrowLeft.addEventListener('click', () => this.moveLeft());
        arrowRight.addEventListener('click', () => this.moveRight());
    }

    moveLeft() {
        this.movePhotos('left');
    }

    moveRight() {
        this.movePhotos('right');
    }

    loadImages(imagesLinks) {
        const elem = document.getElementById(this.sliderId); // изменить photos на slider
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
        this.highMainImg();
    }

    highMainImg() {
        const pictures = document.querySelectorAll( `#${this.sliderId} .picture`);

        pictures.forEach((picture, index) => {
            if (index === this.mainImageId + this.slideByCount) {
                picture.classList.add('main');
            } else {
                picture.classList.remove('main');
            }
        });
    }

    movePhotos(moveTo) {
        if (this.noTransition) {
            return;
        }
        this.noTransition = true;

        const photo = document.getElementById(this.sliderId);
        const move = this.slideByCount * 175;

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
}
