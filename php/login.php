<?php include 'server.php';

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
    // output data of each row
    while($row = $result->fetch_assoc()) {
        if($row["username"] === $username && $row["password"] === $password){
            echo "Access granted";
        }
        else{
            echo "Wrong Username and password";
            break;
        }
        //echo "id: " . $row["id"]. " - Name: " . $row["firstname"]. " " . $row["lastname"]. "<br>";
    }
} else {
    echo "No account found";
}

?>