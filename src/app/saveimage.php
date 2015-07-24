<?php

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_FILES)) {

	print_r($_POST);

	$image = $_POST['image'];
	$nameImage = $_POST['nameImage'];
	$nameImagesFolder = $_POST['nameFolder'];

	if (isset($image) && !empty($image)) {
	    
		if (!is_dir('templates/'.$nameImagesFolder)) {
			mkdir('templates/'.$nameImagesFolder);
		}

	    $image = explode('base64', $image);

	    file_put_contents('templates/'.$nameImagesFolder.'/'.$nameImage, base64_decode($image[1]));

	    return true;

	}
}

?>