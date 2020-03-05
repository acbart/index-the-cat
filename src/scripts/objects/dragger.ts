const DRAGGER_COLOR: number = 0xff00ff;
const DRAGGER_HEIGHT: number = 90;
const DRAGGER_WIDTH: number = 65;
const DRAGGER_X_OFFSET: number = 15;

export class Dragger extends Phaser.GameObjects.Rectangle {
    public startIndex: number | null;
    public endIndex: number | null;

    constructor(scene, x, y, width) {
        super(scene, x, y, width, DRAGGER_HEIGHT, DRAGGER_COLOR, .5);
        scene.add.existing(this);
        this.setVisible(false);
        this.startIndex = null;
        this.endIndex = null;
    }

    start(x, y, startIndex) {
        this.setPosition(x - DRAGGER_X_OFFSET, y);
        this.setVisible(true);
        this.setActive(true);
        this.width = DRAGGER_WIDTH;
        this.startIndex = startIndex;
    }

    move(x, endIndex): boolean {
        if (this.startIndex === null || this.startIndex > endIndex) {
            return false;
        }
        x -= DRAGGER_X_OFFSET;
        if (x === this.x) {
            this.width = DRAGGER_WIDTH;
        } else {
            this.width = (x - this.x) + DRAGGER_WIDTH;
        }
        this.endIndex = endIndex;
        return true;
    }

    stop(x, endIndex): boolean {
        return this.move(x, endIndex);
    }

    hide() {
        this.setVisible(false);
        this.setActive(false);
        this.startIndex = null;
        this.endIndex = null;
    }
}
