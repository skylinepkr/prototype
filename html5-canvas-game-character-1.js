
// Copyright 2011 William Malone (www.williammalone.com)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var canvas;
var context;
var images = {};
var totalResources = 12;
var numResourcesLoaded = 0;
var fps = 30;
var charX = 245;
var charY = 473; //185
var charCurrX;
var breathInc = 0.1;
var breathDir = 1;
var breathAmt = 0;
var breathMax = 3;
var breathInterval = setInterval(updateBreath, 1000 / fps);
var maxEyeHeight = 6;
var curEyeHeight = maxEyeHeight;
var eyeOpenTime = 0;
var timeBtwBlinks = 4000;
var blinkUpdateTime = 200;
var blinkTimer = setInterval(updateBlink, blinkUpdateTime);
var fpsInterval = setInterval(updateFPS, 1000);
var numFramesDrawn = 0;
var curFPS = 0;
var jumping = false;
var left = false;
var right = false;
var leftCount = 0;
var rightCount = 0;
var lMoving = true;
var rMoving = true;
var x;
var y;
var score = 0;
var livesCount = 5;
var jumpCount = 0;
var cocoArray = [];
var barrelArray = [];
var highscorelist = [0, 0, 0, 0, 0];
var numCoconuts = 3;
var numBarrels = 2;
var menuval = 0;
var state = {
    MainMenu: { value: 0, name: "MainMenu" },
    Gameplay: { value: 1, name: "Gameplay" },
    Pause: { value: 2, name: "Pause" },
    HighScore: { value: 3, name: "HighScore" }
};

var menu = {
    Play: { value: 0, name: "MainMenu" },
    HighScore: { value: 1, name: "Gameplay" }
};
var currentstate = state.MainMenu;


var state = {
    MainMenu: { value: 0, name: "MainMenu" },
    Gameplay: { value: 1, name: "Gameplay" },
    Pause: { value: 2, name: "Pause" },
    HighScore: { value: 3, name: "HighScore" }
};

var menu = {
    Play: { value: 0, name: "MainMenu" },
    HighScore: { value: 1, name: "Gameplay" }
};
var currentstate = state.MainMenu;
var menuval = 0;
var highscorelist = [0, 0, 0, 0, 0];
var timer = new Timer();
var clockTick = null;
var bgX = 0, bgY = 0, bgX2 = 2768;
var backgroundSpeed = 7;
var monkey_box;
var audio_context;
var bufferLoader;
var music_array = ['../sounds/splat.mp3', '../sounds/eyeOfTheTiger.mp3'];

//window.onload = init;

function init() {
    // Fix up prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audio_context = new AudioContext();

    bufferLoader = new BufferLoader(
      audio_context,
      music_array,
      finishedLoading
      );

    bufferLoader.load();
}

function finishedLoading(bufferList) {
    playSound(bufferList, 1);
}

function playSound(bufferList, index) {
    // Create two sources and play them both together.

    var source1 = audio_context.createBufferSource();
    source1.buffer = bufferList[index];
    source1.connect(audio_context.destination);

    source1.start(0);


}

/*
 * Updates the frames per second and frames drawn.
*/
function updateFPS() {

    curFPS = numFramesDrawn;
    numFramesDrawn = 0;
}
/*
 * Prepares the canvas and sets appropriate variables to the context and canvas.
 */
function prepareCanvas(canvasDiv, canvasWidth, canvasHeight) {
    // Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
    canvas = document.createElement('canvas');
    canvas.setAttribute('width', canvasWidth);
    canvas.setAttribute('height', canvasHeight);
    canvas.setAttribute('id', 'canvas');
    canvasDiv.appendChild(canvas);

    if (typeof G_vmlCanvasManager != 'undefined') {
        canvas = G_vmlCanvasManager.initElement(canvas);
    }
    context = canvas.getContext("2d"); // Grab the 2d canvas context
    // Note: The above code is a workaround for IE 8and lower. Otherwise we could have used:
    //     context = document.getElementById('canvas').getContext("2d");

    loadImage("leftArm");
    loadImage("legs");
    loadImage("torso");
    loadImage("rightArm");
    loadImage("head");
    loadImage("hair");
    loadImage("background");
    loadImage("lives");
    loadImage("title");
    loadImage("score");
    loadImage("rightArm-jump");
    loadImage("leftArm-jump");
    loadImage("legs-jump");
    loadImage("Coconut");
    loadImage("cocoSprite");
    loadImage("explodeSprite");

    init();
    loadImage("barrelSprites");

}

/*
 * Loads images in to an array and appends .png to each image
 */
function loadImage(name) {

    images[name] = new Image();
    images[name].onload = function () {
        resourceLoaded();
    }
    images[name].src = "images/" + name + ".png";
}

/*
 * Checks to see if all the resources have been loaded.
 */
function resourceLoaded() {

    numResourcesLoaded += 1;
    if (numResourcesLoaded === totalResources) {

        setInterval(redraw, 1000 / fps);
    }
}

/*
 * Sets the jump flag to true allowing character to perform appropriate task.
 */
function jump() {

    if (!jumping) {

        jumping = true;
        jumpCount++;
        if (jumpCount > 3) {
            livesCount--;
        }
        setTimeout(land, 800);
    }
}

/**
* Sets the going left flag to true if the left arrow is pressed.
*/
function moveLeft() {
    if (!left) {
        left = true;
    }

}

/**
* Sets the going right flag to true if the right arrow is pressed.
*/
function moveRight() {
    if (!right) {
        right = true;
    }

}

/**
* Sets the going left arrow to false.  
*/
function stopLeft() {
    left = false;
}

/**
* Sets the going right arrow to false.  
*/
function stopRight() {
    right = false;
}


/*
 * Controls the jump flag when character lands
 * setting jump to false.
 */

function land() {
    jumping = false;
}



/*
 * Draws the background as a horizontal scroller.
 */
function drawBackground() { //2768x600 is the dimensions of background
    context.drawImage(images["background"], bgX, bgY);
    context.drawImage(images["background"], bgX2, bgY);
    if (bgX < -2767) {
        bgX = 2762;
    }
    if (bgX2 < -2767) {
        bgX2 = 2762;
    }
    bgX -= backgroundSpeed;
    bgX2 -= backgroundSpeed;
}

/*
 * Essentially this is the game loop which re-draws all objects
 * and also is used as a listener.
 */
function redraw() {
    if (currentstate == state.MainMenu) {
        canvas.width = canvas.width; // clears the canvas 
        context.drawImage(images["background"], 0, 0); //draws background
        score = 0;
        livesCount = 3;
        jumpCount = 0;
        window.addEventListener('keypress', function (e) {
            if (e.keyCode === 32) { //space
                if (menuval == 0) {
                    currentstate = state.Gameplay;
                }
                else {
                    currentstate = state.HighScore;
                }
            }
            if (e.keyCode === 49) { //up
                if (menuval == 0) {
                    menuval = 1;
                }
                else {
                    menuval = 0;
                }
            }

        }, false);
        context.font = "bold 36px sans-serif";
        if (menuval == 0) {
            context.fillText("Play Game", 350, 300);
        }
        else if (menuval == 1) {
            context.fillText("HighScore", 350, 300);
        }

        this.updateArray();

    }
    else if (currentstate == state.HighScore) {
        context.font = "bold 36px sans-serif";
        context.fillText("HighScore 1 : " + highscorelist[0], 350, 100);
        context.fillText("HighScore 2 : " + highscorelist[1], 350, 200);
        context.fillText("HighScore 3 : " + highscorelist[2], 350, 300);
        context.fillText("HighScore 4 : " + highscorelist[3], 350, 400);
        context.fillText("HighScore 5 : " + highscorelist[4], 350, 500);
        window.addEventListener('keypress', function (e) {
            if (e.keyCode === 32) { //space

                currentstate = state.MainMenu;
            }
        }, false);
    }
    else if (currentstate == state.Gameplay) {
        if (livesCount == 0) {
            if (score > highscorelist[4]) {
                var i = 4;
                while (score > highscorelist[i] && i > 0) {
                    i--;
                }
                if (i == 0) {
                    highscorelist[4] = highscorelist[3];
                    highscorelist[3] = highscorelist[2];
                    highscorelist[2] = highscorelist[1];
                    highscorelist[1] = highscorelist[0];
                    highscorelist[i] = score;

                }
                else {
                    highscorelist[i] = score;
                }

            }

            currentstate = state.HighScore;
        }
        x = charX;
        y = charY;
        var jumpHeight = 100;
        var count = 0;

        canvas.width = canvas.width; // clears the canvas 
        drawBackground(); //draw background

        //Handle keyboard controls
        window.addEventListener('keydown', function (e) {

            if (e.keyCode === 32) { //space
                jump();
            }

            if (e.keyCode === 37) { //left
                moveLeft();
            }
            if (e.keyCode === 39) { //right
                moveRight();
            }

        }, false);


        //go left
        if (left) {
            if (!(x < 0))
                x = x - 14;
            charX = x;
            stopLeft();
        }

        //go right
        if (right) {
            if (!(x > 910)) {
                x = x + 13;
                charX = x;
                stopRight();
            }

        }


        //draw shadow
        if (jumping) {
            drawEllipse(x + 40, y + 29, 100 - breathAmt, 4)
        }

        if (jumping) {
            y -= jumpHeight;
        }


        //Left arm
        if (jumping) {
            context.drawImage(images["leftArm-jump"], x + 40, y - 42 - breathAmt);
        }
        else {
            context.drawImage(images["leftArm"], x + 40, y - 42 - breathAmt);
        }

        //Legs
        if (jumping) {
            context.drawImage(images["legs-jump"], x - 6, y);
        }
        else {
            context.drawImage(images["legs"], x, y);
        }

        context.drawImage(images["torso"], x, y - 50);
        context.drawImage(images["head"], x - 10, y - 125 - breathAmt);
        context.drawImage(images["hair"], x - 37, y - 138 - breathAmt);

        //Right Arm
        if (jumping) {
            context.drawImage(images["rightArm-jump"], x - 35, y - 42 - breathAmt);
        }
        else {
            context.drawImage(images["rightArm"], x - 15, y - 42 - breathAmt);
        }


        context.drawImage(images["title"], 10, 5); //366 for x is centered for title.
        context.drawImage(images["lives"], 800, 5);
        context.drawImage(images["score"], 800, 550);


        //drawEllipse(x + 47, y - 68 - breathAmt, 8, curEyeHeight); // Left Eye
        drawEllipse(x + 64, y - 64 - breathAmt, 8, curEyeHeight); // Right Eye

        context.font = "bold 36px sans-serif";
        context.fillText(":" + score, 900, 585);
        context.fillText(":" + livesCount, 900, 40);
        ++numFramesDrawn;

        var monkey_height = images['torso'].height + images['head'].height;
        monkey_box = new BoundingBox(x, y - images['head'].height, images['torso'].width, monkey_height - 20);
        monkey_box.draw();

        this.fillCocoArray(canvas);
        this.fillBarrelArray(canvas);
        this.drawCoconuts(canvas);
        this.drawBarrels(canvas);
        this.updateArray();
        this.removeBarrel();

        score += 1;


        //Left arm
        if (jumping) {
            context.drawImage(images["leftArm-jump"], x + 40, y - 42 - breathAmt);

        }

        else {
            context.drawImage(images["leftArm"], x + 40, y - 42 - breathAmt);
        }

        //Legs
        if (jumping) {
            context.drawImage(images["legs-jump"], x - 6, y);
        }

        else {
            context.drawImage(images["legs"], x, y);
        }


        //torso, head, hair




        context.drawImage(images["torso"], x, y - 50);
        context.drawImage(images["head"], x - 10, y - 125 - breathAmt);
        context.drawImage(images["hair"], x - 37, y - 138 - breathAmt);
        drawEllipse(x + 64, y - 64 - breathAmt, 8, curEyeHeight); // Right Eye



        //Right Arm
        if (jumping) {
            context.drawImage(images["rightArm-jump"], x - 35, y - 42 - breathAmt);
        }

        else {
            context.drawImage(images["rightArm"], x - 15, y - 42 - breathAmt);
        }


        context.drawImage(images["title"], 10, 5); //366 for x is centered for title.
        context.drawImage(images["lives"], 800, 5);
        context.drawImage(images["score"], 800, 550);


        context.font = "bold 36px sans-serif";
        context.fillText(":" + score, 900, 585);
        context.fillText(":" + livesCount, 900, 40);
        ++numFramesDrawn;

        //drawEllipse(charX, charY, 20, 20);

        clockTick = timer.tick();

        //monkey_height = images['torso'].height + images['head'].height;
        //monkey_box = new BoundingBox(x, y - images['head'].height, images['torso'].width, monkey_height - 20);
        //monkey_box.draw();
        //drawEllipse(charX, charY, images['torso'].width, monkey_height);

        this.fillCocoArray(canvas);
        this.drawCoconuts(canvas);
        this.updateArray();



        score += 1;
    }
}

/*
 * Method to draw an ellipse.
 */
function drawEllipse(centerX, centerY, width, height) {

    context.beginPath();

    context.moveTo(centerX, centerY - height / 2);

    context.bezierCurveTo(
      centerX + width / 2, centerY - height / 2,
      centerX + width / 2, centerY + height / 2,
      centerX, centerY + height / 2);

    context.bezierCurveTo(
      centerX - width / 2, centerY + height / 2,
      centerX - width / 2, centerY - height / 2,
      centerX, centerY - height / 2);

    context.fillStyle = "black";
    context.fill();
    context.closePath();
}

/*
 * Updates the breathing of the character as the game progresses.
 */
function updateBreath() {

    if (breathDir === 1) {  // breath in
        breathAmt -= breathInc;
        if (breathAmt < -breathMax) {
            breathDir = -1;
        }
    } else {  // breath out
        breathAmt += breathInc;
        if (breathAmt > breathMax) {
            breathDir = 1;
        }
    }
}

/*
 * Updates the blink pattern of the character.
 */
function updateBlink() {

    eyeOpenTime += blinkUpdateTime;

    if (eyeOpenTime >= timeBtwBlinks) {
        blink();
    }
}

/*
 * Makes the character's eyes blink.
 */
function blink() {

    curEyeHeight -= .4;
    if (curEyeHeight <= 0) {
        eyeOpenTime = 0;
        curEyeHeight = maxEyeHeight;
    } else {
        setTimeout(blink, 10);
    }
}

/*
 * Draws the coconuts in the array
*/
function drawCoconuts(canvas) {
    for (var i = 0; i < cocoArray.length ; i++) {
        var coconut = cocoArray[i];
        coconut.draw(this);
        coconut.fall();
    }

}

/*
 * Draws the barrels into the array
*/
function drawBarrels(canvas) {
    for (var i = 0; i < barrelArray.length; i++) {
        var barrel = barrelArray[i];
        barrel.draw(canvas);
        barrel.roll();
    }
}

/* 
* Removes coconuts that have fallen on the ground
*/
function updateArray() {
    for (var i = cocoArray.length - 1; i >= 0; --i) {
        if (cocoArray[i].removeFromWorld) {
            cocoArray.splice(i, 1);
        }

    }
    /*if (cocoArray.length === 0) {
        full = false;
    }*/
}

/* 
* Removes barrels rolled off screen
*/
function removeBarrel() {
    for (var i = barrelArray.length - 1; i >= 0; --i) {
        if (barrelArray[i].removeFromWorld) {
            barrelArray.splice(i, 1);
        }
    }
}

/*
* Add coconuts to the coconut array 
*/
function fillCocoArray(canvas) {

    for (var i = 0; i < numCoconuts - cocoArray.length; i++) {
        var ranx = Math.floor(Math.random() * canvas.width);
        cocoArray.push(new Coconut(ranx, -70));
    }

}

function Entity(x, y) {
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

/*
* Adds Barrels to barrel array
*/
function fillBarrelArray(canvas) {

    for (var i = 0; i < numBarrels - barrelArray.length; i++) {
        barrelArray.push(new Barrel(1000, 453));
    }
}


/* 
 * Contructs a coconut with given x,y coordinates
*/
function Coconut(x, y) {
    Entity.call(this, x, y);
    this.fallSpeed = Math.floor(Math.random() * 5) + 2;
    this.animation = new Animation(images["cocoSprite"], 0, 0, 93, 57, 0.08, 6, false, false);
    this.explode_animation = new Animation(images["explodeSprite"], 0, 0, 116.67, 97.75, .09, 10, false, false);
    this.box = new BoundingBox(x, y, images['Coconut'].width, images['Coconut'].height);
    this.sound_played = false;

}
Coconut.prototype = new Entity();
Coconut.prototype.constructor = Coconut;
/* 
 * Contructs a Barrel with given x,y coordinates
*/
function Barrel(x, y) {
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
    this.rollSpeed = Math.floor(Math.random() * 5) + 4;
    this.animation = new Animation(images["barrelSprites"], 0, 0, 80, 68, 0.1, 4, true, false);
}

/* 
 * Function that increments y coordinate of coconut
 */
Coconut.prototype.fall = function () {
    if (!this.box.collision) {
        if (this.y >= (canvas.height - 100)) {
            this.removeFromWorld = true;
        } else {
            this.y += this.fallSpeed;
            this.box = new BoundingBox(this.x, this.y, images['Coconut'].width, images['Coconut'].height);
        }
    }

}

/* 
 * Function that increments x coordinate of Barrel
 */
Barrel.prototype.roll = function () {

    if (this.x > 0) {
        this.x -= this.rollSpeed;

    } else {
        this.removeFromWorld = true;
    }

}

/*
 *Draws a coconut
 */
Coconut.prototype.draw = function (that) {
    this.box.collide(monkey_box); //sets a  flag if a collision occurs

    if (this.box.collision) {
        if (!this.sound_played) {
            this.sound_played = true;
            that.playSound(bufferLoader.bufferList, 0);
        }

        this.explode_animation.drawFrame(clockTick, context, this.x, this.y);

        if (this.explode_animation.isDone()) {
            this.removeFromWorld = true;
        }

    } else if (this.y > canvas.height - 200) {
        this.animation.drawFrame(clockTick, context, this.x, this.y);

    } else {
        context.drawImage(images["Coconut"], this.x, this.y);
        this.box.draw();

    }

}

/*
Draws a Barrel (currently a coconut until we get the graphics for a barrel)
 */
Barrel.prototype.draw = function () {
    this.animation.drawFrame(clockTick, context, this.x, this.y);
}

function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}

function BoundingBox(x, y, width, height) {
    this.Top = y;
    this.Bottom = y + height;
    this.Left = x;
    this.Right = x + width;
    this.collision = false;
}

BoundingBox.prototype.collide = function (other) {
    this.collision = this.collision || (!(
        (this.Bottom < other.Top) ||
		(this.Top > other.Bottom) ||
		(this.Left > other.Right) ||
		(this.Right < other.Left)));

    return this.collision;
}
BoundingBox.prototype.draw = function (that) {

    context.beginPath();
    context.moveTo(this.Left, this.Top);
    context.lineTo(this.Right, this.Top);
    context.lineTo(this.Right, this.Bottom);
    context.lineTo(this.Left, this.Bottom);
    context.lineTo(this.Left, this.Top);
    context.stroke();

}

function BufferLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function (url, index) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    var loader = this;

    request.onload = function () {
        // Asynchronously decode the audio file data in request.response
        loader.context.decodeAudioData(
          request.response,
          function (buffer) {
              if (!buffer) {
                  alert('error decoding file data: ' + url);
                  return;
              }
              loader.bufferList[index] = buffer;
              if (++loader.loadCount == loader.urlList.length)
                  loader.onload(loader.bufferList);
          },
          function (error) {
              console.error('decodeAudioData error', error);
          }
        );
    }

    request.onerror = function () {
        alert('BufferLoader: XHR error');
    }

    request.send();
}

BufferLoader.prototype.load = function () {
    for (var i = 0; i < this.urlList.length; ++i)
        this.loadBuffer(this.urlList[i], i);
}