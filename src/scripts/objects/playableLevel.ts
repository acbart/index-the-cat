import { Level, LevelType } from './level';

function makeSubscripts(length) {
    let result = [Phaser.Math.Between(0, length-1), Phaser.Math.Between(0, length-1)].sort();
    if (result[0] === result[1]) {
        return makeSubscripts(length);
    } else {
        return result;
    }
}

function makePartialSubscripts(length) {
    let removeFront = Phaser.Math.Between(0, 1);
    if (removeFront) {
        let result = Phaser.Math.Between(1, length-1);
        return [null, result];
    } else {
        let result = Phaser.Math.Between(0, length-2);
        return [result, null];
    }
}

function makeAnySubscripts(length) {
    let isSubscript = Phaser.Math.Between(0, 2);
    // Allow single indexes
    if (!isSubscript) {
        return [Phaser.Math.Between(-length, length-1)];
    }
    // Otherwise it'll be a subscript
    let first = Phaser.Math.Between(-length, length);
    let second = Phaser.Math.Between(-length, length);
    // Allow partials
    if (first === length || second === length) {
        return [first === length ? null : first, second === length ? null : second];
    }
    // Handle negatives and positives
    let normalizedFirst = first >= 0 ? first : length+first;
    let normalizedSecond = second >= 0 ? second : length+second;
    if (normalizedFirst === normalizedSecond) {
        return [first];
    } else if (normalizedFirst < normalizedSecond) {
        return [first, second];
    } else {
        return [second, first];
    }
}

export const PLAYABLE_LEVELS : Array<Level> = [
    new Level("Round 1", LevelType.Index,
        () => Phaser.Math.Between(4, 5),
        (length) => ""+Phaser.Math.Between(length-1, 9),
        (length) => [Phaser.Math.Between(0, length-1)]),
    new Level("The List's Values Don't Matter", LevelType.Index,
        () => Phaser.Math.Between(4, 5),
        (length) => ""+Phaser.Math.Between(0, length-1),
        (length) => [Phaser.Math.Between(0, length-1)]),
    new Level("Negative Indexing", LevelType.Index,
        () => Phaser.Math.Between(4, 5),
        (length) => ""+Phaser.Math.Between(0, 9),
        (length) => [Phaser.Math.Between(-length, -1)]),
    new Level("Drag for Subscripts", LevelType.Subscript,
        () => Phaser.Math.Between(4, 5),
        (length) => ""+Phaser.Math.Between(length-1, 9),
        makeSubscripts),
    new Level("Partial Subscripts", LevelType.Subscript,
        () => Phaser.Math.Between(4, 5),
        (length) => ""+Phaser.Math.Between(length-1, 9),
        makePartialSubscripts),
    new Level("All combos", LevelType.Both,
        () => Phaser.Math.Between(2, 5),
        (length) => ""+Phaser.Math.Between(length-1, 9),
        makeAnySubscripts),
    new Level("You finished!", LevelType.Win,
        () => 0,
        (length) => ":)",
        (length) => ["Win!"])
];
