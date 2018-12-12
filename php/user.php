<?php include 'server.php';

session_start();

if(!empty($_POST["logout"])) {
    //session_unset();
    session_destroy();
    header('Location:index.php');
}


$target_directory = "avatarUploads/"; //folder where images will be stored
$target_file = $target_directory . basename($_FILES["fileUpload"]["name"]); //grabs file from fileup, name is the name of file

$uploadOk = 1;

$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
// Verify if the image file is an actual image or a fake image
if(isset($_POST["upload"])) {
    $check = getimagesize($_FILES['fileUpload']["tmp_name"]);
    if($check !== false) {
        echo " File is an image of type - " . $check["mime"];
        $uploadOk = 1;
    } else {
        echo "<br>File is not an image.<br>";
        $uploadOk = 0;
    }
}


// Verify the file size
if ($_FILES["fileUpload"]["size"] > 500000) {
    echo "<li>The file is too large.</li>";
    $uploadOk = 0;
}
// Verify if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
    echo "<li>The file was not uploaded.</li>";
} else { // upload file
    if (move_uploaded_file($_FILES["fileUpload"]["tmp_name"], $target_file)) {
        // echo "<li>The file ". basename( $_FILES["fileUpload"]["name"]). " has been uploaded.</li>";
        // echo  $target_file . "\n";
        $conn = new mysqli($serverName, $admin, $serverPassword, $dbname);
        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        } 
        
        $stmt = $conn->prepare("UPDATE User SET imagePath=? WHERE username=?");
        if ($stmt==FALSE) {
            echo "There is a problem with prepare <br>";
            echo $conn->error; // Need to connect/reconnect before the prepare call otherwise it doesnt work
        }
        $stmt->bind_param("ss", $target_file, $_SESSION['username']);
        $stmt->execute();

        $_SESSION['image'] = $target_file;
        // echo $_SESSION['imagePath'];
    } 
    else {
        echo "<li>Error uploading your file.</li>";
    }
}

header('Location: index.php');





?>