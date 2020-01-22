export default class TargetIndex extends Phaser.GameObjects.Container {

    private readonly precedingText: Phaser.GameObjects.Text;
    private readonly targetIndexText: Phaser.GameObjects.Text;
    private readonly PRECEDING_TEXT_STRING : string = "Click index:";

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, []);
        scene.add.existing(this);

        this.setData('index', null);

        this.precedingText = scene.add.text(0, 0, this.PRECEDING_TEXT_STRING,
            {fontSize: 40, color: 'black'});
        this.precedingText.setOrigin(1, .5);

        this.targetIndexText = scene.add.text(0, 0, "",
            {fontSize: 80, color: 'black'});
        this.targetIndexText.setOrigin(0, .5);

        this.add([this.precedingText, this.targetIndexText]);
    }

    updateIndex(count) {
        let targetIndex = Phaser.Math.Between(0, count-1);
        this.targetIndexText.setText(""+targetIndex);
        this.setData('index', targetIndex);
    }

    getIndex() {
        return this.getData('index');
    }
}
