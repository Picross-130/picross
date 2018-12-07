<?php
////covert the image to an game level
//@parameter: $imgSize = an array with width and height
function covert_to_level($img){
    $img = convert_to_greyscale($img);

}

function covert_to_grayscale($_img){
    $width = imagesx($_img);
    $height = imagesy($_img);

    for($i = 0; $i < $width; $i++){
        for($j = 0; $j < $height; $j++){
            
        }
    }

    return $_img;
}

/*
For Each Pixel in Image {

   Red = Pixel.Red
   Green = Pixel.Green
   Blue = Pixel.Blue

   Gray = (Red + Green + Blue) / 3

   Pixel.Red = Gray
   Pixel.Green = Gray
   Pixel.Blue = Gray
}
*/

?>