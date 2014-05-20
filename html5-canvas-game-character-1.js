
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
var score = 0;
var livesCount = 3;
var jumpCount = 0;
var cocoArray = [];
var highscorelist = [0,0,0,0,0];
var numCoconuts = 6;
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


function updateFPS() {
	
	curFPS = numFramesDrawn;
	numFramesDrawn = 0;
}		
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

}

function loadImage(name) {

  images[name] = new Image();
  images[name].onload = function() { 
	  resourceLoaded();
  }
  images[name].src = "images/" + name + ".png";
}

function resourceLoaded() {

  numResourcesLoaded += 1;
  if(numResourcesLoaded === totalResources) {
 
	setInterval(redraw, 1000 / fps);
  }
}

function jump() {
    if (!jumping) {

            jumping = true;
            jumpCount++;
            if (jumpCount > 3)
            {
                livesCount--;
            }
            setTimeout(land, 800);
        }
    
}

function land() {
    jumping = false;
}


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
        else if (menuval ==1) {
            context.fillText("HighScore", 350, 300);
        }
        
        this.updateArray();

    }
    else if(currentstate == state.HighScore)
    {
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
            if (score > highscorelist[4])
            {
                var i = 4;
                while(score > highscorelist[i] && i > 0)
                {
                    i--;
                }
                if (i == 0)
                {
                    highscorelist[4] = highscorelist[3];
                    highscorelist[3] = highscorelist[2];
                    highscorelist[2] = highscorelist[1];
                    highscorelist[1] = highscorelist[0];
                    highscorelist[i] = score;

                }
                else
                {
                    highscorelist[i] = score;
                }
                
            }
            
            currentstate = state.HighScore;
        }
        var x = charX;
        var y = charY;
        var jumpHeight = 100;

        canvas.width = canvas.width; // clears the canvas 
        context.drawImage(images["background"], 0, 0); //draws background
        //drawEllipse(x + 40, y + 29, 160 - breathAmt, 6); // Shadow

        //Handle keyboard controls
        window.addEventListener('keypress', function (e) {
            if (e.keyCode === 32 && currentstate == state.Gameplay) { //space
                jump();
            }
            if (e.keyCode === 37) { //left

            }
            if (e.keyCode === 39) { //right

            }
        }, false);

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

        this.fillCocoArray(canvas);
        this.drawCoconuts(canvas);
        this.updateArray();

        score += 1;
    }
   
}

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

function updateBlink() { 
				
  eyeOpenTime += blinkUpdateTime;
	
  if(eyeOpenTime >= timeBtwBlinks){
	blink();
  }
}

function blink() {

  curEyeHeight -= 1;
  if (curEyeHeight <= 0) {
	eyeOpenTime = 0;
	curEyeHeight = maxEyeHeight;
  } else {
	setTimeout(blink, 10);
  }
}

/**Draws the coconuts in the array*/
function drawCoconuts(canvas) {
    for (var i = 0; i < cocoArray.length ; i++) {
        var coconut = cocoArray[i];
        coconut.draw(canvas);
        coconut.fall();
    }

}

/** Removes coconuts that have fallen on the ground*/
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

/**Add coconuts to the coconut array */
function fillCocoArray(canvas) {

    for (var i = 0; i < numCoconuts - cocoArray.length; i++) {
        var ranx = Math.floor(Math.random() * canvas.width);
        cocoArray.push(new Coconut(ranx, -70));
    }
    //full = true;
}

/** Contructs a coconut with given x,y coordinates*/
function Coconut(x, y) {
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
    this.fallSpeed = Math.floor(Math.random() * 5) + 2;
}

/** Function that increments y coordinate of coconut */
Coconut.prototype.fall = function () {

    if (this.y < canvas.height) {
        this.y += this.fallSpeed;

    } else {
        this.removeFromWorld = true;
    }

}

/**Draws a coconut*/
Coconut.prototype.draw = function () {
    context.drawImage(images["Coconut"], this.x, this.y);
}