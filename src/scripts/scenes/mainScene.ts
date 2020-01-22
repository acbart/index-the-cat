import TargetIndex from '../objects/targetIndex';
import Cat from '../objects/cat';
import NumberList from '../objects/numberList';

export default class MainScene extends Phaser.Scene {

    private background: Phaser.GameObjects.Image;
    private cat: Cat;
    private listGroup: NumberList;
    private targetIndex: TargetIndex;
    private roundTimer: Phaser.Time.TimerEvent;

    private startPetIndex: number | null = null;
    private endPetIndex: number | null = null;

    private newListFrequency: number = 10000;


    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        this.setupStaticParts();
        let centerX = this.scale.width/2;
        this.cat = new Cat(this, centerX, this.scale.height);
        this.targetIndex = new TargetIndex(this, centerX, this.scale.height/2);
        this.listGroup = new NumberList(this, centerX, this.scale.height+this.cat.CAT_BODY_OFFSET);
        this.startLoopingRounds();
    }

    setupStaticParts() {
        // Screen width and height
        const width = this.scale.width;
        const height = this.scale.height;

        this.background = this.add.image(width/2, height/2, 'backdrop');

        let instructions = this.add.text(width/2, 20, 'Pet the cat, but only on the correct index.',
            {fontSize: 30, color: 'black'});
        instructions.setOrigin(.5, 0);
    }

    startLoopingRounds() {
        this.roundTimer = this.time.addEvent({
            delay: this.newListFrequency,
            callback: this.newRound,
            callbackScope: this,
            loop: true
        });
        this.newRound();
    }

    newRound() {
        let catBodyCount = Phaser.Math.Between(2, this.cat.MAX_BODY_COUNT);
        this.cat.updateCatBodyPosition(catBodyCount);
        this.listGroup.resetNumbers(catBodyCount, this.cat.CAT_BODY_WIDTH);
        this.input.on('gameobjectdown', this.startPet, this);
        this.input.on('gameobjectup', this.endPet, this);
        this.input.on('gameobjectmove', this.movePet, this);
        this.targetIndex.updateIndex(this.listGroup.length);
        this.startPetIndex = null;
        this.endPetIndex = null;
    }

    startPet(mouse, gameObject) {
        let chosen = gameObject.getData('index');
        this.startPetIndex = chosen;
        this.endPetIndex = chosen;
        console.log("Start", chosen);
    }

    movePet(mouse, gameObject) {
        let chosen = gameObject.getData('index');
        this.endPetIndex = chosen;
    }

    endPet(mouse, gameObject) {
        let chosen = gameObject.getData('index');
        this.endPetIndex = chosen;
        console.log(this.startPetIndex, this.endPetIndex);
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
