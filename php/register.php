<?php include 'server.php';

//checks to see if array[user] is set, if so retrieve and decode
if(isset($_POST['user'])){
    $user = $_POST['user'];
    $user = json_decode($user);
}

//parse the object and stores into appropriate variable
$email = $user[0]->email;
$username = $user[0]->username;
$password1 = $user[0]->password1;
$password2 = $user[0]->password2;

echo json_encode($email);

echo "Prepared statements \n";

// Create connection
$conn = new mysqli($serverName, $admin, $serverPassword, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

// prepares an SQL statement template and binds parameters to variables
$stmt = $conn->prepare("INSERT INTO User (username, email, password) VALUES (?, ?, ?)");
if ($stmt==FALSE) {
	echo "There is a problem with prepare <br>";
	echo $conn->error; // Need to connect/reconnect before the prepare call otherwise it doesnt work
	// see: https://dev.mysql.com/doc/refman/5.7/en/commands-out-of-sync.html
}

// sss = 3 strings
// i - integer
// d - double
// s - string
// b - BLOB: a binary large object that can hold a variable amount of data

// set parameters and execute
$stmt->bind_param("sss", $username, $email, $password1);
$stmt->execute();


?>