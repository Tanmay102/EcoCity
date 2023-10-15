//board
let board;
let context;

//character
let characterRightImg;
let characterLeftImg;
let characterX = 40;
let characterY = 230;
let characterScale = 0.4;
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

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d"); //to draw on board

  //load images
  context.imageSmoothingEnabled = true;

  characterRightImg = new Image();
  characterRightImg.src = characterLightRightImgSrc;
  character.img = characterRightImg;

  characterLeftImg = new Image();
  characterLeftImg.src = characterLightLeftImgSrc;

  context.clearRect(0, 0, board.width, board.height);

  requestAnimationFrame(update);
  document.addEventListener("keydown", moveCharacter);
};

function update() {
  requestAnimationFrame(update);
  context.clearRect(0, 0, board.width, board.height);

  characterUpdate();
}

function characterUpdate() {
  //character
  character.x += velocityX;

  if (character.x - character.width > board.width) {
    character.x = 0 - character.width;
  } else if (character.x + character.width < 0) {
    character.x = board.width;
  }

  context.drawImage(
    character.img,
    character.x,
    character.y,
    character.width,
    character.height
  );
}

function moveCharacter(e) {
  if (e.code == "ArrowRight" || e.code == "KeyD") {
    //move right
    velocityX = 4;
    character.img = characterRightImg;
  } else if (e.code == "ArrowLeft" || e.code == "KeyA") {
    // move left
    velocityX = -4;
    character.img = characterLeftImg;
  }
}
