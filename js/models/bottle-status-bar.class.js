class BottleStatusBar extends DrawableObject {
    Images = [
        "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png",
        "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png",
        "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png",
        "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png",
        "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png",
        "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png",
    ];

    percentage = 0;

    constructor() {
        super();
        this.loadImages(this.Images);
        this.x = 20;
        this.y = 100;
        this.width = 200;
        this.height = 60;
        this.setPercentage(0);
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
