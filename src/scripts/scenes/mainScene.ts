import ExampleObject from '../objects/exampleObject';

export default class MainScene extends Phaser.Scene {
  private exampleObject: ExampleObject;
  private catHead: Phaser.GameObjects.Image;
  private catTail: Phaser.GameObjects.Image;
  private background: Phaser.GameObjects.Image;
  private catMiddle: Phaser.GameObjects.TileSprite;
  private catY : number = 30;
  private targetIndex : number;
  private displayedValues : Array<number>;
  private listGroup : Phaser.GameObjects.Container;
  private newListFrequency: number = 10000;
  private MAX_BODY_COUNT : number = 5;
  private targetIndexDisplay: Phaser.GameObjects.Text;
  private sfxAngryCat: Phaser.Sound.BaseSound;
  private sfxHappyCat: Phaser.Sound.BaseSound;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    this.background = this.add.image(0, 0, 'backdrop');
    this.background.setOrigin(0, 0);

    this.catHead = this.add.image(0, 0, 'cat-head-neutral');
    this.catHead.setScale(.5, .5);
    this.catHead.setOrigin(1, 1);
    this.catTail = this.add.image(0, 0, 'cat-tail');
    this.catTail.setScale(.5, .5);
    this.catTail.setOrigin(0, 1);

    this.catMiddle = this.add.tileSprite(0, 0, 0, 0, 'cat-middle');
    this.catMiddle.setScale(.5, .5);

    this.listGroup = this.add.container(0, 0, []);

    this.targetIndexDisplay = this.add.text(this.scale.width/2, 80, this.targetIndex+"");
    this.targetIndexDisplay.setFontSize(80);
    this.targetIndexDisplay.setOrigin(.5, .5);
    this.targetIndexDisplay.setColor("black");

    this.updateCatBodyPosition(4);

    this.sfxAngryCat = this.sound.add('cat-angry');
    this.sfxHappyCat = this.sound.add('cat-happy');

    this.time.addEvent({delay: this.newListFrequency, callback: () => {
      this.updateCatBodyPosition(Phaser.Math.Between(2, this.MAX_BODY_COUNT));
      console.log("Change size!");
      }, callbackScope: this, loop: true})



  }

  updateCatBodyPosition(catBodyCount) {
    let catBodyWidth = this.textures.get('cat-middle').getSourceImage().width;
    let catBodyHeight = this.textures.get('cat-middle').getSourceImage().height;
    let catWidth = catBodyWidth*catBodyCount;
    let catBodyOffset = 103;
    this.catHead.setPosition(this.scale.width/2-catWidth/4, this.scale.height-this.catY);
    this.catTail.setPosition(this.scale.width/2+catWidth/4, this.scale.height-this.catY);
    this.catMiddle.setPosition(this.scale.width/2, this.scale.height-this.catY-catBodyOffset);
    this.catMiddle.setSize(catWidth, catBodyHeight);
    let catMiddlePosition = this.catMiddle.getLeftCenter();
    this.listGroup.setPosition(catMiddlePosition.x, catMiddlePosition.y);
    this.displayedValues = [];
    this.listGroup.removeAll(true);
    for (let i = 0; i < catBodyCount; i+= 1) {
      this.displayedValues.push(Phaser.Math.Between(-9, 9));
      let text = this.add.text((i+.25)*catBodyWidth/2, -10, ""+this.displayedValues[i]);
      text.setColor("black");
      text.setFontSize(32);
      text.setData("index", i);
      text.setInteractive();
      text.input.hitArea.setPosition(-5, -20);
      text.input.hitArea.setSize(50, 50);
      this.listGroup.add(text);
    }
    this.input.on('gameobjectdown', this.checkIndex, this);
    this.targetIndex = Phaser.Math.Between(0, catBodyCount-1);
    this.targetIndexDisplay.setText("Target Index: "+this.targetIndex);
  }

  checkIndex(mouse, gameObject) {
    let chosen = gameObject.getData('index');
    console.log(chosen, this.targetIndex);
    if (chosen === this.targetIndex) {
      this.catHead.setTexture('cat-head-happy');
      this.sfxHappyCat.play();
    } else {
      this.catHead.setTexture('cat-head-mad');
      this.sfxAngryCat.play();
    }
    this.time.addEvent({delay: 500, callback: () => {
        this.catHead.setTexture('cat-head-neutral');
        this.targetIndex = Phaser.Math.Between(0, this.displayedValues.length-1);
        this.targetIndexDisplay.setText("Target Index: "+this.targetIndex);
      }, callbackScope: this, loop: false})
  }

  update() {
  }
}
