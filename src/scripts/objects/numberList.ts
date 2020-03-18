import { DEFAULT_FONT_SETTINGS } from "../game";
import { ValueGenerator } from "./level";

/**
 * Container holding the values (list elements) shown on top of the cat.
 */
export default class NumberList extends Phaser.GameObjects.Container {
    /** The current sequence of values to overlay on the cat's body. */
    private values: Array<number>;
    /** Vertical offset of the numbers from the body of the cat */
    private CAT_VERTICAL_OFFSET: number = -10;

    /** The HitArea for all the numbers is slightly bigger than the number itself, based on some
     * light experimenting. Necessary to also specify the hitAreaCallback to have it respond
     * to mouse presses.
    */
    private INTERACTIVE_HITAREA_RECTANGLE = {
        cursor: 'pointer',
        hitArea: new Phaser.Geom.Rectangle(-15, -35, 70, 80),
        hitAreaCallback: Phaser.Geom.Rectangle.Contains
    };

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, []);
        scene.add.existing(this);
    }

    /**
     * Delete all existing values and create new ones.
     * @param catBodyCount Number of segments in the cat's body
     * @param catBodyWidth Total width of the cat's body in pixels
     * @param generateValue Function used to generate the list values.
     */
    resetNumbers(catBodyCount: number, catBodyWidth: number, generateValue: ValueGenerator) {
        this.removeAll(true);
        for (let i = 0; i < catBodyCount; i += 1) {
            let displayValue = generateValue(catBodyCount);
            let text = this.makeValue(catBodyCount, catBodyWidth, displayValue, i);
            this.add(text);
        }
    }

    /**
     * Create a new text object that represents a value on top of the cat.
     * @param catBodyCount Number of segments in the cat's body
     * @param catBodyWidth Total width of the cat's body in pixels
     * @param generateValue Function used to generate the list values.
     * @param index The index of this value
     */
    private makeValue(catBodyCount: number, catBodyWidth: number, displayValue: string, index: number) {
        // Offset X Position slightly to the right within the given cell index
        let xPosition = (index + .25 - catBodyCount / 2) * catBodyWidth / 2;
        // Each number is a text object
        let text = this.scene.add.text(xPosition, this.CAT_VERTICAL_OFFSET, displayValue);
        // Keep track of the index for the given text number
        text.setData('index', index);
        this.reformatText(text, false);
        return text;
    }

    /**
     * Fix up the given Text object to have the proper size, color, and hitbox. The color is determined
     * by the highlighted parameter.
     * @param text The text object to fix on the screen.
     * @param highlighted Whether or not the text will be highlighted
     */
    private reformatText(text: Phaser.GameObjects.Text, highlighted: boolean) {
        text.setFontSize(DEFAULT_FONT_SETTINGS.fontSize)
            .setInteractive(this.INTERACTIVE_HITAREA_RECTANGLE)
            .setColor(highlighted ? DEFAULT_FONT_SETTINGS.highlight : DEFAULT_FONT_SETTINGS.color);
    }

    /**
     * Highlight the value's text at the given index.
     * @param index The index of the value to highlight.
     */
    highlight(index: number) {
        // Safe typecast because we'll only put Text objects into this container.
        let text = this.getAt(index) as Phaser.GameObjects.Text;
        this.reformatText(text, true);
    }

    /**
     * Highlight all the indexes between the given start and stop indexes.
     * @param start The starting index
     * @param stop The stopping index
     */
    highlightRange(start: number, stop: number) {
        // Force start to come before stop index
        if (start > stop) {
            let temp = start;
            start = stop;
            stop = temp;
        }
        // Iterate through all values, setting highlight based on whether its within the start/stop range
        this.getAll().map((text: Phaser.GameObjects.GameObject, index: number) => {
            this.reformatText(text as Phaser.GameObjects.Text, start <= index && index <= stop);
        });
    }

    /**
     * Iterate through all the values and turn off the highlight for each one.
     */
    removeHighlights() {
        this.getAll().map((text: Phaser.GameObjects.GameObject) =>
            this.reformatText((text as Phaser.GameObjects.Text), false));
    }
}
