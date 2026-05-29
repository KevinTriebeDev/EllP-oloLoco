class EndbossStatusBar extends DrawableObject {
    Images = [
        "assets/img/7_statusbars/2_statusbar_endboss/green/green100.png",
        "assets/img/7_statusbars/2_statusbar_endboss/green/green80.png",
        "assets/img/7_statusbars/2_statusbar_endboss/green/green60.png",
        "assets/img/7_statusbars/2_statusbar_endboss/green/green40.png",
        "assets/img/7_statusbars/2_statusbar_endboss/green/green20.png",
        "assets/img/7_statusbars/2_statusbar_endboss/green/green0.png",
    ];

    percentage = 100;

    constructor() {
        super();
        this.loadImages(this.Images);
        this.x = 500;
        this.y = 0;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.Images[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    resolveImageIndex() {
        if (this.percentage == 100) {
            return 0;
        } else if (this.percentage > 80) {
            return 1;
        } else if (this.percentage > 60) {
            return 2;
        } else if (this.percentage > 40) {
            return 3;
        } else if (this.percentage > 20) {
            return 4;
        }
        return 5;
    }
}
