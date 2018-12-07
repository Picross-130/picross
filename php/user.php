<?php 

session_start();

if(!empty($_POST["logout"])) {
    //session_unset();
    session_destroy();
    header('Location:../HTML/index.php');
}

$target_directory = "avatarUploads/"; //folder where images will be stored
$target_file = $target_directory . basename($_FILES["fileup"]["name"]); //grabs file from fileup, name is the name of file

$uploadOk = 1;

$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
// Verify if the image file is an actual image or a fake image
if(isset($_POST["upload"])) {
    $check = getimagesize($_FILES["fileup"]["tmp_name"]);
    if($check !== false) {
        echo "File is an image of type - " . $check["mime"];
        $uploadOk = 1;
    } else {
        echo "<br>File is not an image.<br>";
        $uploadOk = 0;
    }
}








?>