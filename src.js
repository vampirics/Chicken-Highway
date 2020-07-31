if ( file("images.res", 0) != 1 ){
    console("Could not find resources!");
    exit();
}

var playerY1 = 150;
var score1 = 0;

var playerY2 = 150;
var score2 = 0;

var Chicken1Anim = 0;

// CHANGED
const CAR_IDX = 8;
const PLAYER1_IDX = 1;
const PLAYER2_IDX = 2;

const vCars = 4;//each car has 4 varialbes
const cCars = 6 * 4;// we have 6 cars and each car has 4 variables each
const nCars = 6;
var tCars = Array( cCars );

//initialize cars
for( var carid = 0; carid < nCars; carid++ )
{
	var i = carid * vCars; //determine the starting index in array for target car
	if(carid<3)
	{   //if this is car 0,1 or 2 then it is on the top half of the screen
		tCars[i] = 0;//set Car (cardid) X coordinate
		tCars[i+1] = 22+(carid*21);//set Car (cardid) Y coordinate - 22,43,64
		tCars[i+2] = random(1,5)-6;//set Car (cardid) XSPEED
    }
        else
        {
		    tCars[i] = 220;//set Car (cardid) X coordinate
		    tCars[i+1] = 92+((carid-3)*21);//set Car (cardid) Y coordinate - 92,113,134
		    tCars[i+2] = random(1,5);//set Car (cardid) XSPEED
	    }
	tCars[i+3] = random(1,3);//set Car (cardid) type
}


var start = time()

const StreetBG = file("StreetBG", 0); 
const redCar = file("FreewayCar2", 0); 
const greenCar = file("FreewayCar1", 0); 

const playerOne = file("FreewayChicken_F1", 0);
const playerOneF2 = file("FreewayChicken_F2", 0);

const playerTwo = file("FreewayChicken2_F1", 0);
const playerTwoF2 = file("FreewayChicken2_F2", 0);

const Chicken1box = file("Chicken1box", 0);
const Chicken2box = file("Chicken2box", 0);


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

// CHANGED
function collide(carIdx, playerIdx)
{
    if (playerIdx == 1) { music("pouletjade.raw"); playerY1 = 150}
    if (playerIdx == 2) { music("pouletpapa.raw"); playerY2 = 150}
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
    io("COLLISION", PLAYER1_IDX, CAR_IDX, collide);
    sprite(50, playerY1 + 6, Chicken1box);
        Chicken1Anim++;
        if((Chicken1Anim/3)%2==0)
        sprite(50, playerY1, playerOne);
    else
        sprite(50, playerY1, playerOneF2);
        //sprite(50, playerY1, playerOne);
    
    io("COLLISION", PLAYER2_IDX, CAR_IDX, collide);
    sprite(150, playerY2 + 6, Chicken2box);
        //Chicken1Anim++;
        if((Chicken1Anim/3)%2==0)
        sprite(150, playerY2, playerTwo);
    else
        sprite(150, playerY2, playerTwoF2);
        //sprite(150, playerY2, playerTwo);
}

function updateCars(){
	for( var carid = 0; carid < nCars; carid++ ) {
		var i = carid * vCars;//determine the starting index in array for target car
		tCars[i] += tCars[i+2]; //move target cars x coordinate by the cars speed 
		//check to see if car i has left the edge of the screen and needs to be reset
		if(tCars[i+2]>0){//car is moving to the right
			if(tCars[i]>252){//car i x coordinate is greater than right edge of screen
				tCars[i] = 0;//set car x coordinate back to 0
				tCars[i+2] = random(1,5);// set car speed to a random number between 1 and 4
				tCars[i+3] = random(1,3);// set car type to a random number between 1 and 2
			}
		}else{//car must be moving left
			if(tCars[i]<-64){
				tCars[i] = 252;//set car x coordinate back to 252
				tCars[i+2] = random(1,5)-6;// set car speed to a random number between 1 and 4 then subtract 6 to get a negative number
				tCars[i+3] = random(1,3);// set car type to a random number between 1 and 2
			}
		}
	}
}


function carRender()
{
	for (var i = 0; i < nCars; i++)
	{
	for( var carid = 0; carid < nCars; carid++ ) {
		var i = carid * vCars;//determine the starting index in array for target car
		if(tCars[i+2]>0){//car is moving to the right
			mirror( false );
		}else{//car must be moving left
			mirror( true );
		}
        io("COLLISION", CAR_IDX, 0); // CHANGED
		if(tCars[i+3]==1){//is target car type = 1 then it is a red car
			sprite(tCars[i] - 32, tCars[i+1], redCar);	//draw red car at x and y coordinate 
		}else{//car must be green
			sprite(tCars[i] - 32, tCars[i+1], greenCar);	//draw green car at x and y coordinate 
		}
	}
	}
}

function checkForPoint()
{
    if (playerY1 <= 0)
    {
        score1 +=1;
        playerY1 = 150;
        playSound();
    }
    
    if (playerY2 <= 0)
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

function gameOver()
{
    highscore(max(score1, score2))
    background();
    updateCars();
    carRender();
    if (score1 > score2)
    {
        color(7); cursor(55,75);
        print("PLAYER 1 WINS!")
        color(0);
    }
    else
    {
        color(7); cursor(55,75);
        print("PLAYER 2 WINS!")
        color(0);
    }
    if (timeSinceStart >=60) timeSinceStart = 60;
    if (pressed("A")) exit();
}


function update()
{
    var timeSinceStart = (time() - start) / 1000; 
    if(timeSinceStart >= 60) {
        gameOver();
    } else {
        checkForPoint();
        waitForInput();
        background();
        color(175); cursor(105,5); print(60 - timeSinceStart); color(0);
        updateCars();
        carRender();
        playerRender();
    }
    scoreDisplay();

} 