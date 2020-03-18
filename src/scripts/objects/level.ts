/**
 * The different types of levels, whether it asks the player to pick an Index,
 * a Subscript, or potentially either (both). Also has the special "Win" type
 * of level, holding the end.
 * TODO: Have a proper separate ending Scene instead of a hacky Win level.
 */
export enum LevelType {
    Index,
    Subscript,
    Both,
    Win
}

/**
 * Our levels use simple anonymous functions to generate their values, length, and indices.
 * These type definitions formalize those functions more concretely.
 */
export type ValueGenerator = (n: number) => string;
// A function that consumes nothing but returns a number when executed (e.g., at random).
type LengthGenerator = () => number;
// A function that consumes a number and returns a list of numbers (some of which may be null)
type IndexGenerator = (n: number) => Array<number | string | null>;

/**
 * Plain Old JavaScript Object to hold the representation of a Level.
 */
export class Level {
    public name: string;
    public type: LevelType;
    public generateLength: LengthGenerator;
    public generateValue: ValueGenerator;
    public generateIndex: IndexGenerator;

    /**
     * Sets up a new level with the given name, type, and generators.
     * @param name The name of this level.
     * @param type The LevelType of this level.
     * @param generateLength This function determines the length of the list for a given round.
     * @param generateValue This function is used to generate the values within the list that we're indexing.
     * @param generateIndex This function is used to generate the indexes the player is targetting. Can also
     * double as a message in a pinch.
     */
    constructor(name: string, type: LevelType, generateLength: LengthGenerator,
        generateValue: ValueGenerator, generateIndex: IndexGenerator) {
        this.name = name;
        this.type = type;
        this.generateValue = generateValue;
        this.generateLength = generateLength;
        this.generateIndex = generateIndex;
    }
}
