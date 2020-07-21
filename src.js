if ( file("images.res", 0) != 1 ){
    console("Could not find resources!");
    exit();
}

var playerY1 = 150;
var score1 = 0;

var playerY2 = 150;
var score2 = 0;

var start = time()

const StreetBG = file("StreetBG", 0); 
const redCar = file("FreewayCar2", 0); 
const greenCar = file("FreewayCar1", 0); 

const playerOne = file("FreewayChicken_F1", 0);
const playerTwo = file("FreewayChicken2_F1", 0);


function waitForInput()
{
    // Player One Input
    if ((pressed("UP")) && (playerY1 > 0))           playerY1-=2;
    if ((pressed("DOWN")) && (playerY1 < 150))        playerY1+=2;
    
    // Player Two Input
    if ((pressed("A")) && (playerY2 > 0))           playerY2-=2;
    if ((pressed("B")) && (playerY2 < 150))        playerY2+=2;

    if (pressed("C"))                                exit();
    
}

function background()
{
 for( var x = 0; x < 220; x+=30 ) { sprite(x, 0, StreetBG); }
}

function scoreDisplay()
{
    color(7);
    cursor(15,5)
    print(score1);
    
    cursor(200,5)
    print(score2);
    color(0);  
}

function playerRender()
{
    sprite(50, playerY1, playerOne);
    sprite(150, playerY2, playerTwo);
}

function checkForPoint()
{
    if (playerY1 == 0)
    {
        score1 +=1;
        playerY1 = 150;
        playSound();
    }
    
    if (playerY2 == 0)
    {
        score2 +=1;
        playerY2 = 150;
        playSound();
    }
}


function playSound()
{
    io("VOLUME", 127);
    io("DURATION", 70);
    sound(random(44, 47));
}


function update()
{
    var timeSinceStart = (time() - start) / 1000; if(timeSinceStart >= 60) exit();
    
    checkForPoint();
    waitForInput();
    background();
    color(175); cursor(105,5); print(60 - timeSinceStart); color(0);
    playerRender();
    scoreDisplay();
    
}
