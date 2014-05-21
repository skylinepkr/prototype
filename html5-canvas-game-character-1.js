
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
var breathInc = 0.1;
var breathDir = 1;
var breathAmt = 0;
var breathMax = 2;
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
var increment = 0;
var lMoving = true;
var rMoving = true;
var x;
var y;
var score = 0;
var livesCount = 5;
var jumpCount = 0;
var cocoArray = [];
<<<<<<< HEAD
var numCoconuts = 6;

=======
var highscorelist = [0,0,0,0,0];
var numCoconuts = 2;
var menuval = 0;
var state = {
  MainMenu : {value: 0, name: "MainMenu"}, 
  Gameplay: {value: 1, name: "Gameplay"}, 
  Pause : {value: 2, name: "Pause"},
  HighScore: {value: 3, name: "HighScore"}
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
>>>>>>> 4b46df8ef40f0fda53551f3fdb1253cfca8fdb5e
var timer = new Timer();
var clockTick = null;

var bgX = 0, bgY = 0, bgX2 = 2768;
var backgroundSpeed = 7;


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
function prepareCanvas(canvasDiv, canvasWidth, canvasHeight)
{
	// Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
	canvas = document.createElement('canvas');
	canvas.setAttribute('width', canvasWidth);
	canvas.setAttribute('height', canvasHeight);
	canvas.setAttribute('id', 'canvas');
	canvasDiv.appendChild(canvas);
	
	if(typeof G_vmlCanvasManager != 'undefined') {
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

}

/*
 * Loads images in to an array and appends .png to each image
 */
function loadImage(name) {

  images[name] = new Image();
  images[name].onload = function() { 
	  resourceLoaded();
  }
  images[name].src = "images/" + name + ".png";
}

/*
 * Checks to see if all the resources have been loaded.
 */
function resourceLoaded() {

  numResourcesLoaded += 1;
  if(numResourcesLoaded === totalResources) {
 
	setInterval(redraw, 1000 / fps);
  }
}

/*
 * Sets the jump flag to true allowing character to perform appropriate task.
 */
function jump() {
    if (!jumping) {
        jumping = true;
        setTimeout(land, 800);
    }


    if (!jumping) {
        if (livesCount == 0) {
            jumping = false;
        }
        else {
            jumping = true;
            jumpCount++;
            if (jumpCount > 7)
            {
                livesCount--;
                jumpCount = 1;
            }
            setTimeout(land, 800);
        }
    }
}


function moveLeft() {
    if (!left) {
        left = true;
    }

}

function moveRight() {
    if (!right) {
        right = true;
    }

}

function stopLeft() {
    left = false;
}

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

    x = charX;
    y = charY;
    var jumpHeight = 100;
    var slowdown = -200;
    var movefast = 500;
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

    if(left)
    {
        if(!(x < 0))
        x = x - 10;
        charX = x;
        stopLeft();
    }

    if (right) {
        if(!(x > 910))
        {   x = x + 8;
            charX = x;
            stopRight();
        }
     
    }
   
    if (!(x < 0))
    {
        x = x - 2;
        charX = x;
    }
      

    //draw shadow
    if (jumping) {
        drawEllipse(x + 40, y+29,100-breathAmt, 4)
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
    drawEllipse(x + 64, y - 64 - breathAmt, 8, curEyeHeight); // Right Eye


<<<<<<< HEAD
    //Right Arm
    if (jumping) {
        context.drawImage(images["rightArm-jump"], x - 35, y - 42 - breathAmt);
    }
    else {
        context.drawImage(images["rightArm"], x - 15, y - 42 - breathAmt);
    }
=======
    clockTick = timer.tick();
    this.fillCocoArray(canvas);
    this.drawCoconuts(canvas);
    this.updateArray();

    score += 1;

        context.drawImage(images["title"], 10, 5); //366 for x is centered for title.
        context.drawImage(images["lives"], 800, 5);
        context.drawImage(images["score"], 800, 550);
>>>>>>> 4b46df8ef40f0fda53551f3fdb1253cfca8fdb5e

    if (left)
    
    
    context.drawImage(images["title"], 10, 5); //366 for x is centered for title.
    context.drawImage(images["lives"], 800, 5);
    context.drawImage(images["score"], 800, 550);

  
    context.font = "bold 36px sans-serif";
    context.fillText(":" + score, 900, 585);
    context.fillText(":" + livesCount, 900, 40);
    ++numFramesDrawn;

    //drawEllipse(charX, charY, 20, 20);

    clockTick = timer.tick();
    this.fillCocoArray(canvas);
    this.drawCoconuts(canvas);
    this.updateArray();

    context.beginPath();
    context.moveTo(0, canvas.height - 100);
    context.lineTo(canvas.width, canvas.height - 100);
    context.stroke();

    score += 1;
   
}

/*
 * Method to draw an ellipse.
 */
function drawEllipse(centerX, centerY, width, height) {

  context.beginPath();
  
  context.moveTo(centerX, centerY - height/2);
  
  context.bezierCurveTo(
	centerX + width/2, centerY - height/2,
	centerX + width/2, centerY + height/2,
	centerX, centerY + height/2);

  context.bezierCurveTo(
	centerX - width/2, centerY + height/2,
	centerX - width/2, centerY - height/2,
	centerX, centerY - height/2);
 
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
	if(breathAmt > breathMax) {
	  breathDir = 1;
	}
  }
}

/*
 * Updates the blink pattern of the character.
 */
function updateBlink() { 
				
  eyeOpenTime += blinkUpdateTime;
	
  if(eyeOpenTime >= timeBtwBlinks){
	blink();
  }
}

/*
 * Makes the character's eyes blink.
 */
function blink() {

  curEyeHeight -= 1;
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
        coconut.draw(canvas);
        coconut.fall();
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
* Add coconuts to the coconut array 
*/
function fillCocoArray(canvas) {

    for (var i = 0; i < numCoconuts - cocoArray.length; i++) {
        var ranx = Math.floor(Math.random() * canvas.width);
        cocoArray.push(new Coconut(ranx, -70));
    }
    //full = true;
}

/* 
 * Contructs a coconut with given x,y coordinates
*/
function Coconut(x, y) {
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
    this.fallSpeed = Math.floor(Math.random() * 5) + 2;
    this.animation = new Animation(images["cocoSprite"], 0, 0, 93, 65, 0.02, 6, true, false);
    

}

/* 
 * Function that increments y coordinate of coconut
 */
Coconut.prototype.fall = function () {

    if (this.y < (canvas.height - (120 /*+ images["Coconut"].height*/))) {
        this.y += this.fallSpeed;

    } else {
        this.removeFromWorld = true;
    }

}

/*
 *Draws a coconut
 */
Coconut.prototype.draw = function () {
<<<<<<< HEAD
    if (this.y > canvas.height - 100) {   //+ images["Coconut"].height)
        //context.drawImage(images["cocobreak"], this.x, this.y);
=======
    if (this.y > canvas.height - 170) {   
>>>>>>> 4b46df8ef40f0fda53551f3fdb1253cfca8fdb5e
        this.animation.drawFrame(clockTick, context, this.x, this.y);

    } else {
        context.drawImage(images["Coconut"], this.x, this.y);
        
    }
    
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