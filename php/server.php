<?php

//by default XAMPP uses root for user and '' for password
$serverName = "localhost";
$admin = "root";
$serverPassword = "";
$dbname = "users";

// creates connection
$conn = new mysqli($serverName, $admin, $serverPassword, $dbname);

//checks connection
if($conn->connect_error){
    die("Connection failed: ". $conn->connect_error . "\n");
}
echo "Connected successfully\n";

// Creation of the database
// $sql = "CREATE DATABASE users";
// if ($conn->query($sql) === TRUE) {
//     echo "Database created successfully<br>";
// } else {
//     echo "Error creating database: " . $conn->error ."<br>";
// }

// $conn->close();

$sql = "CREATE TABLE User (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
    username VARCHAR(30) NOT NULL,
    email VARCHAR(50),
    password VARCHAR(50) NOT NULL,
    score INT(11) NULL,
    reg_date TIMESTAMP
    )";
    
if ($conn->query($sql) === TRUE) {
        echo "Table User created successfully";
} else {
    echo "Error creating table: " . $conn->error ."\n";
}

// close the connection
$conn->close();


?>