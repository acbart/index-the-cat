export default class Cat extends Phaser.GameObjects.Container {
    private catHead: Phaser.GameObjects.Image;
    private catTail: Phaser.GameObjects.Image;
    catMiddle: Phaser.GameObjects.TileSprite;
    private catY: number = 30;

    MAX_BODY_COUNT: number = 5;

    private sfxAngryCat: Phaser.Sound.BaseSound;
    private sfxHappyCat: Phaser.Sound.BaseSound;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, []);

        this.catHead = scene.add.image(0, 0, 'cat-head-neutral');
        this.catHead.setScale(.5, .5);
        this.catHead.setOrigin(1, 1);
        this.catTail = scene.add.image(0, 0, 'cat-tail');
        this.catTail.setScale(.5, .5);
        this.catTail.setOrigin(0, 1);

        this.catMiddle = scene.add.tileSprite(0, 0, 0, 0, 'cat-middle');
        this.catMiddle.setScale(.5, .5);

        this.sfxAngryCat = scene.sound.add('cat-angry');
        this.sfxHappyCat = scene.sound.add('cat-happy');
    }

    updateCatBodyPosition(catBodyCount) {
        let catBodyWidth = this.scene.textures.get('cat-middle').getSourceImage().width;
        let catBodyHeight = this.scene.textures.get('cat-middle').getSourceImage().height;
        let catWidth = catBodyWidth * catBodyCount;
        let catBodyOffset = 103;
        this.catHead.setPosition(this.scene.scale.width / 2 - catWidth / 4, this.scene.scale.height - this.catY);
        this.catTail.setPosition(this.scene.scale.width / 2 + catWidth / 4, this.scene.scale.height - this.catY);
        this.catMiddle.setPosition(this.scene.scale.width / 2, this.scene.scale.height - this.catY - catBodyOffset);
        this.catMiddle.setSize(catWidth, catBodyHeight);
        return catBodyWidth;
    }

    petCatCorrectly() {
        this.catHead.setTexture('cat-head-happy');
        this.sfxHappyCat.play();
    }

    petCatWrong() {
        this.catHead.setTexture('cat-head-mad');
        this.sfxAngryCat.play();
    }

    resetHead() {
        this.catHead.setTexture('cat-head-neutral');
    }
}
