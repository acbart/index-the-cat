export default class Cat extends Phaser.GameObjects.Container {
    private catHead: Phaser.GameObjects.Image;
    private catTail: Phaser.GameObjects.Image;
    catMiddle: Phaser.GameObjects.TileSprite;
    private catY: number = 30;
    public CAT_BODY_OFFSET: number = -103;
    public CAT_BODY_WIDTH: number;
    public CAT_BODY_HEIGHT: number;

    MAX_BODY_COUNT: number = 5;

    private sfxAngryCat: Phaser.Sound.BaseSound;
    private sfxHappyCat: Phaser.Sound.BaseSound;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, []);
        scene.add.existing(this);

        this.catHead = scene.add.image(0, 0, 'cat-head-neutral');
        this.catHead.setScale(.5, .5);
        this.catHead.setOrigin(1, 1);

        this.catTail = scene.add.image(0, 0, 'cat-tail');
        this.catTail.setScale(.5, .5);
        this.catTail.setOrigin(0, 1);

        this.catMiddle = scene.add.tileSprite(0, 0, 0, 0, 'cat-middle');
        this.catMiddle.setScale(.5, .5);

        this.CAT_BODY_WIDTH = this.scene.textures.get('cat-middle').getSourceImage().width;
        this.CAT_BODY_HEIGHT = this.scene.textures.get('cat-middle').getSourceImage().height;

        this.add([this.catHead, this.catTail, this.catMiddle]);

        this.sfxAngryCat = scene.sound.add('cat-angry');
        this.sfxHappyCat = scene.sound.add('cat-happy');
    }

    updateCatBodyPosition(catBodyCount) {
        let catWidth = this.CAT_BODY_WIDTH * catBodyCount;
        this.catHead.setPosition(-catWidth / 4, 0);
        this.catTail.setPosition(catWidth / 4, 0);
        this.catMiddle.setPosition(0, this.CAT_BODY_OFFSET);
        this.catMiddle.setSize(catWidth, this.CAT_BODY_HEIGHT);
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
