export class RoundStats extends Phaser.GameObjects.Group {
    private overallCorrect: number;
    private overallWrong: number;
    private roundCorrect: number;
    private roundWrong: number;
    private ROUND_WIN_THRESHOLD: number = 3;
    private roundName: string;

    private roundText: Phaser.GameObjects.Text;
    private overallText: Phaser.GameObjects.Text;

    constructor(scene) {
        super(scene, []);
        this.overallCorrect = 0;
        this.overallWrong = 0;
        this.roundCorrect = 0;
        this.roundWrong = 0;

        let style = {color: 'black', fontSize: 32};
        this.roundText = this.scene.add.text(10, this.scene.scale.height/3, "Round", style);
        this.roundText.setOrigin(0, .5);
        this.add(this.roundText, true);
        this.overallText = this.scene.add.text(this.scene.scale.width-10, this.scene.scale.height/3, "Overall", style);
        this.overallText.setOrigin(1, .5);
        this.overallText.setAlign('right');
        this.add(this.overallText, true);
    }

    correct() {
        this.roundCorrect += 1;
        this.overallCorrect += 1;
        this.updateStats();
    }

    wrong() {
        this.roundWrong += 1;
        this.overallWrong += 1;
        this.updateStats();
    }

    newRound(name: string) {
        this.roundCorrect = 0;
        this.roundWrong = 0;
        this.roundName = name;
        this.updateStats();
    }

    checkRound(): boolean {
        return this.roundCorrect - this.roundWrong > this.ROUND_WIN_THRESHOLD;
    }

    updateStats() {
        this.roundText.setText(`${this.roundName}\nCorrect: ${this.roundCorrect}\nWrong: ${this.roundWrong}`);
        this.overallText.setText(`Overall\nCorrect: ${this.overallCorrect}\nWrong: ${this.overallWrong}`);
    }
}
