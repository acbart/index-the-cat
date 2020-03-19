import { Level, IndexGenerator } from './level';
import { Subscript, Slice } from './playableLevel';

type NormalizedSubscript = string | null;

/**
 * Container holding the Target Index, its explanatory text, and its surrounding rectangle.
 */
export default class TargetIndex extends Phaser.GameObjects.Container {
    /** Game object for holding the Target Index Text */
    private readonly targetIndexText: Phaser.GameObjects.Text;
    /** How many times to attempt to rechoose a target index before giving up */
    private readonly CHOOSE_ATTEMPTS: number = 5;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, []);
        scene.add.existing(this);

        this.setData('index', null);

        // Make the static box behind this text.
        let box = this.scene.add.rectangle(0, 0, 200, 100, 0x000000)
            .setOrigin(.5, .5)
            .setStrokeStyle(5, 0xfff);
        this.add(box);

        // Make the text
        this.targetIndexText = scene.add.text(0, 0, "")
            .setColor('white')
            .setFontSize(80)
            .setOrigin(.5, .5);
        this.add(this.targetIndexText);
    }

    /**
     * Pick a new target index and update the text object
     * @param level The Level object we are currently choosing an index for
     * @param listLength The length of the list we are indexing
     */
    updateIndex(level: Level, listLength: number) {
        let indexes = this.chooseNewIndex(listLength, level.generateIndex);
        this.targetIndexText.setText(indexes.join(":"));
        let normalizedIndex = this.normalizeIndexOrSubscript(indexes, listLength);
        this.setData('index', normalizedIndex);
    }

    /**
     * Actually pick a new Subscript based on the given list length and generator.
     * @param listLength The total length of the sequence we draw from
     * @param generateIndex Function that generates an index within the list.
     */
    private chooseNewIndex(listLength: number, generateIndex: IndexGenerator): Subscript {
        let oldIndex = this.targetIndexText.text;
        let indexes = generateIndex(listLength);
        // Try to ensure a new subscript, but give up after 5 failures (odds are low!)
        for (let i = 0; i < this.CHOOSE_ATTEMPTS; i += 1) {
            if (oldIndex !== indexes.join(":")) {
                return indexes;
            }
            indexes = generateIndex(listLength);
        }
        return indexes;
    }

    /**
     * Forces the Subscript into a "normalized" form that makes it easier to compare
     * functionally equivalent subscripts.
     * @param indexes The numeric list version of the subscript
     * @param listLength The length of the list we are subscripting
     */
    normalizeIndexOrSubscript(indexes: Subscript, listLength: number): NormalizedSubscript {
        if (indexes.length === 1) {
            let normalizedIndex = this.normalizeIndex(indexes[0], listLength);
            return (normalizedIndex === null) ? "error" : "" + normalizedIndex;
        } else {
            return this.normalizeRange(indexes, listLength);
        }
    }

    /**
     * Forces a number to be a reasonable index or starting subscript within the list, in
     * a normalized fashion. This means that negative indices are wrapped to become positive,
     * and a missing (null) index will be set to be zero. Null is returned if the index was
     * somehow erroneous (e.g., was greater than the list length).
     * @param index A valid Python list index (including negatives and null values)
     * @param listLength The maximum possible length of the list.
     */
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

    /**
     * Forces a number to be a reasonable ending index in a subscript, in
     * a normalized fashion. This means that negative indices are wrapped to become positive,
     * and a missing (null) index will be set to be zero. Null is returned if the index was
     * somehow erroneous (e.g., was greater than the list length).
     * @param index A valid Python list index (including negatives and null values)
     * @param listLength The maximum possible length of the list.
     */
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

    /**
     * Force the given slice of indexes into a normalized string form.  This means that negative
     * indices are wrapped to become positive, and a missing (null) index will be set
     * to be an empty string. The string "error" is returned if the index was somehow erroneous (e.g., was
     * greater than the list length). The string "empty" is returned if the slice was zero-length.
     * Otherwise, the string will look like "3:5".
     * @param indexes The slice we are trying to normalize.
     * @param listLength The maximum length of the list.
     */
    normalizeRange(indexes: Slice, listLength: number): NormalizedSubscript {
        let first = this.normalizeIndex(indexes[0], listLength);
        let second = this.normalizeSecondIndex(indexes[1], listLength);
        if (first === null || second === null) {
            return "error";
        } else if (first === second) {
            return "empty"; // TODO: Make this handle empty instead
        } else if (first < second) {
            if (second - first === 1) {
                return "" + first;
            } else {
                return first + ":" + second;
            }
        } else {
            if (first - second === 1) {
                return "" + second;
            }
            return second + ":" + first;
        }
    }

    /**
     * Retrieve the currently stored target index.
     */
    getTargetIndex(): NormalizedSubscript {
        return this.getData('index');
    }
}
