import { Level } from './level';

export default class TargetIndex extends Phaser.GameObjects.Container {

    private readonly precedingText: Phaser.GameObjects.Text;
    private readonly targetIndexText: Phaser.GameObjects.Text;
    private readonly PRECEDING_TEXT_STRING : string = "";

    private readonly CHOOSE_ATTEMPTS : number = 5;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, []);
        scene.add.existing(this);

        this.setData('index', null);

        let box = this.scene.add.rectangle(0, 0, 200, 100, 0x000000);
        box.setOrigin(.5, .5);
        box.setStrokeStyle(5, 0xfff);
        this.add(box);

        this.precedingText = scene.add.text(0, 0, this.PRECEDING_TEXT_STRING,
            {fontSize: 40, color: 'white'});
        this.precedingText.setOrigin(1, .5);

        this.targetIndexText = scene.add.text(0, 0, "",
            {fontSize: 80, color: 'white'});
        this.targetIndexText.setOrigin(.5, .5);

        this.add([this.precedingText, this.targetIndexText]);
    }

    updateIndex(level: Level, listLength: number) {
        let indexes = this.chooseNewIndex(listLength, level.generateIndex);
        this.targetIndexText.setText(indexes.join(":"));
        let normalizedIndex = this.normalizeIndexOrSubscript(indexes, listLength);
        this.setData('index', normalizedIndex);
    }

    private chooseNewIndex(listLength: number, generateIndex) {
        let oldIndex = this.targetIndexText.text;
        let indexes;
        for (let i = 0; i < this.CHOOSE_ATTEMPTS; i+= 1) {
            indexes = generateIndex(listLength);
            if (oldIndex !== indexes.join(":")) {
                return indexes;
            }
        }
        return indexes;
    }

    normalizeIndexOrSubscript(indexes: Array<number | null>, listLength: number) {
        if (indexes.length === 1) {
            let normalizedIndex = this.normalizeIndex(indexes[0], listLength);
            return (normalizedIndex === null) ? "error": ""+normalizedIndex;
        } else {
            return this.normalizeRange(indexes, listLength);
        }
    }

    normalizeIndex(index: number | null, listLength: number): number | null {
        if (index === null) {
            return 0;
        } else if (index < -listLength) {
            return null;
        } else if (index < 0) {
            return (listLength + index);
        } else if (index >= listLength) {
            return null;
        } else {
            return index;
        }
    }

    normalizeSecondIndex(index: number | null, listLength: number): number | null {
        if (index === null) {
            return listLength;
        } else if (index < -listLength) {
            return null;
        } else if (index < 0) {
            return (listLength + index);
        } else if (index > listLength) {
            return null;
        } else {
            return index;
        }
    }

    normalizeRange(indexes: Array<number | null>, listLength: number): string {
        let first = this.normalizeIndex(indexes[0], listLength);
        let second = this.normalizeSecondIndex(indexes[1], listLength);
        if (first === null || second === null) {
            return "error";
        } else if (first === second) {
            return "empty"; // TODO: Make this handle empty instead
        } else if (first < second) {
            if (second-first === 1) {
                return ""+first;
            } else {
                return first + ":" + second;
            }
        } else {
            if (first-second === 1) {
                return ""+second;
            }
            return second + ":" + first;
        }
    }

    getIndex() {
        return this.getData('index');
    }
}
