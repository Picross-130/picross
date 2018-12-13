//when window is loaded call setup
window.onload = setup;

//Didn't wanna use globals but can't really think of an easier way
var blockColor = "black";
var gridColor = "white";
var numTurns = 0;           //current number of turns
var numElements = 0;        //number of elements placed on grid (number of non-space elements)
var numElemsClicked = 0;    //incremented when user selected cell, decremented when user unselects cell
var levelIndex = 0;        //current arcade level
var gridSize = 0;
var playMode = null;        //mode user chooses
var levelList = [{}];       //list of levels in the arcade mode
var completedLevel = [];    //reference to the completed level
var currentLevel = [];      //what the current level looks like as user plays (selects cells)
var startInterval;          //handler for setInterval(startTime function) 
var countDownTime;          //player has 5 mininutes to complete a level
var countDownInterval;      //handler for setInterval(countDown function)
var imgFileName = "";       //name of the image the user uploaded
var score = 0;              //user's score
// var numNonSpaceElems = 0;   //number of non-space elements
var numErrors = 0;          //numbe of errors

//Login Popup form
function launch(){
    var modal = document.getElementById('modal');
    
    //shows the login box
    modal.style.display ="block";

    //if user clicks anywhere on the screen besides the popup, screen closes
    window.onclick = function(event){
        if(event.target == modal){
            modal.style.display = "none";
        }
    }
}

function launchRegister(){
    var modal = document.getElementById('modal');
    modal.style.display = "none";

    var regModal = document.getElementById('register-modal');

    //shows the login box
    regModal.style.display ="block";

    //if user clicks anywhere on the screen besides the popup, screen closes
    window.onclick = function(event){
        if(event.target == regModal){
            regModal.style.display = "none";
        }
    }
}
//find out why this doesn't work
function launchUser(){
    // var modal = document.getElementById('modal');
    // modal.style.display = "none";

    console.log("hello");

    var userModal = document.getElementById('user-modal');
    userModal.style.display = "block";
    //shows the logout box

    //if user clicks anywhere on the screen besides the popup, screen closes
    window.onclick = function(event){
        if(event.target == userModal){
            userModal.style.display = "none";
        }
    }
}

//Setup even listeners, create necessary elements and hide certain elements
//not currently needed
function setup(){
    //hide asides in index.html until user chooses grid size
    document.getElementById("asideLeft").style.display = "none";
    document.getElementById("gridSettings").style.display = "none";
    document.getElementById('modal').style.display = "none";

    //create div to hold the timer
    var timer = document.createElement("h3");
    timer.setAttribute("id","timer");
    timer.textContent = "Timer:";
    document.getElementById("asideLeft").appendChild(timer);

    //onclick event for all three mode buttons
    document.getElementById("normalMode").addEventListener("click", function(event){userModeChoice(event.target.id);})
    document.getElementById("arcadeMode").addEventListener("click", function(event){userModeChoice(event.target.id);})
    document.getElementById("timeAttackMode").addEventListener("click", function(event){userModeChoice(event.target.id);})

    //onclick event aside div buttons
    document.getElementById("mainMenuBtn").addEventListener("click",function(){window.location.href = "../php/index.php";});
    document.getElementById("bestMove").addEventListener("click",function(){hint(1);});
    document.getElementById("worstMove").addEventListener("click",function(){hint(2);});
    document.getElementById("done").addEventListener("click",checkGameProgress);

    //To detect when grid color radio button was selected
    $("input.gridColors").change(function() {
        changeGridColor(this.value);
    });

    //To detect when a change grid color radio button was selected
    $("input.blockColors").change(function() {
        changeBlockColor(this.value);
    });
}

//==================================================
//=             Start of Helper functions          =
//==================================================

//Called by selectMode() when user choses a mode to play
function basicSetup(){
    console.log("in basicsetup");
    /*Div to hold the grid option title, 7x7
      and 13x13 buttons*/
    var gridOptionDiv = document.createElement("div");
    gridOptionDiv.setAttribute("id", "gridOptionDiv");
    
    //Title for grid options
    var gridOptionHeader = document.createElement("h2");
    gridOptionHeader.setAttribute("id", "gridOptionHeader");
    gridOptionHeader.textContent = "Play with 7x7 or 13x13 grid?"

    //Create button and add onclick event for 7x7 option
    optionBtn7 = document.createElement("button");
    optionBtn7.setAttribute("id","btn7");
    optionBtn7.addEventListener("click", clickedBtn7);
    optionBtn7.textContent = "7x7";

    //Create button and add onclick event for 13x13 option
    optionBtn13 = document.createElement("button");
    optionBtn13.setAttribute("id","btn13");
    optionBtn13.addEventListener("click", clickedBtn13);
    optionBtn13.textContent = "13x13";

    //Append buttons and option title
    gridOptionDiv.appendChild(gridOptionHeader);
    gridOptionDiv.appendChild(optionBtn7);
    gridOptionDiv.appendChild(optionBtn13);

    //Append option div
    document.getElementById("gameTitle").appendChild(gridOptionDiv);

    //Hide mode buttons
    document.getElementById("modeDiv").style.display = "none";
}

//create an n x n table (the grid)
function createTable(n){
    //current level initilization
    for( var currLevelIndex = 0; currLevelIndex < gridSize*gridSize; currLevelIndex++)
        currentLevel[currLevelIndex] = 0;

    console.log("Current level: " + currentLevel);

    console.log("in createtable");
    //properties related to the table
    var nameOfTable = "table" + n;  //will hold id of table
    var table = document.createElement("table");            
    table.setAttribute("id",nameOfTable);
    table.setAttribute("class", "aTable");

    var tdCount1 = 0;   //to keep cound of how many cells

    //# CHANGES MADE FOR DISPLAYING CELL TEXT VERTICALLY
    var THCR = document.createElement("tr");
    THCR.setAttribute("id","thcr");
    //END OF CHANGES
    for(var k = 0; k < n+1; k++){
        var aTHC = document.createElement("th");
        aTHC.setAttribute("id","thc"+k);
        aTHC.setAttribute("class","thc");
        aTHC.textContent = aTHC.getAttribute("id");
        THCR.appendChild(aTHC); //#1 CHANGES
        // table.appendChild(aTHC);
    }
    table.appendChild(THCR);    //#1 CHANGES

    //create tds (cells) of table
    for(var i = 0; i < n; i++){
        var tdCount2 = 0;   //to keep count of how many cells
        var aTR = document.createElement("tr");
        var aTHR = document.createElement("th"); //a table header for a row (holds nanogram info for that row)
        aTHR.setAttribute("id","thr"+i);    //thr_
        aTHR.setAttribute("class","thr");
        aTHR.textContent = aTHR.getAttribute("id");
        aTR.appendChild(aTHR);
        for(var j = 0; j < n; j++){
            var aTD = document.createElement("td")  //create a cell
            var cell_id = "cell";                   //id value for cell
            aTD.setAttribute("id","cell"+ (tdCount1+tdCount2));
            aTD.setAttribute("class","cell");
            aTD.setAttribute("value","0");  //to toggle between clicked/unclicked
            aTD.setAttribute("name",tdCount1+tdCount2);
            // aTD.innerHTML = aTD.getAttribute("name");
            //add onclick event for each cell
            aTD.addEventListener("click", function(){cellClicked(this);}, false);
            // aTD.addEventListener("click", function(){cellClicked(this.id);}, false);
            aTR.appendChild(aTD);   //attach td to tr
            aTD.style.border = "1px solid black";
            table.style.borderCollapse="collapse";
            tdCount1++;
        }
        table.appendChild(aTR);     //attach tr to table
        tdCount2++;
    }

    //append table
    document.getElementById("centerGridDiv").appendChild(table);

    //div to hold progress when player clicks done btn
    var progressDiv = document.createElement("div");
    progressDiv.setAttribute("id","progress");
    progressDiv.style.fontWeight = 'bold';
    progressDiv.style.fontSize = 'x-large';
    progressDiv.style.display = "none";
    document.getElementById("centerGridDiv").appendChild(progressDiv);

    table.style.margin = "auto";

    //reset color for grid/blocks
    $("#gw").prop("checked",true);
    $("#bb").prop("checked",true);
    changeGridColor("white");
    changeBlockColor("black");

    document.getElementById("timer").textContent = "Time: 0:0:0";

    //start time to be used for normal and arcade mode
    if(playMode == "normalMode" || playMode == "arcadeMode"){
        //startTime();
        var startTime = Date.now();
        startInterval = setInterval(function(){getTime(startTime);}, 1000);
    }
    else{
        if(n == 7)
            countDownTime = 300;
        else if (n == 13)
            countDownTime = 600;
        countDownInterval = setInterval(function(){countDown();}, 1000);
    }
}

//When a cell is clicked
function cellClicked(cell){
    cellId = cell.id;
    var thisCell = document.getElementById(cellId);
    cellName = thisCell.getAttribute("name");

    //remove the error message (if any)
    document.getElementById("progress").style.display = "none";

    if(document.getElementById(cellId).getAttribute("value") === "0"){
        $("#"+cellId).attr("value", "1");
        $("#"+cellId).css("background-color", blockColor);
        numElemsClicked++;
    }
    else{
        $("#"+cellId).attr("value", "0");
        $("#"+cellId).css("background-color", gridColor);
        numElemsClicked--;
    }

    //upadate cell value for current level prior to checking game completion
    if(currentLevel[cellName] === 1){
        currentLevel[cellName] = 0;
    }
    else if(currentLevel[cellName] === 0){
        currentLevel[cellName] = 1;
    }

    console.log("numElemsClicked: " + numElemsClicked);
    console.log("CurrentLevel: " + currentLevel);

    numTurns++;
    document.getElementById("numTurns").textContent = "Turns: " + numTurns;

}

//User selects grid size option 7x7. Display asides and call createTable()
function clickedBtn7(){
    console.log("in clicked 7");
  
    //Hide the grid option header
    document.getElementById("gridOptionDiv").style.display = "none";

    gridSize = 7;

    selectMode();
}

//User selects grid size option 13x13. Display asides and call createTable()
function clickedBtn13(){
    console.log("in clicked 13");

    //Hide the grid option header
    document.getElementById("gridOptionDiv").style.display = "none";

    gridSize = 13;

    selectMode();
}

//Deletes table when user changes grid size
function deleteTable(the_table_id){
    var table_to_remove = document.getElementById(the_table_id);

    var tableTRList = table_to_remove.children;

    //delete event handlers from table cells
    for( var i = 0; i < tableTRList.length; i++){
        var singleTRList = tableTRList[i];
        for( var j = 0; j < singleTRList.length; j++){
            var tableTDList = singTRList[j];
            for( var k = 0; k < tableTDList.length; k++){
                tableTDList[k].removeEventListerner("click", cellClicked);
            }
        }
    }

    //Children of center grid div
    var gridDivChildren = document.getElementById("centerGridDiv").children;

    //Delete table from div    
    document.getElementById("centerGridDiv").removeChild(gridDivChildren[1]);

    numTurns = 0;
    document.getElementById("numTurns").textContent = "Turns: " + numTurns;

}

function replaceModeDiv(){
    var center_grid_div = document.getElementById("centerGridDiv");
    var grid_div_children = center_grid_div.children;
    // document.getElementById("centerGridDiv").removeChild(grid_div_children[1]);

    var levelOptionDiv = document.createElement("div");
    levelOptionDiv.setAttribute("id", "levelOptionDiv");

    var randomLevelBtn = document.createElement("button");
    randomLevelBtn.setAttribute("id", "randomLevelBtn");
    randomLevelBtn.textContent = "Random Level";
    randomLevelBtn.addEventListener("click", createRandomLevel);

    var uploadImageBtn = document.createElement("button");
    uploadImageBtn.setAttribute("id", "uploadImageBtn");
    uploadImageBtn.textContent = "Upload image";
    uploadImageBtn.addEventListener("click",uploadImage);

    levelOptionDiv.appendChild(randomLevelBtn);
    levelOptionDiv.appendChild(uploadImageBtn);

    center_grid_div.removeChild(grid_div_children[1]);

    center_grid_div.appendChild(levelOptionDiv);

}

//Normal mode buttons and for image upload
function setupNormalMode(){
    var normModDiv = document.createElement("div");
    normModDiv.setAttribute("id","normModDiv");
    var normModH3 = document.createElement("h3");
    normModH3.textContent = "Select Option";
    var randomLevelBtn = document.createElement("button");
    randomLevelBtn.setAttribute("id","randLevelBtn");
    randomLevelBtn.style.backgroundColor = "rgb(86,192,248)";
    randomLevelBtn.textContent = "Random level";
    randomLevelBtn.addEventListener("click", function(){randomLevels();})

    var uploadImgBtn = document.createElement("button");
    uploadImgBtn.textContent = "Upload an image";
    uploadImgBtn.style.backgroundColor = "rgb(86,192,248)";
    uploadImgBtn.addEventListener("click", function(){uploadImage()});
    // uploadImgBtn.addEventListener("click", function(){normalMode(2);});

    normModDiv.appendChild(normModH3);
    normModDiv.appendChild(randomLevelBtn);
    normModDiv.appendChild(uploadImgBtn);
    //console.log(document.getElementById("centerGridDiv").children);
    document.getElementById("centerGridDiv").appendChild(normModDiv);
}

function randomLevels(){
    document.getElementById("centerGridDiv").removeChild(document.getElementById("normModDiv"));
    var randLevel = "";
    //create random level
    for( var r = 0; r < (gridSize*gridSize); r++){
        var aRandBlock = Math.floor(Math.random() * (1 - 0 + 1));
        if(aRandBlock === 1)
            numElements++;
        randLevel += aRandBlock;
    }

    console.log("Num Elemen: " + numElements);
    if(gridSize == 7){
        createTable(7);
    }
    else if( gridSize == 13){
        createTable(13);
    }
    console.log("Random level : " + randLevel);
    // completedLevel = randLevel;
    for( var rli = 0; rli < gridSize*gridSize; rli++)  //rli = rand level index
        completedLevel[rli] = randLevel.charAt(rli);

    console.log("Complete level : " + completedLevel);
    displayGridInfo(randLevel);
    document.getElementById("asideLeft").style.display = "block";
    document.getElementById("gridSettings").style.display = "block";
}

//displays the number of adjacent blocks in a row/column
function displayGridInfo(level){
    console.log("in displaygridinfo");
    // var level = arc_obj.game[levelIndex].level;
    var levelGridSize = 0;
    var rowBlocks = [];
    var columnBlocks = [];

    if(level.length === 49)
        levelGridSize = 7;
    else
        levelGridSize = 13;

    //get adjacent row blocks---------------------------
    var rIndex = 0;
    for( var i = 0; i < level.length; i+=levelGridSize){
        var gridLine = level.substr(i,levelGridSize);
        console.log(gridLine);
        var blockCount = 0;
        var lineIndex = 0;
        var rowSubArr = [];
        var rowIndex = 0

        while(lineIndex < levelGridSize){
            if( gridLine.charAt(lineIndex) == 1){
                blockCount++;
                if( lineIndex == levelGridSize-1){
                    rowSubArr[rowIndex] = blockCount;
                }
                else if( ((lineIndex+1) < levelGridSize) && gridLine.charAt(lineIndex+1) == 0){
                    rowSubArr[rowIndex] = blockCount;
                    rowIndex++;
                    blockCount = 0; 
                }
            }
            lineIndex++
        }
        rowBlocks[rIndex] = rowSubArr;
        rIndex++;
    }//row blocks----------------------------------------


    //get adjacent column blocks-------------------------
    var columnList = [];
    var theColumn = "";
    var columnIndex = 0;
    console.log(level);
    for( var m = 0; m < levelGridSize; m++){
        columnIndex = m;
        while( columnIndex < level.length ){
            theColumn += level.charAt(columnIndex);
            columnIndex += levelGridSize;
        }
        columnList[m] = theColumn;
        theColumn = "";
    }

    var cIndex = 0;
    for( var i = 0; i < level.length; i+=levelGridSize){
        var colLine = columnList[cIndex];
        var colCount = 0;
        var cLineIndex = 0;
        var colSubArr = [];
        var colIndex = 0
        while(cLineIndex < levelGridSize){
            if( colLine.charAt(cLineIndex) == 1){
                colCount++;
                if( cLineIndex == levelGridSize-1){
                    colSubArr[colIndex] = colCount;
                }
                else if( ((cLineIndex+1) < levelGridSize) && colLine.charAt(cLineIndex+1) == 0){
                    colSubArr[colIndex] = colCount;
                    colIndex++;
                    colCount = 0; 
                }
            }
            cLineIndex++
        }
        columnBlocks[cIndex] = colSubArr;
        cIndex++;
    }//column blocks -------------------------------------

    //display them in their appropriate place (row/column)
    for( var aRow = 0; aRow < levelGridSize; aRow++){
        var rowName = "thr"+aRow;
        var theRow = document.getElementById(rowName);
        var rowInfo = "";
        for(var blockIndex = 0; blockIndex < rowBlocks[aRow].length; blockIndex++){
            rowInfo += rowBlocks[aRow][blockIndex] + " ";
        }
        theRow.textContent = rowInfo;
    }

    var colCount = 1;
    for( var aColumn = 0; aColumn < levelGridSize; aColumn++){
        var colName = "thc"+colCount;
        var theCol = document.getElementById(colName);
        var colInfo = "";
        for(var cBlockIndex = 0; cBlockIndex < columnBlocks[aColumn].length; cBlockIndex++){
            colInfo += columnBlocks[aColumn][cBlockIndex] + " ";
        }
        theCol.textContent = colInfo;
        colCount++;
    }
}

// function continueArcadeMode(){
function continuePlaying(){
    document.getElementById("centerGridDiv").removeChild(document.getElementById("userScore"));
    // document.getElementById("userScore").style.display = "none";
    document.getElementById("progress").style.display = "none";
    document.getElementById("centerGridDiv").removeChild(document.getElementById("table"+gridSize));
    levelIndex++;
    numTurns = 0;
    document.getElementById("numTurns").textContent = "Turns: " + numTurns;
    document.getElementById("continuePlayingDiv").style.display = "none";
    playGame();
}

//function playArcadeMode(){
function playGame(){
    console.log(levelList[levelIndex].levelID);
    for( var arcL = 0; arcL < (gridSize*gridSize); arcL++){
        if(levelList[levelIndex].level.charAt(arcL) == 1)
            numElements++;
    }

    for( var arcIndex = 0; arcIndex < gridSize*gridSize; arcIndex++)
        completedLevel[arcIndex] = levelList[levelIndex].level.charAt(arcIndex);

    createTable(gridSize);
    displayGridInfo(levelList[levelIndex].level);
}

//function setupArcadeMode(game_obj){
function setupLevels(game_obj){

    //div with buttons will display once user successfully completes a level
    var continuePlayingDiv = document.createElement("div");
    continuePlayingDiv.style.display = "none";
    continuePlayingDiv.setAttribute("id", "continuePlayingDiv");

    var continueArcBtn = document.createElement("button");
    continueArcBtn.setAttribute("id","continueArcBtn");
    continueArcBtn.textContent = "Continue";
    //continueArcBtn.addEventListener("click",continueArcadeMode);
    continueArcBtn.addEventListener("click",continuePlaying);

    var homeArcBtn = document.createElement("button");
    homeArcBtn.setAttribute("id","homeArcBtn");
    homeArcBtn.textContent = "Main Menu";
    homeArcBtn.addEventListener("click",function(){window.location.href = "../php/index.php";});

    continuePlayingDiv.appendChild(continueArcBtn);
    continuePlayingDiv.appendChild(homeArcBtn);
    document.getElementById("centerGridDiv").appendChild(continuePlayingDiv);

    console.log(game_obj);
    if(gridSize == 7){
        levelList = game_obj.levels.levelSize7;
    }
    else if(gridSize == 13){
        levelList = game_obj.levels.levelSize13;
    }
    playGame();
}

//Load levels from server
function loadLevels(){
    var gameObj;    //object received from http request
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            gameObj = JSON.parse(this.responseText);
            gameObj = JSON.parse(gameObj);
            setupLevels(gameObj);
        }
    };
    xmlhttp.open("GET", "../php/nonogram.php", true);
    xmlhttp.send();
}

//========================================
//=        End of Helper Functions       =
//========================================

//User selects grid color radio button
function changeGridColor(grid_color){
    gridColor = grid_color;
    var gridList = document.querySelectorAll(".cell[value='0']");
    for( var i = 0; i < gridList.length; i++)
        gridList[i].style.backgroundColor = gridColor;
    $( ".aTable" ).css( "background-color", grid_color );

}

//User selects block color raio button
function changeBlockColor(block_color){
    blockColor = block_color;
    var cellList = document.querySelectorAll(".cell[value='1']");
    for( var i = 0; i < cellList.length; i++)
        cellList[i].style.backgroundColor = blockColor;
}

//Calculate the time
function getTime(startTime){
    var hours = 0, minutes = 0; seconds = 0;
    var timeEllapsed= Date.now();
    timeEllapsed -= startTime;
    timeEllapsed = timeEllapsed/1000;
    timeEllapsed = Math.floor(timeEllapsed);

    hours = Math.floor(timeEllapsed / 3600);
    minutes = Math.floor((timeEllapsed % 3600) / 60);
    seconds = Math.floor(timeEllapsed % 60);

    document.getElementById("timer").textContent = "Time: " + hours + ":" + minutes + ":" + seconds;
}

function countDown(){
    countDownTime--;
    if(countDownTime == 0)  //user ran out of time
        timeUp();

    minutes = Math.floor((countDownTime % 3600) / 60);
    seconds = Math.floor(countDownTime % 60);

    document.getElementById("timer").textContent = "Time: " + minutes + ":" + seconds;
}

function numElemInGrid(){

}

function numOfTurns(){

}

function checkGameProgress(){
    console.log("Checking Game");
    if(numElements === numElemsClicked){
        if(playMode == "normalMode"){
            for( var gridIndex = 0; gridIndex < gridSize*gridSize; gridIndex++ ){
                if(currentLevel[gridIndex] != completedLevel[gridIndex]){
                    numErrors++;
                    console.log("Number of errors "+numErrors);
                    return;
                }
            }
            document.getElementById("progress").textContent = "Level completed!";
            document.getElementById("progress").style.color = "green";
            document.getElementById("progress").style.display = "block";

            gameComplete();
        }
        else if (playMode == "arcadeMode" || playMode == "timeAttackMode"){
            for( var gridIndex = 0; gridIndex < gridSize*gridSize; gridIndex++ ){
                if(currentLevel[gridIndex] != completedLevel[gridIndex]){
                    numErrors++;
                    return;
                }
            }

            if(playMode == "arcadeMode")
                clearInterval(startInterval);
            else if (playMode == "timeAttackMode"){
                clearInterval(countDownInterval);
                countDownTime = 300 + (levelIndex * 60); //give player an extra minute to complete the next level
            }

            if(levelIndex == levelList.length){
                document.getElementById("progress").textContent = "Level completed!";
                document.getElementById("progress").style.color = "green";
                document.getElementById("progress").style.display = "block";

                gameComplete();
            }
            else{
                document.getElementById("progress").textContent = "Level completed!";
                document.getElementById("progress").style.color = "green";
                document.getElementById("progress").style.display = "block";

                var scoreH = document.createElement("h3");
                scoreH.setAttribute("id","userScore");
                document.getElementById("centerGridDiv").appendChild(scoreH);
                scoreH.textContent = "Score: " + getScore();


                console.log("A win");
                numTurns = 0;
                numElements = 0;
                numElemsClicked = 0;
                completedLevel = [];
                currentLevel = [];
                document.getElementById("continuePlayingDiv").style.display = "block";
            }
        }
    }
    else{
        document.getElementById("progress").textContent = "Game error";
        document.getElementById("progress").style.color = 'red';
        document.getElementById("progress").style.display = "block";

    }
    numErrors++;
    console.log("Number of errors "+numErrors);

}

function gameComplete(){
    console.log("WON");

    var gameWonDiv = document.createElement("div");
    gameWonDiv.setAttribute("id","gameWonDiv");
    gameWonDiv.textContent = "Game Complete!";

    var gameWonAnchor = document.createElement("a");
    gameWonAnchor.setAttribute("href", "../php/index.php");

    var gameWonBtn = document.createElement("button");
    gameWonBtn.textContent = "Play Again";

    gameWonAnchor.innerHTML = "<br>";
    gameWonAnchor.appendChild(gameWonBtn);
    gameWonDiv.appendChild(gameWonAnchor);

    var theCenterDiv = document.getElementById("centerGridDiv");
    while (theCenterDiv.firstChild) {
        theCenterDiv.removeChild(theCenterDiv.firstChild);
    }

    document.getElementById("asideLeft").style.display = "none";
    document.getElementById("gridSettings").style.display = "none";
    theCenterDiv.appendChild(gameWonDiv);
}

//User could not complete game in time
function timeUp(){
    var gameWonDiv = document.createElement("div");
    gameWonDiv.setAttribute("id","gameWonDiv");
    gameWonDiv.textContent = "Time's up";

    var gameWonAnchor = document.createElement("a");
    gameWonAnchor.setAttribute("href", "../php/index.php");

    var gameWonBtn = document.createElement("button");
    gameWonBtn.textContent = "Play Again";

    gameWonAnchor.innerHTML = "<br>";
    gameWonAnchor.appendChild(gameWonBtn);
    gameWonDiv.appendChild(gameWonAnchor);

    var theCenterDiv = document.getElementById("centerGridDiv");
    while (theCenterDiv.firstChild) {
        theCenterDiv.removeChild(theCenterDiv.firstChild);
    }

    document.getElementById("asideLeft").style.display = "none";
    document.getElementById("gridSettings").style.display = "none";
    theCenterDiv.appendChild(gameWonDiv);
}

function gameError(){

}

//give player a best/worst move hint but with a penalty of 5 points
function hint(suggest_choice){
    var cellHint = Math.floor((Math.random() * (gridSize*gridSize)));   //choose cell to give hint

    if(suggest_choice == 1){    //make cell text ✓
        while(completedLevel[cellHint] != 1)
            cellHint = Math.floor((Math.random() * (gridSize*gridSize)));
        console.log("Cell Hint: "+cellHint);
            //document.getElementById("cell"+cellHint).style.backgroundColor = blockColor;
        document.getElementById("cell"+cellHint).textContent = "✓";
        document.getElementById("cell"+cellHint).style.color = "rgb(153,0,76";
        numErrors+=5;
    }
    else if(suggest_choice == 2){   //make cell text x
        while(completedLevel[cellHint] != 0)
        cellHint = Math.floor((Math.random() * (gridSize*gridSize)));
        document.getElementById("cell"+cellHint).textContent = "x";
        document.getElementById("cell"+cellHint).style.color = "rgb(153,0,76";
        numErrors+=5;
    }
}

function getScore(){
    score = ((Math.max((numElements - numErrors),0))/numElements)*100; 
    return score;
}

function createRandomLevel(){
    alert("random");
}
//After image has been uploaded and converted into a level, play game
function playUploadedImage(img_level){
    for( var imgL = 0; imgL < (gridSize*gridSize); arcL++){
        if(img_level.charAt(imgL) == 1)
            numElements++;
    }

    for( var imgIndex = 0; imgIndex < gridSize*gridSize; imgIndex++)
        completedLevel[imgIndex] = img_level.charAt(imgIndex);

    createTable(gridSize);
    displayGridInfo(img_level);
    document.getElementById("asideLeft").style.display = "block";
    document.getElementById("gridSettings").style.display = "block";
}

function uploadImage(){
    document.getElementById("centerGridDiv").removeChild(document.getElementById("normModDiv"));
    var the_img_level = "";
    var uploadForm = document.createElement("form");
    uploadForm.setAttribute("action","../php/uploadfile.php");
    uploadForm.setAttribute("method","post");
    uploadForm.setAttribute("enctype","multipart/form-data");
    uploadForm.setAttribute("id","imageUploadForm");
    uploadForm.setAttribute("name",gridSize); //name will take size of grid to be used with post

    var formInfo = document.createElement("p");
    formInfo.textContent = "Select an image to upload:";

    var form_ul = document.createElement("ul");

    var form_li1 = document.createElement("li");

    var input1 = document.createElement("input");
    input1.setAttribute("type","file");
    input1.setAttribute("name","fileup");
    input1.setAttribute("id","fileup");
    form_li1.appendChild(input1);

    var form_li2 = document.createElement("li");

    var input2 = document.createElement("input");
    input2.setAttribute("type","submit");
    input2.setAttribute("value","Upload image");
    input2.setAttribute("name","submit");
    form_li2.appendChild(input2);

    form_ul.appendChild(form_li1);
    form_ul.appendChild(form_li2);

    uploadForm.appendChild(formInfo);
    uploadForm.appendChild(form_ul);

    document.getElementById("centerGridDiv").appendChild(uploadForm);

    $(document).ready(function (e) {
        $('#imageUploadForm').on('submit',(function(e) {
            e.preventDefault();
            var formData = new FormData(this);
    
            $.ajax({
                type:'POST',
                url: $(this).attr("action"),
                data:formData,
                cache:false,
                contentType: false,
                processData: false,
                success:function(data){
                    console.log("First hi"+data);
                    var xmlhttpImgToLevel = new XMLHttpRequest();
                    xmlhttpImgToLevel.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                            the_img_level = this.responseText;
                            console.log(the_img_level);
                            startImgGame(the_img_level);
                            //playUploadedImage(the_img_level);
                        }       
                    };
                    xmlhttpImgToLevel.open("GET", "../php/image_gray_solution.php?name="+data+"&value="+gridSize, true);
                    xmlhttpImgToLevel.send();
                    console.log("HI"+data);
                },
                error: function(data){
                    console.log("ERROR"+data);
                }
            });
        }));
    
        $("#fileup").on("submit", function() {
            $("#imageUploadForm").submit();
        });
    });
}

function startImgGame(image_level){
    console.log("THE LEVEL: "+ image_level);
    console.log("LEVEL LENGTH: "+image_level.length);
    console.log("Image to level play");
    //document.getElementById("centerGridDiv").removeChild(document.getElementById("normModDiv"));
    document.getElementById("centerGridDiv").removeChild(document.getElementById("imageUploadForm"));

    for( var imgl = 0; imgl < (gridSize*gridSize); imgl++){
        if(image_level.charAt(imgl) == 1)
            numElements++;
    }

    for( var imgli = 0; imgli < gridSize*gridSize; imgli++)
        completedLevel[imgli] = image_level.charAt(imgli);

    createTable(gridSize);
    displayGridInfo(image_level);
    document.getElementById("asideLeft").style.display = "block";
    document.getElementById("gridSettings").style.display = "block";
}

function userModeChoice(event_target_id){
    playMode = event_target_id;
    basicSetup();
}

//Helper function for basicSetup() to determine which mode button was pressed
//Calls desired mode function.
function selectMode(){
    console.log("in selectmode");
    // basicSetup();
    if(playMode === "normalMode"){
        //Hide mode buttons
        setupNormalMode();
    }
    else if(playMode === "arcadeMode"){
        //Hide mode buttons
        arcadeMode();
    }
    else if(playMode === "timeAttackMode"){
        //Hide mode buttons
        timeAttackMode();
    }
}

//User chose arcade mode
function arcadeMode(){
    console.log("in arcademode");

    loadLevels();
    document.getElementById("asideLeft").style.display = "block";
    document.getElementById("gridSettings").style.display = "block";

}

//User chose time attack mode
function timeAttackMode(){
    console.log('in timeattackmode');

    loadLevels();
    document.getElementById("asideLeft").style.display = "block";
    document.getElementById("gridSettings").style.display = "block";

}
