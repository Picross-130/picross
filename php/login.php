<?php

//make this cleaner
if(isset($_POST['username'])){
    $username =  htmlspecialchars($_POST['username']);
    // $password = $_POST['password'];
}
else{
    echo "Form not submitted!\n";
}

$password = $_POST['password'];
echo "The password is" . $password;

//by default XAMPP uses root for user and '' for password
$serverName = "localhost";
$user = "root";
$password = "";
$dbname = "users";

// creates connection
$conn = new mysqli($serverName, $user, $password, $dbname);

//checks connection
if($conn->connect_error){
    die("Connection failed: ". $conn->connect_error . "\n");
}

// Creation of the database
// $sql = "CREATE DATABASE myDatabase";
// if ($conn->query($sql) === TRUE) {
//     echo "Database created successfully<br>";
// } else {
//     echo "Error creating database: " . $conn->error ."<br>";
// }

$conn->close();

// Create connection
$conn = new mysqli($serverName, $user, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
echo "Connected successfully\n";

$sql = "CREATE TABLE User (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
    username VARCHAR(30) NOT NULL,
    email VARCHAR(50),
    password VARCHAR(30) NOT NULL,
    score INT(11) NULL,
    reg_date TIMESTAMP
    )";

//insert elements into the database
if ($conn->query($sql) === TRUE) {
        echo "Table Person created successfully";
} else {
    echo "Error creating table: " . $conn->error ."\n";
}

// close the connection
$conn->close();


?>