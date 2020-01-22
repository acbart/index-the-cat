export default class NumberList extends Phaser.GameObjects.Container {
    private values: Array<number>;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, []);
        scene.add.existing(this);
    }

    resetNumbers(catBodyCount, catBodyWidth) {
        this.removeAll(true);
        for (let i = 0; i < catBodyCount; i += 1) {
            let displayValue = ''+Phaser.Math.Between(0, catBodyCount+1);
            let xPosition = (i + .25 - catBodyCount/2) * catBodyWidth / 2;
            let text = this.scene.add.text(xPosition, -10, displayValue,
                {color: 'black', fontSize: 32});
            text.setData('index', i);
            text.setInteractive({ cursor: 'pointer' });
            text.input.hitArea.setPosition(-5, -20).setSize(50, 50);
            this.add(text);
        }
    }
}
