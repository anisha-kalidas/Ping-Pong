
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2.5;
var dy = -2.5;
var ballRadius = 8;
var paddleHeight = 20;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 5;
var brickColumnCount = 7;
var brickWidth = 75;
var brickHeight = 23;
var brickPadding = 15;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var lives = 3;
var message = document.getElementById("message");
var color = "red";
var bounce = new Audio('audio/bounce.mp3');
var brick = new Audio('audio/bricks.mp3');

var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// listening for key presses
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}


// draw the ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = color;
    ctx.strokeStyle = "gray";
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
}

// draw the paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight-1);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// draw the bricks
function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}


// make the ball move

window.onload = function() {  
    Swal.fire({
        title: "Play Ping Pong!",
        text: "Use left and right arrows to move the paddle",
        confirmButtonText: "Start Game"
            }).then(() => {
                draw();
            }
            );
        }  

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    x += dx;
    y += dy;

    // make the ball bounce off left and right walls
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    // make the ball bounce off the ceiling
    if (y + dy < ballRadius) {
        dy = -dy;
    
    // if the ball touches the floor....
    } else if(y + dy > canvas.height-ballRadius-18) {
        // if the paddle is in the way, then bounce
        if (x > paddleX-1 && x < paddleX + paddleWidth +1) {
            bounce.play();
            dy = -dy * 1.15;
            color = randomColor({
                luminosity: "bright"
            });


        // otherwise game over
        } else if (y + dy > canvas.height) {
            lives--;
            if(!lives) {
                gameover();
                cancelAnimationFrame();
                
            } else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 3;
                dy = -3;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

    // move the paddle when left and right keys are pressed 
    if(rightPressed && paddleX < canvas.width-paddleWidth-3) {
        paddleX += 10;
    }
    else if(leftPressed && paddleX > 3) {
        paddleX -= 10;
    }

requestAnimationFrame(draw);
}


// detect collision with bricks
function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    brick.play();
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                        win();
                        cancelAnimationFrame();          
                    }
                }
            }
        }
    }
}

// add a score board
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Score: "+score, 8, 20);
}

// add life counter
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function win() {
    Swal.fire({
        title: "YOU WIN !",
        text: "CONGRATULATIONS",
        confirmButtonText: "Play Again"
    }).then(() => {
        document.location.reload();
    })      
}

function gameover() {
    Swal.fire({
        title: "GAME OVER",
        text: "Better Luck Next Time!",
        confirmButtonText: "Try Again"
    }).then(() => {
        document.location.reload();
    })      

}