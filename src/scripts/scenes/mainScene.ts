/**
 * The main and really only scene of the game, where all gameplay currently occurs.
 * The cat is presented here for petting, with level transitions all occurring within this scene.
 * @packageDocumentation
 */
import { DEFAULT_FONT_SETTINGS } from '../game';
import TargetIndex from '../objects/targetIndex';
import Cat from '../objects/cat';
import NumberList from '../objects/numberList';
import { Level, LevelType } from '../objects/level';
import { Dragger } from '../objects/dragger';
import { RoundStats } from '../objects/roundStats';
import { PLAYABLE_LEVELS } from '../objects/playableLevel';

/**
 * The MainScene is the core scene where all the action happens.
 */
export default class MainScene extends Phaser.Scene {
    /**
     * The static background image.
     */
    private background: Phaser.GameObjects.Image;
    /**
     * The flexibly-sized cat
     */
    private cat: Cat;
    /**
     * The list of numbers overlaid on the cat
     */
    private listGroup: NumberList;
    /**
     * The bundle of text in the center of the screen showing the current target index.
     */
    private targetIndex: TargetIndex;
    /**
     * The text used to show the statistics for the current round.
     */
    private roundStats: RoundStats;
    /**
     * The group used to represent the user's current index highlighting.
     */
    private dragger: Dragger;
    /**
     * What level we are current on in the game.
     */
    private level: number;
    /**
     * A timer used to delay clearing out the positive/negative feedback from petting the cat.
     */
    private feedbackTimer: Phaser.Time.TimerEvent | null = null;

    /**
     * Creates the scene, setting the level to zero.
     */
    constructor() {
        super({ key: 'MainScene' });
    }

    /**
     * Creates all the objects in the scene, including the cat, target index, etc.
     */
    create() {
        this.level = 0;
        this.setupStaticParts();
        let centerX = this.scale.width / 2;
        this.cat = new Cat(this, centerX, this.scale.height);
        this.targetIndex = new TargetIndex(this, centerX, this.scale.height / 2);
        this.listGroup = new NumberList(this, centerX, this.scale.height + this.cat.CAT_BODY_OFFSET);
        this.roundStats = new RoundStats(this);
        this.dragger = new Dragger(this, 0, 0, 10);
        this.startRound();

        // Attach the petting handlers to the various input events
        this.input.on('gameobjectdown', this.startPet, this);
        this.input.on('gameobjectup', this.endPet, this);
        this.input.on('pointerup', this.endPetOutside, this);
        this.input.on('gameobjectmove', this.movePet, this);
    }

    /**
     * Initialize all the boring, unchanging objects.
     */
    setupStaticParts() {
        // Background
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'backdrop');

        // Main game instructions
        let instructions = this.add.text(this.scale.width / 2, 20,
            'Pet the cat, but only on the correct index.',
            DEFAULT_FONT_SETTINGS);
        instructions.setOrigin(.5, 0);
    }

    /**
     * Advance to the next level if we won this round.
     */
    checkRound() {
        if (this.roundStats.checkRound()) {
            this.level += 1;
            this.startRound();
        }
    }

    /**
     * Initialize a new round by:
     *  updating the cat
     *  setting up a new sequence of numbers and target,
     *  Attaching all the input events
     *  Making the cat permenently happy if we reached the final level.
     */
    startRound() {
        let level = PLAYABLE_LEVELS[this.level];
        let catBodyCount = level.generateLength();
        // Notify cat, number list, target, and dragger
        this.cat.updateCatBodyPosition(catBodyCount);
        this.listGroup.resetNumbers(catBodyCount, this.cat.CAT_BODY_WIDTH, level.generateValue);
        this.targetIndex.updateIndex(level, this.listGroup.length);
        this.dragger.hide();
        // Handle advancing the stats object
        this.roundStats.newRound(level.name);
        if (level.type === LevelType.Win) {
            this.cat.petCatCorrectly();
        }
    }

    /**
     * Respond to initial click by moving the dragger to clicked index.
     * @param mouse Information about the mouse.
     * @param gameObject The portion of the NumberList that was clicked.
     */
    startPet(mouse: Phaser.Input.Pointer, gameObject: NumberList) {
        if (!this.feedbackTimer) {
            let chosen: number = gameObject.getData('index');
            this.dragger.start(this.listGroup.x + gameObject.x + gameObject.width / 2,
                this.listGroup.y, chosen);
            this.listGroup.highlight(chosen);
        }
    }

    /**
     * Respond to dragging events.
     * @param mouse Information about the mouse.
     * @param gameObject The portion of the NumberList that was dragged.
     */
    movePet(mouse: Phaser.Input.Pointer, gameObject: NumberList) {
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

    /**
     * Respond to releasing the mouse while on top of the NumberList
     * @param mouse 
     * @param gameObject 
     */
    endPet(mouse: Phaser.Input.Pointer, gameObject: NumberList) {
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

    /**
     * Respond to the mouse being released, but we're not necessarily on the NumberList.
     * @param mouse
     */
    endPetOutside(mouse: Phaser.Input.Pointer) {
        if (this.dragger.startIndex === null) {
            return;
        }
        let indexes = [this.dragger.startIndex];
        if (this.dragger.endIndex !== null) {
            indexes.push(this.dragger.endIndex + 1);
        }
        let normalized = this.targetIndex.normalizeIndexOrSubscript(indexes, this.listGroup.length);
        this.handlePet(normalized === this.targetIndex.getIndex());
        this.dragger.hide();
    }

    /**
     * Play the animations/sound effects of the cat being either pet correctly or incorrectly,
     * and then handle the next round after a short delay.
     * @param correct 
     */
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
