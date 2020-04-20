var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "gameContainer",
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 300
      },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);
var seminarsCount = 0;
var seminarScoreText;
var penCount = 0;
var penText;

function preload() {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.image('seminar', 'assets/seminar.png');
  this.load.image('bomb', 'assets/bomb.png');
  this.load.image('pen', 'assets/pen.png');
  this.load.spritesheet('dude',
    'assets/dude.png', {
      frameWidth: 32,
      frameHeight: 48
    }
  );
  this.load.spritesheet('dude2',
    'assets/dude2.png', {
      frameWidth: 32,
      frameHeight: 48
    }
  );
}



var isDown = false;

function create() {
  // region World building
  background = this.add.image(400, 300, 'sky');
  keyW = this.input.keyboard.addKey('w');
  keyA = this.input.keyboard.addKey('a');
  keyD = this.input.keyboard.addKey('d');

  platforms = this.physics.add.staticGroup();
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();

  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');
  // endregion

  //region Player1 setup
  player = this.physics.add.sprite(100, 450, 'dude');
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  player2 = this.physics.add.sprite(200, 450, 'dude2');
  player2.setBounce(0.2);
  player2.setCollideWorldBounds(true);

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', {
      start: 0,
      end: 3
    }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'turn',
    frames: [{
      key: 'dude',
      frame: 4
    }],
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', {
      start: 5,
      end: 8
    }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'left2',
    frames: this.anims.generateFrameNumbers('dude2', {
      start: 0,
      end: 3
    }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'turn2',
    frames: [{
      key: 'dude2',
      frame: 4
    }],
    frameRate: 20
  });

  this.anims.create({
    key: 'right2',
    frames: this.anims.generateFrameNumbers('dude2', {
      start: 5,
      end: 8
    }),
    frameRate: 10,
    repeat: -1
  });

  this.physics.add.collider(player, platforms);
  this.physics.add.collider(player2, platforms);
  cursors = this.input.keyboard.createCursorKeys();
  // endregion

  // region Collectibles setup
  seminars = this.physics.add.group({
    key: 'seminar',
    repeat: 7,
    setXY: {
      x: 12,
      y: 0,
      stepX: 90
    }
  });

  seminars.children.iterate(function(child) {

    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

  });
  this.physics.add.collider(seminars, platforms);
  this.physics.add.overlap(player, seminars, collectStar, null, this);
  //pens
  pens = this.physics.add.group({
    key: 'pen',
    repeat: 4,
    setXY: {
      x: 120,
      y: 0,
      stepX: 120
    }
  });

  pens.children.iterate(function(child) {

    child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));

  });
  this.physics.add.collider(pens, platforms);
  this.physics.add.overlap(player2, pens, collectPen, null, this);

  seminarScoreText = this.add.text(16, 16, '\"Official\" cheat-sheet pages: ', {
    fontSize: '16px',
    fill: '#000'
  });

  seminarScoreText = this.add.text(16, 16, '\"Official\" cheat-sheet pages: ', {
    fontSize: '16px',
    fill: '#000'
  });

  penText = this.add.text(16, 40, 'Pens to give away: ', {
    fontSize: '16px',
    fill: '#000'
  });
  // endregion
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-160);

    player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);

    player.anims.play('right', true);
  } else {
    player.setVelocityX(0);

    player.anims.play('turn');
  }
  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }

  if (keyA.isDown) {
    player2.setVelocityX(-160);

    player2.anims.play('left2', true);
  } else if (keyD.isDown) {
    player2.setVelocityX(160);

    player2.anims.play('right2', true);
  } else {
    player2.setVelocityX(0);

    player2.anims.play('turn2');
  }

  if (keyW.isDown && player2.body.touching.down) {
    player2.setVelocityY(-330);
  }

  // if(keyW.isDown) {
  //   scoreText.setText('W');
  // }
}

function collectStar(player, star) {
  star.disableBody(true, true);

  seminarsCount += 1;
  seminarScoreText.setText('"Official" cheat-sheet pages: ' + seminarsCount);
  // if(score > 0) {
  //   player.setTexture('dude2');
  // }
}

function collectPen(player, pen) {
  pen.disableBody(true, true);

  penCount += 1;
  penText.setText('Pens for the exams: ' + penCount)
}
