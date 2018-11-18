<?php include 'server.php';

session_start();
//make this cleaner
if(isset($_POST['username'])){
    $username =  htmlspecialchars($_POST['username']);
    $password = $_POST['password'];
    echo "Username is " . $username. "\n";
    echo "The password is " . $password. "\n";
}
else{
    echo "Form not submitted!\n";
}


//open a connection to Sql server
$conn = new mysqli($serverName, $admin, $serverPassword, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$sql = "SELECT username, password FROM User";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // fetches data of each row from the table User
    while($row = $result->fetch_assoc()) {
        //if username/password matches with user input, give access
        if($row["username"] === $username && $row["password"] === md5($password)){
            echo "Access granted";

            $_SESSION['username'] = $username;
            $_SESSION['success'] = "You are now logged in";
            //header('location: ../HTML/index.html');
        }
        else{
            // echo $row["password"] . " " . md5($password) . "\n";
            echo "Wrong Username and password" . "\n";
        }
    }
} else {
    echo "No account found";
}

?>