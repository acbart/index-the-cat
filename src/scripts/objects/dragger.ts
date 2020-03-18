// Use a purple color for the dragger
const DRAGGER_COLOR: number = 0xff00ff;
// Lazy coding here - embedding the expected numeric constants instead of dynamic calculation
const DRAGGER_HEIGHT: number = 90;
const DRAGGER_WIDTH: number = 65;
const DRAGGER_X_OFFSET: number = 15;

/**
 * Dragger object that represents the currently highlighted chunk of the cat.
 */
export class Dragger extends Phaser.GameObjects.Rectangle {
    /** Starting list index of the dragger, or null if we're not dragging */
    public startIndex: number | null;
    /** Ending list index of the dragger, or null if we're not dragging */
    public endIndex: number | null;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number) {
        super(scene, x, y, width, DRAGGER_HEIGHT, DRAGGER_COLOR, .5);
        scene.add.existing(this);
        this.hide();
    }

    /**
     * Start the dragging by making the box appear under the given position on the screen. Also needs to be
     * told which index this corresponds to.    
     * @param x The actual horizontal position of the list box on the screen
     * @param y The actual vertical position of the list box on the screen
     * @param startIndex The index within the list that we're starting on.
     */
    start(x: number, y: number, startIndex: number) {
        this.setPosition(x - DRAGGER_X_OFFSET, y)
            .setVisible(true)
            .setActive(true);
        this.width = DRAGGER_WIDTH;
        this.startIndex = startIndex;
    }

    /**
     * Adjust the current endpoint of the dragger to the new horizontal position on the screen
     * and within the list. Will abort (and return false) if the user attempts to move the
     * dragger's endpoint to before the startpoint (or if we hadn't started dragging).
     * @param x The new horizontal position of the endpoint
     * @param endIndex The new endpoint position within the list.
     */
    move(x: number, endIndex: number): boolean {
        if (this.startIndex === null || this.startIndex > endIndex) {
            return false;
        }
        x -= DRAGGER_X_OFFSET;
        if (x === this.x) {
            this.width = DRAGGER_WIDTH;
        } else {
            this.width = (x - this.x) + DRAGGER_WIDTH;
        }
        this.endIndex = endIndex;
        return true;
    }

    /**
     * Moves the Dragger to its final position. Basically the same as the `move` function.
     * @param x The new horizontal position of the endpoint
     * @param endIndex The new endpoint position within the list.
     */
    stop(x: number, endIndex: number): boolean {
        return this.move(x, endIndex);
    }

    /**
     * Hide the dragger and reset its indexes.
     */
    hide() {
        this.setVisible(false)
            .setActive(false);
        this.startIndex = null;
        this.endIndex = null;
    }
}
