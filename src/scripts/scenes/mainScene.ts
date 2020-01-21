import ExampleObject from '../objects/exampleObject';

export default class MainScene extends Phaser.Scene {
  private exampleObject: ExampleObject;
  private catHead: Phaser.GameObjects.Image;
  private catTail: Phaser.GameObjects.Image;
  private background: Phaser.GameObjects.Image;
  private catMiddle: Phaser.GameObjects.TileSprite;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    this.background = this.add.image(0, 0, 'backdrop');
    this.background.setOrigin(0, 0);

    this.catHead = this.add.image(0, 0, 'cat-head-neutral');
    this.catHead.setScale(.5, .5);
    this.catHead.setOrigin(1, .5);
    this.catTail = this.add.image(0, 0, 'cat-tail');
    this.catTail.setScale(.5, .5);
    this.catTail.setOrigin(0, .5);

    this.catMiddle = this.add.tileSprite(0, 0, 0, 0, 'cat-middle');
    this.catMiddle.setScale(.5, .5);

    this.updateCatBodyPosition(4);

    this.time.addEvent({delay: 10000, callback: () => {
      this.updateCatBodyPosition(Phaser.Math.Between(2, 5));
      console.log("Change size!");
      }, callbackScope: this, loop: true})
  }

  updateCatBodyPosition(catBodyCount) {
    let catBodyWidth = this.textures.get('cat-middle').getSourceImage().width;
    let catBodyHeight = this.textures.get('cat-middle').getSourceImage().height;
    let catWidth = catBodyWidth*catBodyCount;
    let catBodyOffset = 20;
    this.catHead.setPosition(this.scale.width/2-catWidth/4, this.scale.height/2);
    this.catTail.setPosition(this.scale.width/2+catWidth/4, this.scale.height/2);
    this.catMiddle.setPosition(this.scale.width/2, this.scale.height/2+catBodyOffset);
    this.catMiddle.setSize(catWidth, catBodyHeight);
  }

  update() {
  }
}
