import TargetIndex from '../objects/targetIndex';
import Cat from '../objects/cat';
import NumberList from '../objects/numberList';

export default class MainScene extends Phaser.Scene {

    private background: Phaser.GameObjects.Image;
    private cat: Cat;
    private listGroup: NumberList;
    private targetIndex: TargetIndex;

    private newListFrequency: number = 10000;

    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        this.setupStaticParts();
        this.cat = new Cat(this, 0, 0);
        this.targetIndex = new TargetIndex(this, 0, 0);
        this.listGroup = new NumberList(this, 0, 0);
        this.startLoopingRounds();
    }

    setupStaticParts() {
        // Screen width and height
        const width = this.scale.width;
        const height = this.scale.height;

        this.background = this.add.image(width/2, height/2, 'backdrop');

        let instructions = this.add.text(width/2, 0, 'Pet the cat, but only on the correct index.',
            {fontSize: 30, color: 'black'});
        instructions.setOrigin(.5, 0);
    }

    startLoopingRounds() {
        this.time.addEvent({
            delay: this.newListFrequency,
            callback: this.newRound,
            callbackScope: this,
            loop: true
        });
        this.newRound();
    }

    newRound() {
        let catBodyCount = Phaser.Math.Between(2, this.cat.MAX_BODY_COUNT);
        let catBodyWidth = this.cat.updateCatBodyPosition(catBodyCount);
        this.listGroup.updatePosition(this.cat);
        this.listGroup.resetNumbers(catBodyCount, catBodyWidth);
        this.input.on('gameobjectdown', this.pet, this);
        this.targetIndex.updateIndex(this.listGroup.length);
    }


    pet(mouse, gameObject) {
        let chosen = gameObject.getData('index');
        if (chosen === this.targetIndex.getIndex()) {
            this.cat.petCatCorrectly();
        } else {
            this.cat.petCatWrong();
        }
        this.time.addEvent({
            delay: 300,
            callback: () => {
                this.cat.resetHead();
                this.targetIndex.updateIndex(this.listGroup.length);
            },
            callbackScope: this,
            loop: false,
        });
    }
}
