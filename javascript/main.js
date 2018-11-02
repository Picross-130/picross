//when window is loaded call setup
window.onload = setup;

//Didn't wanna use globals but can't really think of an easier way
var blockColor = "black";
var gridColor = "white";

//Setup even listeners, create necessary elements and hide certain elements
//not currently needed
function setup(){
    //hide asides in index.html until user chooses grid size
    document.getElementById("asideLeft").style.display = "none";
    document.getElementById("gridSettings").style.display = "none";

    //create div to hold the timer
    var timer = document.createElement("div");
    timer.setAttribute("id","timer");
    timer.textContent = "Timer:";
    document.getElementById("asideLeft").appendChild(timer);

    //onclick event for all three mode buttons
    document.getElementById("modeDiv").addEventListener("click", function(event){selectMode(event.target.id);})

    //Button to change size of grid
    //Created at first but hidden until player chooses grid option
    var changeGridDiv = document.createElement("div");
    changeGridDiv.setAttribute("id", "changeGridDiv");
    var changeGridBtn = document.createElement("button");
    changeGridBtn.setAttribute("id", "changeGridBtn");
    changeGridBtn.addEventListener("click", changeGridSize);
    changeGridDiv.appendChild(changeGridBtn);
    changeGridDiv.style.display = "none"
    document.getElementById("gridSettings").appendChild(changeGridDiv);
    //document.getElementById("gameTitle").appendChild(changeGridDiv);

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
    /*Div to hold the grid option title and 7x7
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

    //Hide play button
    document.getElementById("modeDiv").style.display = "none";

}

//create an n x n table (the grid)
function createTable(n){
    //things related to the table
    var nameOfTable = "table" + n;  //will hold id of table
    var table = document.createElement("table");            
    table.setAttribute("id",nameOfTable);
    table.setAttribute("class", "aTable");

    var tdCount1 = 0;   //to keep cound of how many cells

    //create tds (cells) of table
    for(var i = 0; i < n; i++){
        var tdCount2 = 0;   //to keep count of how many cells
        var aTR = document.createElement("tr");

        for(var j = 0; j < n; j++){
            var aTD = document.createElement("td")  //create a cell
            var cell_id = "cell";                   //id value for cell
            aTD.setAttribute("id","cell"+ (tdCount1+tdCount2));
            aTD.setAttribute("class","cell");
            aTD.setAttribute("value","0");  //to toggle between clicked/unclicked
            aTD.innerHTML = aTD.getAttribute("id");
            //add onclick event for each cell
            aTD.addEventListener("click", function(){cellClicked(this.id);}, false);
            aTR.appendChild(aTD);   //attach td to tr
            aTD.style.border = "1px solid black";
            table.style.borderCollapse="collapse";
            tdCount1++;
        }
        table.appendChild(aTR);     //attach tr to table
        tdCount2++;
    }

    //Create id for table and append to body
    var tableDivName = "tableDiv" + n;
    var tableDiv = document.createElement("div");
    tableDiv.setAttribute("id", tableDivName);
    tableDiv.appendChild(table);

    document.getElementById("centerGridDiv").appendChild(tableDiv);
    //document.body.appendChild(tableDiv);

    table.style.margin = "auto";

    startTime();
}


//#### NEEDS change color when reclicked (bool)
//when a cell is clicked
function cellClicked(cellId){
    if(document.getElementById(cellId).getAttribute("value") === "0"){
        $("#"+cellId).attr("value", "1");
        $("#"+cellId).css("background-color", blockColor);
    }
    else{
        $("#"+cellId).attr("value", "0");
        $("#"+cellId).css("background-color", gridColor);
    }


}

//User selects grid size option 7x7. Display asides and call createTable()
function clickedBtn7(){
    document.getElementById("asideLeft").style.display = "block";
    document.getElementById("gridSettings").style.display = "block";
    createTable(7); //create 7 x 7 table

    //Hide the grid option header
    document.getElementById("gridOptionDiv").style.display = "none";

    //Set appropriate text and display button
    var changeGridBtn = document.getElementById("changeGridBtn");
    changeGridBtn.setAttribute("name", "size7");
    changeGridBtn.textContent = "Try 13x13";
    var changeGridDiv = document.getElementById("changeGridDiv");
    changeGridDiv.style.display = "block";
}

//User selects grid size option 13x13. Display asides and call createTable()
function clickedBtn13(){
    document.getElementById("asideLeft").style.display = "block";
    document.getElementById("gridSettings").style.display = "block";

    createTable(13); //create 13 x 13 table

    //Hide the grid option header
    document.getElementById("gridOptionDiv").style.display = "none";

    //Set appropriate text and display button
    var changeGridBtn = document.getElementById("changeGridBtn");
    changeGridBtn.setAttribute("name", "size13");
    changeGridBtn.textContent = "Try 7x7";
    var changeGridDiv = document.getElementById("changeGridDiv");
    changeGridDiv.style.display = "block";
}

//Helper function to get time
function startTime(){
    var startTime = Date.now();
    var aVar = setInterval(function(){getTime(startTime);}, 1000);
}

//========================================
//=        End of Helper Functions       =
//========================================


//Change size of grid to 7x7 or 13x13
function changeGridSize(){
    var the_btn = document.getElementById("changeGridBtn");

    if(the_btn.getAttribute("name") === "size7"){   //current value of name attribute is size7
        var doesTable13Exist = document.getElementById("table13");

        //if table 13x13 has not yet been created
        if(doesTable13Exist == null){
            document.getElementById("tableDiv7").style.display = "none";  //hide previous table
            createTable(13);    //create 13 x 13
        }
    
        //Set appropriate values for button
        the_btn.setAttribute("name", "size13"); //reset name attribute
        the_btn.textContent = "Try 7x7";

        //hide other table (if any)
        document.getElementById("tableDiv13").style.display = "block"
        document.getElementById("tableDiv7").style.display = "none";

    }
    else if(the_btn.getAttribute("name") === "size13"){ //current value of name attribute is size13
        var doesTable7Exist = document.getElementById("table7");

        //if table 7x7 has not yet been created
        if(doesTable7Exist == null){
            document.getElementById("tableDiv13").style.display = "none";   //hide previous table
            createTable(7);    //create 13 x 13
        }
    
        //Set appropriate values for button
        the_btn.setAttribute("name", "size7");  //reset name attribute
        the_btn.textContent = "Try 13x13";

        //hide other table (if any)
        document.getElementById("tableDiv7").style.display = "block"
        document.getElementById("tableDiv13").style.display = "none";
    }
}

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
function changeBlockColor(block_color){
    blockColor = block_color;
    var cellList = document.querySelectorAll(".cell[value='1']");
    for( var i = 0; i < cellList.length; i++)
        cellList[i].style.backgroundColor = blockColor;
    //document.querySelector(".example").style.backgroundColor = "red";


    //$(.cell).focus(function(){});


    //=======
    // $(".cell").hover(function(){
    //     $(this).css("background-color", block_color);
    //     }, function(){
    //     $(this).css("background-color", rgb(231,234,237));
    // });
    //=======

    // $( ".cell" ).hover(
    //     function() {$( this ).css("background-color", block_color);}
    // )
    // $( ".cell" ).hover(function(){this.});
}

//Calculate the time
function getTime(startTime){
    var hours = 0, minutes = 0; seconds = 0;
    var timeEllapsed= Date.now();
    timeEllapsed -= startTime;
    timeEllapsed = timeEllapsed/1000;

    hours = Math.floor(timeEllapsed / 3600);
    minutes = Math.floor((timeEllapsed % 3600) / 60);
    seconds = Math.floor(timeEllapsed % 60);

    document.getElementById("timer").textContent = "Time: " + hours + ":" + minutes + ":" + seconds;;
}

function numElemInGrid(){

}

function numOfTurns(){

}

function gameComplete(){

}

function gameError(){

}

function suggestMoves(){

}

function createRandomLevel(){

}

function createFromImage(){

}

//Helper function for basicSetup() to determine which mode button was pressed
//Calls desired mode function.
function selectMode(event_target_id){
    if(event_target_id === "normalMode")
        normalMode();
    else if(event_target_id === "arcadeMode")
        arcadeMode();
    else if(event_target_id === "timeAttackMode")
        timeAttackMode();
}

//User chose normal mode
function normalMode(){
    basicSetup();
}

//User chose arcade mode
function arcadeMode(){
    basicSetup();
}

//User chose time attack mode
function timeAttackMode(){
    basicSetup();
}