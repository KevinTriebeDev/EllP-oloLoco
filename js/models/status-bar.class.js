class StatusBar extends DrawableObject {
    Images = [
        "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
        "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
        "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
        "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
        "assets/img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png",
        "assets/img/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png",
    ];

    percentage = 100;

    constructor() {
        super();
        this.loadImages(this.Images);
        this.x = 20;
        this.y = 0;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }


    setPercentage(percentage) {
        this.percentage = percentage;
        let Path = this.Images[this.resolveImageIndex()];
        this.img = this.imageCache[Path];
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
        } else if (this.percentage > 0) {
            return 5;
        }
        return 5;
    }
    

}