//Aws Aldarwish
main();

function main(){
    let openSet=[];
    let closedSet=[];
    let bestPath = [];
    //Please make sure your problem is solvable
    let start = [1,2,3,0,4,6,7,5,8];
    let goal =  [1,2,3,4,5,6,7,8,0];
    let Puzzle = function(tiles){
        this.g = 0;
        this.f = 0;
        this.h = 0;
        this.cameFrom = undefined;
        this.tiles = tiles;
        this.possibilites = [];
    }
    
    let myPuzzle = new Puzzle(start);

    astarSearch();

    function removeFromArray(list,value){
        for (let i = list.length - 1 ;i >= 0; i--)
            if (list[i] == value)  list.splice(i,1);
    }
    function calcH(node){
        let count = 0;
        for(var i =0;i<goal.length;i++){
            if(goal[i] != node.tiles[i])
                if(node.tiles[i] != 0)
                    count++;
        }
        return count;
    }


    function moveRight(node){
        let zeroIndex = node.tiles.indexOf(0);    
        let tempList = Object.assign([],node.tiles);
        if(zeroIndex != 2 && zeroIndex != 5 && zeroIndex != 8){
            tempList[zeroIndex] = tempList[zeroIndex+1];
            tempList[zeroIndex+1] = 0;
            let puzzleNode = new Puzzle(tempList);
            node.possibilites.push(puzzleNode);
        }
    }
    function moveLeft(node){
        let zeroIndex = node.tiles.indexOf(0);    
        let tempList = Object.assign([],node.tiles);
        if(zeroIndex != 0 && zeroIndex != 3 && zeroIndex != 6){
            tempList[zeroIndex] = tempList[zeroIndex-1];
            tempList[zeroIndex-1] = 0;
            let puzzleNode = new Puzzle(tempList);
            node.possibilites.push(puzzleNode);
        }
    }
    function moveUp(node){
        let zeroIndex = node.tiles.indexOf(0);    
        let tempList = Object.assign([],node.tiles);
        if(zeroIndex != 0 && zeroIndex != 1 && zeroIndex != 2){
            tempList[zeroIndex] = tempList[zeroIndex-3];
            tempList[zeroIndex-3] = 0;
            let puzzleNode = new Puzzle(tempList);
            node.possibilites.push(puzzleNode);
        }
    }
    function moveDown(node){
    
        let zeroIndex = node.tiles.indexOf(0);    
        let tempList = Object.assign([],node.tiles);
        if(zeroIndex != 6 && zeroIndex != 7 && zeroIndex != 8){
            tempList[zeroIndex] = tempList[zeroIndex+3];
            tempList[zeroIndex+3] = 0;
            let puzzleNode = new Puzzle(tempList);
            node.possibilites.push(puzzleNode);
        }
    }


    function createTable(list){
        let body = document.getElementsByTagName("body")[0];
        let table = document.createElement("TABLE");
        table.className += "paleBlueRows";
        let tableBody = document.createElement("TBODY");
        table.appendChild(tableBody);
        let k = 0;
        for (let i = 0; i < 3; i++) {
            let tr = document.createElement("TR");
            tableBody.appendChild(tr);
            for (let j = 0; j < 3; j++) {
                let td = document.createElement("TD");
                tr.appendChild(td);
                if(list[k] != 0)
                    td.innerHTML = list[k];
                k++;
            }    
        }
        body.appendChild(table);   
        let br = document.createElement("br");
        body.appendChild(br);
    }


    function astarSearch(){
        closedSet = [];
        bestPath = [];
        openSet.push(myPuzzle);
    
        while(openSet.length > 0 ){
            let bestOne = 0;
            for (let i = 0; i < openSet.length; i++) {
                if (openSet[i].f < openSet[bestOne].f) {
                    bestOne = i;
                }
            }
            let currentPos = openSet[bestOne];
            if (JSON.stringify(currentPos.tiles)==JSON.stringify(goal)) {
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
    
            moveRight(currentPos);
            moveLeft(currentPos);
            moveUp(currentPos);
            moveDown(currentPos);
    
            let possibilites = currentPos.possibilites;
    
            for(let i = 0 ; i < possibilites.length; i++){
    
                let possibility = possibilites[i];
    
                if(!closedSet.includes(possibility)){
                      let tempG = currentPos.g  + 1;
    
                      if(!openSet.includes(possibility)){
                          if (tempG < possibility.g) 
                              possibility.g = tempG;
                          else{
                              possibility.g = tempG;
                              openSet.push(possibility);
                          }
                          possibility.h = calcH(possibility);
                          possibility.f = possibility.g + possibility.h;
                          possibility.cameFrom = currentPos;
                      }
                }
            }
            console.log(currentPos);
            
        }
        console.log(bestPath);
        
        for (let i = bestPath.length - 1; i >= 0; i--) {
            createTable(bestPath[i].tiles);
        }
    
    }

}