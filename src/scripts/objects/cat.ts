/**
 * The main Cat object, which is a container of its head, tail, and stretchy body.
 */
export default class Cat extends Phaser.GameObjects.Container {
    /** The cat's head */
    private catHead: Phaser.GameObjects.Image;
    /** The cat's tail */
    private catTail: Phaser.GameObjects.Image;
    /** The cat's stretchy body */
    catMiddle: Phaser.GameObjects.TileSprite;
    public CAT_BODY_OFFSET: number = -103;
    public CAT_BODY_WIDTH: number;
    public CAT_BODY_HEIGHT: number;

    /** Maximum possible number of body segments for the cat */
    MAX_BODY_COUNT: number = 5;

    /** <Cat noises> */
    private sfxAngryCat: Phaser.Sound.BaseSound;
    private sfxHappyCat: Phaser.Sound.BaseSound;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, []);
        scene.add.existing(this);

        // Prepare head, tail, and middle
        this.catHead = scene.add.image(0, 0, 'cat-head-neutral')
            .setScale(.5, .5)
            .setOrigin(1, 1);
        this.catTail = scene.add.image(0, 0, 'cat-tail')
            .setScale(.5, .5)
            .setOrigin(0, 1);
        this.catMiddle = scene.add.tileSprite(0, 0, 0, 0, 'cat-middle')
            .setScale(.5, .5);
        this.add([this.catHead, this.catTail, this.catMiddle]);

        // Figure out the size of the Cat's middle dynamically, avoid storing image constants
        let catMiddle = this.scene.textures.get('cat-middle').getSourceImage();
        this.CAT_BODY_WIDTH = catMiddle.width;
        this.CAT_BODY_HEIGHT = catMiddle.height;

        // Set up the sounds
        this.sfxAngryCat = scene.sound.add('cat-angry');
        this.sfxHappyCat = scene.sound.add('cat-happy');
    }

    /**
     * Update the horizontal and vertical postiion of the head, tail, and middle based on the
     * size of the cat.
     * @param catBodyCount Number of body segments in the cat this time.
     */
    updateCatBodyPosition(catBodyCount: number) {
        let catWidth = this.CAT_BODY_WIDTH * catBodyCount;
        this.catHead.setPosition(-catWidth / 4, 0);
        this.catTail.setPosition(catWidth / 4, 0);
        this.catMiddle.setPosition(0, this.CAT_BODY_OFFSET);
        this.catMiddle.setSize(catWidth, this.CAT_BODY_HEIGHT);
    }

    /**
     * Make the cat look happy and play the happy cat noise.
     */
    petCatCorrectly() {
        this.catHead.setTexture('cat-head-happy');
        this.sfxHappyCat.play();
    }

    /**
     * Make the cat look mad and play the grumpy cat noise.
     */
    petCatWrong() {
        this.catHead.setTexture('cat-head-mad');
        this.sfxAngryCat.play();
    }

    /**
     * Put the cat's head back to normal.
     */
    resetHead() {
        this.catHead.setTexture('cat-head-neutral');
    }
}
