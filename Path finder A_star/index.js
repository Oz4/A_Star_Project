//Aws Aldarwish
let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth/1.4;
canvas.height = window.innerHeight/1.7;
let c = canvas.getContext("2d");


let rows = 100,cols =100;
let GRID = [];
let robotPos;
let robotGoal;
let openSet=[];
let closedSet=[];
let bestPath = [];
let TILESIZE = 50;
let obstaclesPrecentage = 2;//100 / obstaclesPrecentage = 50 % obstacles , 1.5 = 75% ,2.5 = 25%
let flag = false;

function Square(x,y,isObstacle,){
    this.g =0;
    this.f =0;
    this.h =0;
    this.x = x;
    this.y = y;
    this.neighbors = [];
    this.isObstacle = isObstacle;
    this.cameFrom = undefined;

    this.draw=function(color){
        c.fillStyle = color;
        c.fillRect(this.x*TILESIZE,this.y*TILESIZE,TILESIZE,TILESIZE);
        c.strokeStyle = '#dadde5'
        c.strokeRect(this.x*TILESIZE,this.y*TILESIZE,TILESIZE,TILESIZE);
    }

    this.addNeighbors = function(grid){
        if(this.x < cols -1 && grid[this.x + 1][this.y].isObstacle == false){
            this.neighbors.push(grid[this.x + 1][this.y]);
        }
        if(this.x > 0 && grid[this.x - 1][this.y].isObstacle == false){
            this.neighbors.push(grid[this.x - 1][this.y]);
        }
        if(this.y < rows - 1 && grid[this.x][this.y + 1].isObstacle == false){
            this.neighbors.push(grid[this.x][this.y + 1]);
        }
        if(this.y > 0 && grid[this.x][this.y - 1].isObstacle == false){
            this.neighbors.push(grid[this.x][this.y - 1]);
        }
    }
    
}
function resetGHF(){
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            GRID[i][j].g = 0;
            GRID[i][j].h = 0;
            GRID[i][j].f = 0;
            GRID[i][j].cameFrom = undefined;
        }
    }
}

function drawGrid(){
    c.clearRect(0, 0, canvas.width, canvas.height);
    GRID = [];
    let temp = document.getElementById("grid").value.split(",");
    rows = parseInt(temp[0]);
    cols = parseInt(temp[1]);	
	let canvasArea = (canvas.width-300) * (canvas.height-300);
	let totalBoxes = rows * cols;
	let areaPerBox = canvasArea / totalBoxes;
	TILESIZE = Math.sqrt(areaPerBox);

    for (let i = 0; i < cols; i++) {
        GRID[i] = [];
        for (let j = 0; j < rows; j++) {
            GRID[i][j] = new Square(i,j,false);
            GRID[i][j].draw("#455462");
        }
    }
    
    for (let i = 0; i < cols / 2; i++) {
        for (let j = 0; j < rows / 2; j++) {
            let a = Math.floor(Math.random() * cols);
            let b =  Math.floor(Math.random() * rows);
            GRID[a][b].isObstacle = true;
            GRID[a][b].draw("#c4eeb7");
        }
    }
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            GRID[i][j].addNeighbors(GRID);
        }
    }
    flag = false;
    
}
function robotPosition(){
    for(let i = 0;i< bestPath.length;i++) {
        bestPath[i].draw("#455462");
        if(bestPath[i].isObstacle == true)
            bestPath[i].draw("#c4eeb7");
    }
    bestPath = []; 
   // openSet = [];
    let temp = document.getElementById("position").value.split(",");    
    let col = parseInt(temp[0]);
    let row = parseInt(temp[1]);
    if(GRID[col - 1][row - 1].isObstacle == false){
        robotPos = GRID[col - 1][row - 1];
        robotPos.draw("#eeb76e");
       // openSet.push(robotPos);
    }
    else{
        console.log("the robot position you picked is an obstacle");
    }
}
function goalPosition(){
    for(let i = 0;i< bestPath.length;i++){        
        bestPath[i].draw("#455462");
        if(bestPath.length - 1 == i)
            bestPath[i].draw("#eeb76e");
        if(bestPath[i].isObstacle == true)
            bestPath[i].draw("#c4eeb7");
        
    }
    openSet = [];
    openSet.push(robotPos);
    let temp = document.getElementById("goal").value.split(",");    
    let col = parseInt(temp[0]);
    let row = parseInt(temp[1]);
    
    if(GRID[col - 1][row - 1].isObstacle == false){
        robotGoal = GRID[col - 1][row - 1];
        robotGoal.draw("#fb294b");
            astarSearch();
    }
    else{
        console.log("the goal position you picked is an obstacle");
    }
}
function calcDistance(x1,y1,x2,y2){
    return Math.abs(x1-x2) + Math.abs(y1-y2);
}
function removeFromArray(arr,value){
    for (let i = arr.length - 1 ;i >= 0; i--)
        if (arr[i] == value) 
            arr.splice(i,1);
}
function astarSearch(){
    resetGHF();
    closedSet = [];
    bestPath = [];
    
    while(openSet.length > 0 ){
        let bestOne = 0;
        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[bestOne].f) {
                bestOne = i;
            }
        }
        let currentPos = openSet[bestOne];
        if (currentPos.x == robotGoal.x && currentPos.y == robotGoal.y) {
            let tempcurrent = currentPos;
            bestPath.push(tempcurrent);
            while(tempcurrent.cameFrom){
                bestPath.push(tempcurrent.cameFrom);
                tempcurrent = tempcurrent.cameFrom;
            }
            console.log("Done!");  
            break; 
        }
        
        removeFromArray(openSet,currentPos);
        closedSet.push(currentPos);
        let neighbors = currentPos.neighbors;
        

        for(let i = 0 ; i < neighbors.length; i++){

            let neighbor = neighbors[i];

            if(!closedSet.includes(neighbor)){
                  let tempG = currentPos.g  + 1;

                  if(!openSet.includes(neighbor)){
                      if (tempG < neighbor.g) 
                          neighbor.g = tempG;
                      else{
                          neighbor.g = tempG;
                          openSet.push(neighbor);
                      }
                      neighbor.h = calcDistance(neighbor.x,neighbor.y,robotGoal.x,robotGoal.y);
                      neighbor.f = neighbor.g + neighbor.h;
                      neighbor.cameFrom = currentPos;
                  }
            }
        }
    }

    for(let i = 0;i< bestPath.length;i++){        
        bestPath[i].draw("rgba(204,65,65,0.4)");
    }

}
canvas.addEventListener('click', event =>
{
    if(flag == false){
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                if(GRID[i][j] != robotGoal && GRID[i][j] != robotPos){
                    GRID[i][j].isObstacle = false;
                    GRID[i][j].draw("#455462")
                }
            }
        }
        flag = true;
    }
    let bound = canvas.getBoundingClientRect();

    let x = event.clientX - bound.left - canvas.clientLeft;
    let y = event.clientY - bound.top - canvas.clientTop;
    a = Math.floor(x / TILESIZE);
    b = Math.floor( y / TILESIZE);
    GRID[a][b].isObstacle = true;
    GRID[a][b].draw("#c4eeb7");
    
    //Adding neighbors
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            GRID[i][j].neighbors = [];
            GRID[i][j].addNeighbors(GRID);
        }
    }
});