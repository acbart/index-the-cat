export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    // Cat graphics
    this.load.image("cat-head-neutral", "assets/img/cat/cat_head_neutral.png");
    this.load.image("cat-head-mad", "assets/img/cat/cat_head_mad.png");
    this.load.image("cat-head-happy", "assets/img/cat/cat_head_happy.png");
    this.load.image("cat-tail", "assets/img/cat/cat_tail.png");
    this.load.image("cat-middle", "assets/img/cat/cat_middle.png");

    // Cat SFX
    this.load.audio('cat-angry', ["assets/audio/cat-angry.mp3", "assets/audio/cat-angry.ogg"]);
    this.load.audio('cat-happy', ["assets/audio/cat-happy.mp3", "assets/audio/cat-happy.ogg"]);

    // Background
    this.load.image("backdrop", "assets/img/backdrop-thin.png");
  }

  create() {
    this.scene.start('MainScene');
  }
}
