//board
let board;
let context;
let menu = false;

//character
let characterRightImg;
let characterLeftImg;
let characterX = 40;
let characterY = 400;
let characterScale = 0.1;
let characterWidth = 626 * characterScale;
let characterHeight = 512 * characterScale;

let character = {
  img: null,
  x: characterX,
  y: characterY,
  width: characterWidth,
  height: characterHeight,
};

//physics
let velocityX = 0;
let velocityY = -13; //jump speed //set for start screen

//platforms
let platformArray = [];
let platformWidth = 65;
let platformHeight = 10.07;
let platformImg;
let platformSpeed = 1;

//score
let score = 0;
let gameOver = false;

// start screen
let playing = false;

//sliders

let bgMusic;
let jumpSoundEffect;

//mode
let isDark = true;

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d"); //to draw on board

  //load audio
  bgMusic = new Audio();
  bgMusic.src = bgMusicSrc;
  jumpSoundEffect = new Audio();
  jumpSoundEffect.src = jumpSoundSrc;

  jumpSoundEffect.volume = 1;

  //load images
  context.imageSmoothingEnabled = true;

  characterRightImg = new Image();
  characterRightImg.src = characterLightRightImgSrc;
  character.img = characterRightImg;

  characterLeftImg = new Image();
  characterRightImg.src = characterLightLeftImgSrc;

  //platform starting params
  platformImg = new Image();
  platformImg.src = platformImgSrc;

  initialSetup();
};

function initialSetup() {
  bgMusic.currentTime = 0;
  bgMusic.volume = 1;
  bgMusic.loop = true;

  setup();

  requestAnimationFrame(displaySetup());
}

function displaySetup() {
  if (isDark) {
    characterRightImg.src = characterLightRightImgSrc;
    characterLeftImg.src = characterLightLeftImgSrc;
  } else {
    characterRightImg.src = characterDarkRightImgSrc;
    characterLeftImg.src = characterDarkLeftImgSrc;
  }

  bgMusic.play();
  toggle("settings-wrapper", false);
  requestAnimationFrame(start);

  context.clearRect(0, 0, board.width, board.height);
}

//setup gameplay
function setup() {
  game();
  reset();

  playing = true;
}

//gameplay
function game() {
  //character pos
  characterX = boardWidth / 2 - characterWidth / 2;
  characterY = (boardHeight * 7) / 8 - characterHeight;

  velocityY = -7.5;

  placePlatforms();
  requestAnimationFrame(update);
  document.addEventListener("keydown", moveCharacter);
}

function update() {
  preCheck();

  context.clearRect(0, 0, board.width, board.height);

  characterUpdate();

  platformUpdate();

  scoreUpdate();
}

function preCheck() {
  requestAnimationFrame(update);

  if (gameOver) {
    return;
  }
}

function characterUpdate() {
  //character
  character.x += velocityX;

  if (character.x - character.width > board.width) {
    character.x = 0 - character.width;
  } else if (character.x + character.width < 0) {
    character.x = board.width;
  }

  velocityY += gravity;
  character.y += velocityY;

  if (character.y - character.height > board.height) {
    gameOver = true;
  }

  context.drawImage(
    character.img,
    character.x,
    character.y,
    character.width,
    character.height
  );
}

function platformUpdate() {
  platformFunctions();

  //delete old + add new platforms
  replacePlatforms();
}

function platformFunctions() {
  for (let i = 0; i < platformArray.length; i++) {
    let platform = platformArray[i];

    if (character.y < boardHeight * 0.65) {
      platform.y -= -3; //slide platform down when jumping
      score += 1;
    }

    if (detectCollide(character, platform) && velocityY >= 0) {
      velocityY = -9; // jump off platform
      jumpSoundEffect.play();
    }

    context.drawImage(
      platform.img,
      platform.x,
      platform.y,
      platform.width,
      platform.height
    );
  }
}

function replacePlatforms() {
  while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
    platformArray.shift(); //rem first elem

    newPlatform(platformImg, platformArray, platformWidth, platformHeight);
  }
}

function scoreUpdate() {
  context.fillStyle = isDark ? "#c2ccd6" : "#362400";
  context.font = "20px ink-free";
  context.fillText("score: " + score, 15, 30);

  if (gameOver) {
    context.fillText(
      "Game Over: Press Space to Restart",
      boardWidth / 2 - 150,
      boardHeight / 2
    );
  }
}

function moveCharacter(e) {
  if (playing) {
    if (e.code == "ArrowRight" || e.code == "KeyD") {
      //move right
      velocityX = 4;
      character.img = characterRightImg;
    } else if (e.code == "ArrowLeft" || e.code == "KeyA") {
      // move left
      velocityX = -4;
      character.img = characterLeftImg;
    } else if (e.code == "Space" && gameOver) {
      reset();
    }
  }
}

function reset() {
  character = {
    img: characterRightImg,
    x: characterX,
    y: characterY,
    width: characterWidth,
    height: characterHeight,
  };

  velocityX = 0;
  velocityY = initialVelocityY;

  score = 0;
  gameOver = false;

  placePlatforms();
}

let prevRanX = 0;

//starting platforms
function placePlatforms() {
  platformArray = [];

  //create first platform in center
  const PLATFORM = {
    img: platformImg,
    x: boardWidth / 2 - platformWidth / 2,
    y: boardHeight - 50,
    width: platformWidth,
    height: platformHeight,
  };

  platformArray.push(PLATFORM);

  prevRanX = boardWidth / 2 - platformWidth / 2;

  for (let i = 1; i < 7; i++) {
    let RAN_X = Math.floor(prevRanX + Math.random() * 550 - 275);

    while (
      RAN_X + platformWidth / 2 > boardWidth ||
      RAN_X - platformWidth / 2 < 0
    ) {
      RAN_X = Math.floor(prevRanX + Math.random() * 550 - 275);
    }

    const PLATFORM = {
      img: platformImg,
      x: RAN_X,
      y: boardHeight - i * 90 - 50,
      width: platformWidth,
      height: platformHeight,
    };

    prevRanX = RAN_X;

    platformArray.push(PLATFORM);
  }
}

function newPlatform(img, arr, width, height) {
  let RAN_X = Math.floor(prevRanX + Math.random() * 600 - 300);

  while (
    RAN_X + platformWidth / 2 > boardWidth ||
    RAN_X - platformWidth / 2 < 0
  ) {
    RAN_X = Math.floor(prevRanX + Math.random() * 600 - 300);
  }

  let RAN_Y = -height - Math.floor(Math.random() * 20);

  for (let i = 0; i < platformArray.length; i++) {
    while (
      platformArray[i].y < RAN_Y - height - 10 &&
      platformArray[i].y > RAN_Y + height + 10
    ) {
      RAN_Y = -height - Math.floor(Math.random() * boardWidth * 0.1);
    }
  }
  const PLATFORM = {
    img: img,
    x: RAN_X,
    y: RAN_Y,
    width: width,
    height: height,
  };

  arr.push(PLATFORM);

  prevRanX = RAN_X;
}

function detectCollide(a, b) {
  return (
    a.x < b.x + b.width && //a's left doesn't touch b's right
    a.x + a.width > b.x && //a's right passes b's left
    a.y < b.y + b.height && // a's top doesn't touch b's bottom
    a.y + a.height > b.y
  ); // a's bottom passes b's top
}

function toggle(id, tog) {
  const ELEM = document.getElementById(id);
  const DISPLAY = tog ? "block" : "none";
  ELEM.style.display = DISPLAY;
}
