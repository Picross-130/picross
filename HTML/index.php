<?php
    session_start() //command to use sessions
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <!-- <link rel="stylesheet" type="text/css" href="../css/index.css"> -->
    <link rel="stylesheet" type="text/css" href="../css/index.css">

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <link href="https://fonts.googleapis.com/css?family=Acme" rel="stylesheet">

    <title>Nonogram</title>
</head>
<body>
    <header>
        <nav>
            <ul>
                <a href="../HTML/how-to-play.html"><li>How to play</li></a>
                <a href="../HTML/about.html"><li>About</li></a>
                <!-- <a href='#' onclick="launch()" id="loginBtn"><li class="lastItem"> -->
                <?php $message = (isset($_SESSION['username']) ? "Hello " . $_SESSION['username'] . " !" : "Login");?>
                <?php 
                    if(isset($_SESSION['username'])) {
                        echo "<a href='#' onclick='launchUser()' id='loginBtn'><li class='lastItem'>$message</li></a>";
                    }
                    else{
                        echo "<a href='#' onclick='launch()' id='loginBtn'><li class='lastItem'>$message</li></a>";
                    }
                ?>
            </ul>
        </nav>
        <!-- Popup box for login form -->
        <div id="modal">
            <div id="modal-container">
                <form method="POST" action="../php/login.php" id="loginForm"> 
                    <span class="close" onclick="document.getElementById('modal').style.display='none'">&times;</span>
                    <h2>Login</h2>
                    <div id="loginErrors"></div>
                    <input type="text" id="username" name="username" placeholder="Username" required>
                    <input type="password" id="password" name="password" placeholder="Password" required>
                    <!-- <input type="button" onclick="loadToServer()" id="login" value="Login"> -->
                    <input type="submit" name="submit" id="login">
                    <div class="register">
                        <a href="#" onclick="launchRegister()">Register</a> - <a href="#">Forgot Password?</a>
                    </div>
                </form>
            </div>
        </div>
        <!-- Popup box for register form -->
        <div id="register-modal">
            <div id="reg-modal-container">
                <form id="register">
                    <span class="close" onclick="document.getElementById('register-modal').style.display='none'">&times;</span>
                    <h2>Sign Up</h2>
                    <div id="errors"></div>
                    <label>Email</label>
                    <input type="email" id="email" placeholder="Enter an email" required>
                    <label>Username</label>
                    <input type="text" id="regUsername" placeholder="Enter a username" required>
                    <label>Password</label>
                    <input type="password" id="password1" placeholder="Enter a password" required>
                    <label>Re-Enter Password</label>
                    <input type="password" id="password2" placeholder="Re-Enter password" required>
                    <input type="button" onclick="regToServer()" id="signUp" value="Sign Up">
                </form>
            </div>
        </div>
        <!-- Popup box for Logout form -->
        <div id="user-modal">
            <div id="user-container">
                <form method="POST" action="../php/user.php" id="user-form">
                    <span class="close" onclick="document.getElementById('user-modal').style.display='none'">&times;</span>
                    <div id="avatar"></div>
                    <input type="file" name="fileup" id="fileup">
                    <input type="submit" name="upload" id="uploadBtn" value="Upload Image">
                    <input type="submit" name="logout" id="logoutBtn" value="Logout">
                </form>
            </div>
        </div>
    </header>
    <!-- ============================================================================================================================ -->

        <h1 id="gameTitle">NONOGRAM</h1>

        <div id="container">
            <div id="centerGridDiv">
                <div id="modeDiv">
                    <button id="normalMode">Normal Mode</button>
                    <button id="arcadeMode">Arcade Mode</button>
                    <button id="timeAttackMode">Time Attack Mode</button>
                </div>
            </div>

            <aside id="asideLeft">
                <a href="../HTML/index.html"><button id="mainMenuBtn" class="asideLeftBtn">Main Menu</button></a><br>
                <button id="bestMove" class="asideLeftBtn">Best Move</button>
                <button id="worstMove" class="asideLeftBtn">Worst Move</button>
                <button id="giveUp" class="asideLeftBtn">Give up</button><br>
                <button id="done" class="asideLeftBtn">Done</button>
                <h3 id="numTurns">Turns: 0</h3>

            </aside>

            <aside id="gridSettings">
                <h2>Grid color</h2>
                    <form id = "gridColorForm">
                        <input id="gw" class="gridColors" type="radio" name="gridColor" value="white" checked> White<br>
                        <input id="go" class="gridColors" type="radio" name="gridColor" value="orange"> Orange<br>
                        <input id="gl" class="gridColors" type="radio" name="gridColor" value="lime"> Lime<br>
                        <input id="gv" class="gridColors" type="radio" name="gridColor" value="violet"> Violet<br>
                        <input id="gb" class="gridColors" type="radio" name="gridColor" value="blue"> Blue
                    </form>
        
                <h2>Block color</h2>
                    <form id = "blockColorForm">
                        <input id="bb" class="blockColors" type="radio" name="blockColor" value="black" checked> Black<br>
                        <input id="bg" class="blockColors" type="radio" name="blockColor" value="grey"> Grey<br>
                        <input id="ba" class="blockColors" type="radio" name="blockColor" value="aqua"> Aqua<br>
                        <input id="by" class="blockColors" type="radio" name="blockColor" value="yellow"> Yellow<br>
                        <input id="br" class="blockColors" type="radio" name="blockColor" value="red"> Red
                    </form>

                <!-- <h2>Grid Size</h2> -->

            </aside>
        </div>
        <div id="timerContainer">

        </div>
        <footer></footer>
    <script src="../javascript/main.js"></script>
</body>
</html>

<!-- <h2 id="letsPlay">Let's Play!</h2> -->
