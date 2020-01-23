export default class NumberList extends Phaser.GameObjects.Container {
    private values: Array<number>;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, []);
        scene.add.existing(this);
    }

    resetNumbers(catBodyCount, catBodyWidth, generateValue) {
        this.removeAll(true);
        for (let i = 0; i < catBodyCount; i += 1) {
            let displayValue = generateValue(catBodyCount);
            let xPosition = (i + .25 - catBodyCount/2) * catBodyWidth / 2;
            let text = this.scene.add.text(xPosition, -10, displayValue);
            text.setData('index', i);
            this.reformatText(text, false);
            this.add(text);
            //this.scene.physics.world.enable(text);
        }
    }

    reformatText(text: Phaser.GameObjects.Text, highlighted: boolean) {
        if (highlighted) {
            text.setColor('red');
        } else {
            text.setColor('black');
        }
        text.setFontSize(32);
        text.setInteractive({ cursor: 'pointer' });
        text.input.hitArea.setPosition(-15, -35).setSize(70, 80);
    }

    highlight(index) {
        let text = (this.getAt(index) as Phaser.GameObjects.Text);
        this.reformatText(text, true);
    }

    highlightRange(start, stop) {
        if (start > stop) {
            let temp = start;
            start = stop;
            stop = temp;
        }
        this.getAll().map( (text, index) => {
            this.reformatText((text as Phaser.GameObjects.Text), (start <= index && index <= stop));
        });
    }

    removeHighlights() {
        this.getAll().map(text =>
            this.reformatText((text as Phaser.GameObjects.Text), false));
    }
}
