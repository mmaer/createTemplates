<?php

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_FILES)) {

print_r($_POST['image']);

$image = $_POST['image'];

if (isset($image) && !empty($image)) {
    
    $image = explode('base64', $image);

    file_put_contents('img/aa.jpg', base64_decode($image[1]));

}


}



?>