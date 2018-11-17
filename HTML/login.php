<?php

if(isset($_POST['submit'])){
    $username =  htmlspecialchars($_POST['username']);
    $password = $_POST['password'];
}
 echo "Hello" . $username . "!";




?>