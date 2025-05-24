/* Draw remotely with other people!
 *
 * JavaScript code for a website that sets up p5.js and talks
 * to another client using socket.io.
 * 
 * update the setup, draw, and p5.js event functions as you need to
 * for your interactions. you can also mix this with the other JavaScript
 * methods we've been using for event handling, styling, etc.
 * 
 * in this edition, the data for one line (stroke) drawn when the user
 * clicks, drags, and releases the mouse is sent only when the drawing is
 * complete (on mouse release). the server also saves the data in an array
 * as long as it is running, so newly connected clients can render the whole
 * drawing (see onAllDrawingData).
 */

const SOCKET_URL = window.location.host;
const socket = io.connect(SOCKET_URL);

// an array that will hold the points of a line we're currently drawing
let currentStroke = [];

let currentWord = '';
let currentTime = Date.now();
let lastTime = Date.now();

let MY_ID;

let wordParticles = [];

let paused = false;

// set up the sketch canvas and socket connection,
// including callback function for when the socket receives data.
function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(50);
  textAlign()
  socket.on("addWord", onAddWord);
  socket.on("allWords", onAllWords);
  socket.on('connect', () => {
    MY_ID = socket.id;
  });
}

function draw() {
  if (paused) {
    return;
  }
  background(0);
  currentTime = Date.now();

  if ((currentTime - lastTime) > 2000) {
    lastTime = currentTime;

    if (currentWord.length) {
      emitWord();
    }
  }

  drawCurrentWord();
  drawWords();
  updateWords();
}

function drawCurrentWord() {
  push();
  fill('white');
  text(currentWord, width/2, 0.75 * height);
  pop();
}

function drawWords() {
  push();
  textSize(50);
  fill('white');
  stroke('white');
  wordParticles.forEach(word => {
    text(word.text, word.x, word.y);
  });
  pop();
}

function updateWords() {
  wordParticles.forEach(word => {
    word.x -= 4;
    if ((word.x + word.width) < 0) {
      let farthestWord = getFarthestWord();
      if (farthestWord) {
        word.x = max(farthestWord.x + farthestWord.width, width);
      } else {
        word.x = width;
      }
    }
  });
}

function getFarthestWord() {
  if (!wordParticles.length) {
    return;
  }
  let farthestWord = wordParticles.reduce((max, current) => {
    return current.x > max.x ? current : max;
  });
  return farthestWord;
}

function keyPressed() {
  lastTime = Date.now();
  if (keyCode === ENTER && currentWord.length) {
    emitWord();
    return;
  }
  
  if (key.match(/^[a-zA-Z]$/)) {
    currentWord += key;
  }
}

function emitWord() {
  if (currentWord === clear) {
    socket.emit('clear');
  } else {
    socket.emit('addWord', { text: currentWord, id: MY_ID });
  }
  currentWord = '';
}

function onAddWord(word) {
  let lastX;
  if (!wordParticles.length) {
    lastX = width/2;
  } else {
    const farthestWord = getFarthestWord();
    lastX = farthestWord.x + farthestWord.width;
  }

  word.x = lastX;
  word.y = height / 2;
  word.width = textWidth(word.width);

  wordParticles.push(word);
}

function onAllWords(data) {
  console.log('onAllWords', data);
  wordParticles = data.words;
  prepWordParticles(wordParticles);
}

function prepWordParticles() {
  push();
  textSize(50);
  lastX = width / 2;
  lastWordWidth = 0;
  wordParticles.forEach(word => {
    const wordWidth = textWidth(word.text);
    word.x = lastX + lastWordWidth;
    word.y = height / 2;
    word.width = wordWidth;
    lastX = word.x;
    lastWordWidth = word.width;
  });
}
