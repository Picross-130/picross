<?php
    $gameLevels = file_get_contents('../json/levels.json');
    echo json_encode($gameLevels);
?>