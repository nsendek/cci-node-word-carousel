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

// layer for us to draw remote/server activity on
let allGraphics;

// set up the sketch canvas and socket connection,
// including callback function for when the socket receives data.
function setup() {
  createCanvas(600, 400);
  background(51);

  // sets up socket connection for communicating with server,
  // DO NOT DELETE!
  socket.on("drawStroke", onDrawStroke);
  socket.on("allDrawingData", onAllDrawingData);

  allGraphics = createGraphics(width, height);
  allGraphics.clear();
}

function draw() {
  // clear out background and draw saved graphics over top of it
  background(51);
  image(allGraphics, 0, 0);

  // draw local in-progress stroke
  strokeWeight(10);
  stroke(255, 0, 255);
  noFill();
  beginShape();
  for (const point of currentStroke) {
    vertex(point.x, point.y);
  }
  endShape();
}

function mouseDragged() {
  // create an object (x,y coordinate pair) for the data:
  let pt = {
    x: mouseX,
    y: mouseY
  };

  // remember it in our array
  currentStroke.push(pt);
}

function mouseReleased() {
  // drawing is done, send data to server and reset locally

  // data for the entire line:
  let data = {
    points: currentStroke
  };

  // send the message
  socket.emit("drawStroke", data);

  // mouse was released, clear out the array to start over next time the user clicks
  currentStroke = [];
}

// callback for when we receive a notice from the server that
// a new stroke has been added to the drawing
function onDrawStroke(data) {
  console.log(data);

  drawStroke(data.points);
}

// callback for an event that occurs when we JOIN the server,
// letting us have all of the previously drawn strokes so we can
// render them on the canvas
function onAllDrawingData(data) {
  // data contains multiple strokes, draw for each one
  for (let stroke of data.strokes) {
    drawStroke(stroke);
  }
}

// draws a line defined by all points
function drawStroke(points){
  allGraphics.stroke(255);
  allGraphics.strokeWeight(10);
  allGraphics.noFill();
  
  allGraphics.beginShape();
  for (const point of points) {
    allGraphics.vertex(point.x, point.y);
  }
  allGraphics.endShape();
}

/* leave this here so that Glitch will not mark global p5.js functions as errors */
/* globals ADD, ALT, ARROW, AUDIO, AUTO, AXES, BACKSPACE, BASELINE, BEVEL, BEZIER, BLEND, BLUR, BOLD, BOLDITALIC, BOTTOM, BURN, CENTER, CHORD, CLAMP, CLOSE, CONTROL, CORNER, CORNERS, CROSS, CURVE, DARKEST, DEGREES, DEG_TO_RAD, DELETE, DIFFERENCE, DILATE, DODGE, DOWN_ARROW, ENTER, ERODE, ESCAPE, EXCLUSION, FALLBACK, FILL, GRAY, GRID, HALF_PI, HAND, HARD_LIGHT, HSB, HSL, IMAGE, IMMEDIATE, INVERT, ITALIC, LABEL, LANDSCAPE, LEFT, LEFT_ARROW, LIGHTEST, LINEAR, LINES, LINE_LOOP, LINE_STRIP, MIRROR, MITER, MOVE, MULTIPLY, NEAREST, NORMAL, OPAQUE, OPEN, OPTION, OVERLAY, P2D, PI, PIE, POINTS, PORTRAIT, POSTERIZE, PROJECT, QUADRATIC, QUADS, QUAD_STRIP, QUARTER_PI, RADIANS, RADIUS, RAD_TO_DEG, REMOVE, REPEAT, REPLACE, RETURN, RGB, RIGHT, RIGHT_ARROW, ROUND, SCREEN, SHIFT, SOFT_LIGHT, SQUARE, STROKE, SUBTRACT, TAB, TAU, TESS, TEXT, TEXTURE, THRESHOLD, TOP, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, TWO_PI, UP_ARROW, VIDEO, WAIT, WEBGL, accelerationX, accelerationY, accelerationZ, deltaTime, deviceOrientation, displayHeight, displayWidth, focused, frameCount, height, isKeyPressed, key, keyCode, keyIsPressed, mouseButton, mouseIsPressed, mouseX, mouseY, movedX, movedY, pAccelerationX, pAccelerationY, pAccelerationZ, pRotateDirectionX, pRotateDirectionY, pRotateDirectionZ, pRotationX, pRotationY, pRotationZ, pixels, pmouseX, pmouseY, pwinMouseX, pwinMouseY, rotationX, rotationY, rotationZ, touches, turnAxis, width, winMouseX, winMouseY, windowHeight, windowWidth, abs, acos, alpha, ambientLight, ambientMaterial, angleMode, append, applyMatrix, arc, arrayCopy, asin, atan, atan2, background, beginContour, beginShape, bezier, bezierDetail, bezierPoint, bezierTangent, bezierVertex, blend, blendMode, blue, boolean, box, brightness, byte, camera, ceil, char, circle, clear, clearStorage, color, colorMode, concat, cone, constrain, copy, cos, createA, createAudio, createButton, createCamera, createCanvas, createCapture, createCheckbox, createColorPicker, createDiv, createElement, createFileInput, createGraphics, createImage, createImg, createInput, createNumberDict, createP, createRadio, createSelect, createShader, createSlider, createSpan, createStringDict, createVector, createVideo, createWriter, cursor, curve, curveDetail, curvePoint, curveTangent, curveTightness, curveVertex, cylinder, day, debugMode, degrees, describe, describeElement, directionalLight, displayDensity, dist, downloadFile, ellipse, ellipseMode, ellipsoid, emissiveMaterial, endContour, endShape, erase, exitPointerLock, exp, fill, filter, float, floor, fract, frameRate, frustum, fullscreen, get, getFrameRate, getItem, getURL, getURLParams, getURLPath, green, gridOutput, hex, hour, httpDo, httpGet, httpPost, hue, image, imageMode, int, isLooping, join, keyIsDown, lerp, lerpColor, lightFalloff, lightness, lights, line, loadBytes, loadFont, loadImage, loadJSON, loadModel, loadPixels, loadShader, loadStrings, loadTable, loadXML, log, loop, mag, map, match, matchAll, max, millis, min, minute, model, month, nf, nfc, nfp, nfs, noCanvas, noCursor, noDebugMode, noErase, noFill, noLights, noLoop, noSmooth, noStroke, noTint, noise, noiseDetail, noiseSeed, norm, normalMaterial, orbitControl, ortho, perspective, pixelDensity, plane, point, pointLight, pop, popMatrix, popStyle, pow, print, push, pushMatrix, pushStyle, quad, quadraticVertex, radians, random, randomGaussian, randomSeed, rect, rectMode, red, redraw, registerPromisePreload, removeElements, removeItem, requestPointerLock, resetMatrix, resetShader, resizeCanvas, reverse, rotate, rotateX, rotateY, rotateZ, round, saturation, save, saveCanvas, saveFrames, saveGif, saveJSON, saveJSONArray, saveJSONObject, saveStrings, saveTable, scale, second, select, selectAll, set, setAttributes, setCamera, setFrameRate, setMoveThreshold, setShakeThreshold, shader, shearX, shearY, shininess, shorten, shuffle, sin, smooth, sort, specularColor, specularMaterial, sphere, splice, split, splitTokens, spotLight, sq, sqrt, square, storeItem, str, stroke, strokeCap, strokeJoin, strokeWeight, subset, tan, text, textAlign, textAscent, textDescent, textFont, textLeading, textOutput, textSize, textStyle, textWidth, texture, textureMode, textureWrap, tint, torus, translate, triangle, trim, unchar, unhex, updatePixels, vertex, writeFile, year */
