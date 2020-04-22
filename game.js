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
var background;
var platforms;
var platforms2;
var player;
var player2;
var base;
var seminar_dudes;
var pen_dudes;
var friendsHelped = 0;
var congratsText;

function preload() {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.image('seminar', 'assets/seminar.png');
  this.load.image('bomb', 'assets/bomb.png');
  this.load.image('pen', 'assets/pen.png');
  this.load.image('floor', 'assets/classroom_platform.png');
  this.load.image('classroom', 'assets/classroom.jpg');
  this.load.image('seminar_dude', 'assets/seminar_dude.png');
  this.load.image('seminar_done_dude', 'assets/seminar_done_dude.png');
  this.load.image('pen_dude', 'assets/pen_dude.png');
  this.load.image('pen_done_dude', 'assets/pen_done_dude.png');
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
  keyW = this.input.keyboard.addKey('w');
  keyA = this.input.keyboard.addKey('a');
  keyD = this.input.keyboard.addKey('d');
  cursors = this.input.keyboard.createCursorKeys();
  setLevelOnePlatforms(this);
  initLevelTwoPlatformsSet(this);

  initScoreBoard(this);
  initCongratsText(this);
  initPlayerOne(this);
  initPlayerTwo(this);

  initSeminarsToCollect(this);
  initPensToCollect(this);
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
}

function collectSeminar(player, star) {
  star.disableBody(true, true);

  seminarsCount += 1;
  seminarScoreText.setText('"Official" cheat-sheet pages: ' + seminarsCount);
  if (seminarsCount > 7 && penCount > 4) {
    swapLevels();
  }
}

function collectPen(player, pen) {
  pen.disableBody(true, true);

  penCount += 1;
  penText.setText('Pens for the exams: ' + penCount)
  if (seminarsCount > 7 && penCount > 4) {
    swapLevels();
  }
}

function handSeminar(player, friend) {
  friend.setTexture('seminar_done_dude');
  friend.disableBody(true, false);
  friendsHelped += 1;
  seminarScoreText.setText("Friends helped: " + friendsHelped + "/8");
  if(friendsHelped == 8) {
    congratsText.setText('Congratulations for helping your mates pass!');
  }
}

function handPen(player, friend) {
  friend.setTexture('pen_done_dude');
  friend.disableBody(true, false);
  friendsHelped += 1;
  seminarScoreText.setText("Friends helped: " + friendsHelped + "/8");
  if(friendsHelped == 8) {
    congratsText.setText('Congratulations for helping your mates pass!');
  }
}

function swapLevels() {
  platforms.children.iterate(function(child) {

    child.disableBody(true, true);

  });
  platforms.clear();
  background.setTexture('classroom');
  base.create(400, 568, 'floor').setScale(2).refreshBody();

  setLevelTwoPlatforms();
  initLevelTwoScoreBoard();
  initSeminarDudes();
  initPenDudes();

  player.x = 100;
  player.y = 450;

  player2.x = 150;
  player2.y = 450;
}

function initLevelTwoPlatformsSet(game) {
  platforms2 = game.physics.add.staticGroup();
  seminar_dudes = game.physics.add.staticGroup();
  pen_dudes = game.physics.add.staticGroup();
}

function setLevelTwoPlatforms() {
  platforms2.create(700, 400, 'floor');
  platforms2.create(750, 240, 'floor');
  platforms2.create(100, 200, 'floor');
  platforms2.create(120, 320, 'floor');
}

function setLevelOnePlatforms(game) {
  background = game.add.image(400, 300, 'sky');
  platforms = game.physics.add.staticGroup();
  base = game.physics.add.staticGroup();
  base.create(400, 568, 'ground').setScale(2).refreshBody();

  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');
}

function initPlayerOne(game) {
  player = game.physics.add.sprite(100, 450, 'dude');
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  game.anims.create({
    key: 'left',
    frames: game.anims.generateFrameNumbers('dude', {
      start: 0,
      end: 3
    }),
    frameRate: 10,
    repeat: -1
  });

  game.anims.create({
    key: 'turn',
    frames: [{
      key: 'dude',
      frame: 4
    }],
    frameRate: 20
  });

  game.anims.create({
    key: 'right',
    frames: game.anims.generateFrameNumbers('dude', {
      start: 5,
      end: 8
    }),
    frameRate: 10,
    repeat: -1
  });

  game.physics.add.collider(player, base);
  game.physics.add.collider(player, platforms);
  game.physics.add.collider(player, platforms2);
}

function initPlayerTwo(game) {
  player2 = game.physics.add.sprite(200, 450, 'dude2');
  player2.setBounce(0.2);
  player2.setCollideWorldBounds(true);

  game.anims.create({
    key: 'left2',
    frames: game.anims.generateFrameNumbers('dude2', {
      start: 0,
      end: 3
    }),
    frameRate: 10,
    repeat: -1
  });

  game.anims.create({
    key: 'turn2',
    frames: [{
      key: 'dude2',
      frame: 4
    }],
    frameRate: 20
  });

  game.anims.create({
    key: 'right2',
    frames: game.anims.generateFrameNumbers('dude2', {
      start: 5,
      end: 8
    }),
    frameRate: 10,
    repeat: -1
  });

  game.physics.add.collider(player2, platforms);
  game.physics.add.collider(player2, platforms2);
  game.physics.add.collider(player2, base);
}

function initSeminarsToCollect(game) {
  seminars = game.physics.add.group({
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
  game.physics.add.collider(seminars, platforms);
  game.physics.add.collider(seminars, base);
  game.physics.add.overlap(player, seminars, collectSeminar, null, this);
  game.physics.add.overlap(player, seminar_dudes, handSeminar, null, this);
}

function initPensToCollect(game) {
  pens = game.physics.add.group({
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
  game.physics.add.collider(pens, platforms);
  game.physics.add.collider(pens, base);
  game.physics.add.overlap(player2, pens, collectPen, null, this);
  game.physics.add.overlap(player2, pen_dudes, handPen, null, this);
}

function initSeminarDudes() {
  seminar_dudes.create(600, 360, 'seminar_dude');
  seminar_dudes.create(750, 200, 'seminar_dude');
  seminar_dudes.create(100, 280, 'seminar_dude');
  seminar_dudes.create(150, 160, 'seminar_dude');
}

function initPenDudes() {
  pen_dudes.create(650, 360, 'pen_dude');
  pen_dudes.create(600, 200, 'pen_dude');
  pen_dudes.create(150, 280, 'pen_dude');
  pen_dudes.create(200, 160, 'pen_dude');
}

function initScoreBoard(game) {
  seminarScoreText = game.add.text(16, 16, '\"Official\" cheat-sheet pages: ', {
    fontSize: '18px',
    fill: '#000'
  });

  penText = game.add.text(16, 40, 'Pens to give away: ', {
    fontSize: '18px',
    fill: '#000'
  });
}

function initCongratsText(game) {
  congratsText = game.add.text(100, 70, '', {
    fontSize: '24px',
    fill: '#fff'
  });
}

function initLevelTwoScoreBoard() {
  seminarScoreText.setText("Friends helped: 0/8");
  penText.setText("");
}
