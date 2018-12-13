<?php
    // CSci 130 - Web Programming - Lab Week 11
    
    // TO DO...
    // Retrieve the filename  AND the size of the matrix from the client with a POST
    
    // $size_matrix=50;
    // Upload the file
    // see files given on blackboard
    if (isset($_GET["value"]) && isset($_GET["name"])) {
        $size_matrix= $_GET["value"];
        $source_file = $_SERVER['DOCUMENT_ROOT']."/picross-project/php/".substr($_GET["name"],7);
        // Read the image file
        // http://php.net/manual/en/function.imagecreatefromjpeg.php
        // if(pathinfo($source_file,PATHINFO_EXTENSION == "jpeg")){
        //     $im = imagecreatefromjpeg($source_file);
        // }
        // if(pathinfo($source_file,PATHINFO_EXTENSION == "png")){
        //     echo "it is png\n";
        //     $im = imagecreatefrompng($source_file);
        // }
        $im = imagecreatefrompng($source_file);
        $imgw = imagesx($im);
        $imgh = imagesy($im);
        
        $size_cellw=floor($imgw/$size_matrix);
        $size_cellh=floor($imgh/$size_matrix);
        
        $map = [];
        for ($i=0; $i<$imgw; $i++) {
            $map[$i] = [];
            for ($j=0; $j<$imgh; $j++) {
                // get the rgb value for current pixel
                $rgb = ImageColorAt($im,$i,$j);
                // extract each value for R, G, B (RED, GREEN, BLUE)
                $rr = ($rgb >> 16) & 0xFF;
                $gg = ($rgb >> 8) & 0xFF;
                $bb = $rgb & 0xFF;
                // get the Value from the RGB value
                $g = round(($rr + $gg + $bb) / 3);
                // Grayscale values have r=g=b=g (just the average of the 3 channels)
                $val = imagecolorallocate($im, $g, $g, $g);
                $map[$i][$j]=floor($g);
                // set the gray value
                imagesetpixel($im, $i, $j, $val);
            }
        }
        
        // Part 1: Create a matrix of size n x n that contains in each cell the average of the values in map of the corresponding area in the image
        $map_resize = [];
        for ($i=0;$i<$size_matrix;$i++) {
            $map_resize[$i] = [];
            for ($j=0;$j<$size_matrix;$j++) {
                $s=0;
                for ($i1=0;$i1<$size_cellw;$i1++)
                    for ($j1=0;$j1<$size_cellh;$j1++) {
                        $s=$s+$map[$i*$size_cellw+$i1][$j*$size_cellh+$j1];
                    }
                $s=$s/($size_cellh*$size_cellw);
                $map_resize[$i][$j]=$s;
            }
        }
        // Part 2: Consider a global threshold to transform the matrix with gray values into binary values
        $map_binary = [];
        for ($i=0;$i<$size_matrix;$i++) {
            $map_binary[$i] = [];
            for ($j=0;$j<$size_matrix;$j++) {
                if ($map_resize[$i][$j]<128)
                    $map_binary[$i][$j]=1;
                else
                    $map_binary[$i][$j]=0;
            }
        }
        
        //convert the $map_binary into a string to use our createTable function
        $img_level = "";
        for ($i=0;$i<$size_matrix;$i++){
            for ($j=0;$j<$size_matrix;$j++){
                $img_level = $img_level.$map_binary[$j][$i];
            }
        }
        echo $img_level;
    }
    
    // Use AJAX to retrieve the content of the matrix that you need to display in your table
    // echo 'JSON string containing the matrix representing the image'
    
    // Display the image:
    // http://php.net/manual/en/function.imagejpeg.php
    //header('Content-type: image/jpeg');
    //imagejpeg($im);
    ?>
