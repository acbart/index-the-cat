import TargetIndex from '../objects/targetIndex';
import Cat from '../objects/cat';
import NumberList from '../objects/numberList';
import { Level, LevelType } from '../objects/level';
import { Dragger } from '../objects/dragger';
import { RoundStats } from '../objects/roundStats';
import { PLAYABLE_LEVELS } from '../objects/playable_levels';

export default class MainScene extends Phaser.Scene {

    private background: Phaser.GameObjects.Image;
    private cat: Cat;
    private listGroup: NumberList;
    private targetIndex: TargetIndex;
    private roundStats: RoundStats;
    private dragger: Dragger;

    private level: number;
    private feedbackTimer: Phaser.Time.TimerEvent | null = null;

    constructor() {
        super({ key: 'MainScene' });
        this.level = 0;
    }

    create() {
        this.setupStaticParts();
        let centerX = this.scale.width/2;
        this.cat = new Cat(this, centerX, this.scale.height);
        this.targetIndex = new TargetIndex(this, centerX, this.scale.height/2);
        this.listGroup = new NumberList(this, centerX, this.scale.height+this.cat.CAT_BODY_OFFSET);
        this.roundStats = new RoundStats(this);
        this.dragger = new Dragger(this,0, 0, 10);
        this.startRound();
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

    checkRound() {
        if (this.roundStats.checkRound()) {
            this.level += 1;
            this.startRound();
        }
    }

    startRound() {
        let level = PLAYABLE_LEVELS[this.level];
        let catBodyCount = level.generateLength();
        this.cat.updateCatBodyPosition(catBodyCount);
        this.listGroup.resetNumbers(catBodyCount, this.cat.CAT_BODY_WIDTH, level.generateValue);
        this.input.on('gameobjectdown', this.startPet, this);
        this.input.on('gameobjectup', this.endPet, this);
        this.input.on('pointerup', this.endPetOutside, this);
        this.input.on('gameobjectmove', this.movePet, this);
        this.targetIndex.updateIndex(level, this.listGroup.length);
        this.dragger.hide();
        this.roundStats.newRound(level.name);
        if (level.type === LevelType.Win) {
            this.cat.petCatCorrectly();
        }
    }

    startPet(mouse, gameObject) {
        if (!this.feedbackTimer) {
            let chosen = gameObject.getData('index');
            this.dragger.start(this.listGroup.x + gameObject.x + gameObject.width / 2, this.listGroup.y, chosen);
            this.listGroup.highlight(chosen);
        }
    }

    movePet(mouse, gameObject) {
        if (this.dragger.startIndex === null) {
            return;
        }
        let chosen = gameObject.getData('index');
        if (chosen !== this.dragger.endIndex) {
            let moved = this.dragger.move(this.listGroup.x + gameObject.x + gameObject.width / 2, chosen);
            if (moved) {
                this.listGroup.highlightRange(this.dragger.startIndex, chosen);
            }
        }
    }

    endPet(mouse, gameObject) {
        if (this.dragger.startIndex === null) {
            return;
        }
        let chosen = gameObject.getData('index');
        if (chosen !== this.dragger.endIndex) {
            let moved = this.dragger.move(this.listGroup.x + gameObject.x + gameObject.width / 2, chosen);
            if (moved) {
                this.listGroup.highlightRange(this.dragger.startIndex, this.dragger.endIndex);
            }
        }
        this.endPetOutside(mouse);
    }

    endPetOutside(mouse) {
        if (this.dragger.startIndex === null) {
            return;
        }
        let indexes = [this.dragger.startIndex];
        if (this.dragger.endIndex !== null) {
            indexes.push(this.dragger.endIndex+1);
        }
        let normalized = this.targetIndex.normalizeIndexOrSubscript(indexes, this.listGroup.length);
        console.log(indexes, normalized, this.targetIndex.getIndex());
        this.handlePet(normalized === this.targetIndex.getIndex());
        this.dragger.hide();
    }

    private handlePet(correct: boolean) {
        if (correct) {
            this.cat.petCatCorrectly();
            this.roundStats.correct();
        } else {
            this.cat.petCatWrong();
            this.roundStats.wrong();
        }
        this.feedbackTimer = this.time.addEvent({
            delay: 300,
            callback: () => {
                this.listGroup.removeHighlights();
                this.checkRound();
                this.cat.resetHead();
                this.targetIndex.updateIndex(PLAYABLE_LEVELS[this.level], this.listGroup.length);
                this.feedbackTimer = null;
            },
            callbackScope: this,
            loop: false,
        });
    }
}
