export enum LevelType {
    Index,
    Subscript,
    Both,
    Win
}

export class Level {
    public name: string;
    public type: LevelType;
    public generateLength: () => number;
    public generateValue: (number) => string;
    public generateIndex: (number) => Array<number | null>;

    constructor(name, type, generateLength, generateValue, generateIndex) {
        this.name = name;
        this.type = type;
        this.generateValue = generateValue;
        this.generateLength = generateLength;
        this.generateIndex = generateIndex;
    }
}
