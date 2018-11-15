//when window is loaded call setup
window.onload = setup;

//Didn't wanna use globals but can't really think of an easier way
var blockColor = "black";
var gridColor = "white";
var numTurns = 0;       //current number of turns
var numElements = 0;    //number of elements placed on grid
var numElemsClicked = 0;      //incremented when user selected cell, decremented when user unselects cell
var arcadeLevel = 0;    //current arcade level
var gridSize = 0;
var playMode = null;
var completedLevel = [];    //reference to the completed level
var currentLevel = [];      //what the current level looks like as user plays (selects cells)

//Setup even listeners, create necessary elements and hide certain elements
//not currently needed
function setup(){
    //hide asides in index.html until user chooses grid size
    document.getElementById("asideLeft").style.display = "none";
    document.getElementById("gridSettings").style.display = "none";

    //create div to hold the timer
    var timer = document.createElement("h3");
    timer.setAttribute("id","timer");
    timer.textContent = "Timer:";
    document.getElementById("asideLeft").appendChild(timer);

    //onclick event for all three mode buttons
    document.getElementById("normalMode").addEventListener("click", function(event){userModeChoice(event.target.id);})
    document.getElementById("arcadeMode").addEventListener("click", function(event){userModeChoice(event.target.id);})
    document.getElementById("timeAttackMode").addEventListener("click", function(event){userModeChoice(event.target.id);})


    //Button to change size of grid
    //Created at first but hidden until player chooses grid option
    // var changeGridDiv = document.createElement("div");
    // changeGridDiv.setAttribute("id", "changeGridDiv");
    // var changeGridBtn = document.createElement("button");
    // changeGridBtn.setAttribute("id", "changeGridBtn");
    // changeGridBtn.addEventListener("click", changeGridSize);
    // changeGridDiv.appendChild(changeGridBtn);
    // changeGridDiv.style.display = "none"
    // document.getElementById("gridSettings").appendChild(changeGridDiv);

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

    //==========
    // var isModeThere = document.getElementById("modeDiv");
    // if(isModeThere !== null)
    //     isModeThere.style.display = "none";
    // else
    //     document.getElementById("levelOptionDiv").style.display = "none";
}

//create an n x n table (the grid)
function createTable(n){
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

    table.style.margin = "auto";

    //reset color for grid/blocks
    $("#gw").prop("checked",true);
    $("#bb").prop("checked",true);
    changeGridColor("white");
    changeBlockColor("black");

    //start time
    startTime();
}

//#### NEEDS change color when reclicked (bool)
//when a cell is clicked
function cellClicked(cell){
    cellId = cell.id;
    var thisCell = document.getElementById(cellId);
    cellName = thisCell.getAttribute("name");

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

    //upadate cell value for current level prior to check game completion
    if(currentLevel[cellName] === 1){
        currentLevel[cellName] = 0;
    }
    else if(currentLevel[cellName] === 0){
        currentLevel[cellName] = 1;
    }

    console.log("numElemsClicked: " + numElemsClicked);
    if(numElemsClicked === numElements) //for efficiency
        checkGameProgress();
    numTurns++;
    document.getElementById("numTurns").textContent = "Turns: " + numTurns;

}

//User selects grid size option 7x7. Display asides and call createTable()
function clickedBtn7(){
    console.log("in clicked 7");
    // createTable(7); //create 7 x 7 table

    //Hide the grid option header
    document.getElementById("gridOptionDiv").style.display = "none";

    gridSize = 7;

    //current level initilization
    for( var currLevelIndex = 0; currLevelIndex < gridSize*gridSize; currLevelIndex++)
        currentLevel[currLevelIndex] = 0;

    console.log("Current level: " + currentLevel);

    selectMode();

    // //Set appropriate text and display button
    // var changeGridBtn = document.getElementById("changeGridBtn");
    // changeGridBtn.setAttribute("name", "size7");
    // changeGridBtn.textContent = "Try 13x13";
    // var changeGridDiv = document.getElementById("changeGridDiv");
    // changeGridDiv.style.display = "block";
}

//User selects grid size option 13x13. Display asides and call createTable()
function clickedBtn13(){
    console.log("in clicked 13");
    // document.getElementById("asideLeft").style.display = "block";
    // document.getElementById("gridSettings").style.display = "block";

    // createTable(13); //create 13 x 13 table

    //Hide the grid option header
    document.getElementById("gridOptionDiv").style.display = "none";

    gridSize = 13;

    //current level initilization
    for( var currLevelIndex = 0; currLevelIndex < gridSize*gridSize; currLevelIndex++)
        currentLevel[currLevelIndex] = 0;

    console.log("Current level: " + currentLevel);

    selectMode();

    // //Set appropriate text and display button
    // var changeGridBtn = document.getElementById("changeGridBtn");
    // changeGridBtn.setAttribute("name", "size13");
    // changeGridBtn.textContent = "Try 7x7";
    // var changeGridDiv = document.getElementById("changeGridDiv");
    // changeGridDiv.style.display = "block";
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


//Helper function to get time
function startTime(){
    var startTime = Date.now();
    var aVar = setInterval(function(){getTime(startTime);}, 1000);
}

function setUpForNormalMode(){
    var normModDiv = document.createElement("div");
    var normModH3 = document.createElement("h3");
    normModH3.textContent = "Select Option";
    var randomLevelBtn = document.createElement("button");
    randomLevelBtn.textContent = "Random level";
    randomLevelBtn.addEventListener("click", function(){randomLevels()});

    var uploadImgBtn = document.createElement("button");
    uploadImgBtn.textContent = "Upload and image";
    uploadImgBtn.addEventListener("click", function(){normalMode(2);});

    normModDiv.appendChild(normModH3);
    normModDiv.appendChild(randomLevelBtn);
    normModDiv.appendChild(uploadImgBtn);
    //console.log(document.getElementById("centerGridDiv").children);
    document.getElementById("centerGridDiv").appendChild(normModDiv);
}

function randomLevels(){
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
    // var level = arc_obj.game[arcadeLevel].level;
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


//  /!\IMPORTANT/!\
// Based on what grid size the user chooses, load appropriate set of levels b/c when displaying 
// grid info, can get wrong info displaying (e.g. 13x13 won't show remaining table header info past 7)
//0000000011011010010011000001010001000101000001000
function loadArcadeLevels(){
    var gameObj;    //object received from http request
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            gameObj = JSON.parse(this.responseText);
            console.log(levelObj);
        }
    };
    xmlhttp.open("GET", "../php/nonogram.php", true);
    xmlhttp.send();

    //without reading json file
    // console.log("in loadarcadelevels");
    // var jsonObj = '{"game":[{"levelID": "1","size": 7, "level": "0000000011011010010011000001010001000101000001000"},{},{}]}';
    // var arcObj = JSON.parse(jsonObj);
    // // var level = arc_obj.game[arcadeLevel].level;

    // var arcTempLevel = arcObj.game[arcadeLevel].level;

    //#####
    // for( var arcIndex = 0; arcIndex < gridSize*gridSize; arcIndex++)  //rli = rand level index
    // completedLevel[arcIndex] = randLevel.charAt(arcIndex);

    // console.log("Current level: " + completedLevel);

    // displayGridInfo(arcObj.game[arcadeLevel].level);    //Change this pass completedLevel instead
    // displayGridInfo(arcObj);
}

//========================================
//=        End of Helper Functions       =
//========================================


// //Change size of grid to 7x7 or 13x13
// function changeGridSize(){
//     var the_btn = document.getElementById("changeGridBtn");

//     if(the_btn.getAttribute("name") === "size7"){   //current value of name attribute is size7
//         //var doesTable13Exist = document.getElementById("table13");
//         deleteTable("table7");
//         createTable(13);    //create 13 x 13
    
//         //Set appropriate values for button
//         the_btn.setAttribute("name", "size13"); //reset name attribute
//         the_btn.textContent = "Try 7x7";

//     }
//     else if(the_btn.getAttribute("name") === "size13"){ //current value of name attribute is size13
//         // var doesTable7Exist = document.getElementById("table7");
//         deleteTable("table13");
//         createTable(7);
    
//         //Set appropriate values for button
//         the_btn.setAttribute("name", "size7");  //reset name attribute
//         the_btn.textContent = "Try 13x13";
//     }
// }

//User selects grid color radio button
function changeGridColor(grid_color){
    gridColor = grid_color;
    var gridList = document.querySelectorAll(".cell[value='0']");
    for( var i = 0; i < gridList.length; i++)
        gridList[i].style.backgroundColor = gridColor;
    $( ".aTable" ).css( "background-color", grid_color );

}

//make globar var initially set to black(the default color when cell is clicked)
//then do onclick to set the background color to the appropriate radio button color
//the call the function to handle the backend part of it.

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

    document.getElementById("timer").textContent = "Time: " + hours + ":" + minutes + ":" + seconds;;
}

function numElemInGrid(){

}

function numOfTurns(){

}
function checkGameProgress(){
    console.log("Checking Game");
    var gameWon = true;
    for( var gridIndex = 0; gridIndex < gridSize*gridSize; gridIndex++){
        if(currentLevel[gridIndex] != completedLevel[gridIndex])
            gameWon = false;
    }
    if(gameWon)
        gameComplete();
}

function gameComplete(){
    console.log("You Won!")
}

function gameError(){

}

function suggestMoves(){
    /*
    here you can do something like getting a randsom number from 0..(n^2)[n being the size of the grid]
    and while the n == 1, get a new n then when you find an n == 0 you mark that cell with an x
    */
}

function createRandomLevel(){
    alert("random");
}

function uploadImage(){
    alert("upload");
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
        setUpForNormalMode();
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

// //User chose normal mode
// function normalMode(normal_mode_option){
//     if(normal_mode_option == 1){
//         randomLevels();
//     }
//     else if(normal_mode_option == 2){
//         console.log("hi");
//     }
// }

//User chose arcade mode
function arcadeMode(){
    console.log("in arcademode");
    // if(gridSize == 7)
    //     createTable(7);
    // else if(gridSize == 13){
    //     createTable(13);
    // }
    loadArcadeLevels();
    document.getElementById("asideLeft").style.display = "block";
    document.getElementById("gridSettings").style.display = "block";

}

//User chose time attack mode
function timeAttackMode(){
}