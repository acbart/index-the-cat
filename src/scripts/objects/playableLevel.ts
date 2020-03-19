import { Level, LevelType } from './level';

const Between = Phaser.Math.Between;

/** A Subscript is either a tuple of a single number (an index) or a pair
 * of numbers (a slice). This represents the way we can
 * do either indexing or slicing in Python. A null value indicates
 * that the starting/ending index is missing in a slice.
 */
export type Index = [number];
export type Slice = [number | null, number | null];
export type Subscript = Slice | Index;

/**
 * Makes a simple two-element subscript representing a slice.
 * @param length The maximum possible values of the subscripts
 */
function makeSubscripts(length: number): Slice {
    let result = [Between(0, length - 1), Between(0, length - 1)];
    // If they're not distinct, then try again
    if (result[0] === result[1]) {
        return makeSubscripts(length);
    } else {
        // Force them to be in order
        return result.sort() as Slice;
    }
}

/**
 * Makes a Subscript where either the first value or the end value is null (missing),
 * with a 50% chance either way.
 * @param length The maximum possible values of the subscripts
 */
function makePartialSubscripts(length: number): Slice {
    let removeFront = Between(0, 1);
    if (removeFront) {
        return [null, Between(1, length - 1)];
    } else {
        return [Between(0, length - 2), null];
    }
}

/**
 * Make any possible kind of subscript, either single index, two element,
 * or two element where one side is missing.
 * @param length The maximum possible values of the subscripts
 */
function makeAnySubscripts(length: number): Subscript {
    let isSubscript = Between(0, 2);
    // Allow single indexes
    if (!isSubscript) {
        return [Between(-length, length - 1)];
    }
    // Otherwise it'll be a subscript
    let first = Between(-length, length);
    let second = Between(-length, length);
    // Allow partials
    if (first === length || second === length) {
        return [first === length ? null : first, second === length ? null : second];
    }
    // Handle negatives and positives
    let normalizedFirst = first >= 0 ? first : length + first;
    let normalizedSecond = second >= 0 ? second : length + second;
    if (normalizedFirst === normalizedSecond) {
        return [first];
    } else if (normalizedFirst < normalizedSecond) {
        return [first, second];
    } else {
        return [second, first];
    }
}

/**
 * The data for the levels of the game, meant to be advanced through.
 */
export const PLAYABLE_LEVELS: Level[] = [
    new Level("Round 1", LevelType.Index,
        () => Between(4, 5),
        (length) => "" + Between(length - 1, 9),
        (length) => [Between(0, length - 1)]),
    new Level("The List's Values Don't Matter", LevelType.Index,
        () => Between(4, 5),
        (length) => "" + Between(0, length - 1),
        (length) => [Between(0, length - 1)]),
    new Level("Negative Indexing", LevelType.Index,
        () => Between(4, 5),
        (length) => "" + Between(0, 9),
        (length) => [Between(-length, -1)]),
    new Level("Drag for Subscripts", LevelType.Slice,
        () => Between(4, 5),
        (length) => "" + Between(length - 1, 9),
        makeSubscripts),
    new Level("Partial Subscripts", LevelType.Slice,
        () => Between(4, 5),
        (length) => "" + Between(length - 1, 9),
        makePartialSubscripts),
    new Level("All combos", LevelType.Subscript,
        () => Between(2, 5),
        (length) => "" + Between(length - 1, 9),
        makeAnySubscripts),
    new Level("You finished!", LevelType.Win,
        () => 0,
        (length) => ":)",
        (length) => [0])
    // TODO: Separate win scene
];
