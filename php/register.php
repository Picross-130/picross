<?php include_once 'server.php';

//checks to see if array[user] is set, if so retrieve and decode
if(isset($_POST['user'])){
    $user = $_POST['user'];
    $user = json_decode($user);
}

//stores into appropriate variable
$email = $user[0]->email;
$username = $user[0]->username;
$password1 = $user[0]->password1;
$password2 = $user[0]->password2;

$errors = array();

if(empty($email)){
    array_push($errors, "Email is required");
}
if(empty($username)){
    array_push($errors, "Username is required");
}
if(empty($password1)){
    array_push($errors, "Password is required");
}
if(empty($password2)){
    array_push($errors, "The two passwords don't match");
}

if(count($errors) == 0){
    // Create connection
    $conn = new mysqli($serverName, $admin, $serverPassword, $dbname);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } 
    echo "Preparing statements \n";
    // prepares an SQL statement template and binds parameters to variables
    $stmt = $conn->prepare("INSERT INTO User (username, email, password) VALUES (?, ?, ?)");
    if ($stmt==FALSE) {
        echo "There is a problem with prepare <br>";
        echo $conn->error; // Need to connect/reconnect before the prepare call otherwise it doesnt work
       
    }
    
    // sss = 3 strings
    // i - integer
    // d - double
    // s - string
    // b - BLOB: a binary large object that can hold a variable amount of data

    //encrypts password before storing into DB
    $password1 = md5($password1);
    // set parameters and execute
    $stmt->bind_param("sss", $username, $email, $password1);
    $stmt->execute();
    echo "Account Created \n";

}
else{
    foreach($errors as $error)
        echo $error . "\n";
}

// echo json_encode($email);
$conn->close();

?>