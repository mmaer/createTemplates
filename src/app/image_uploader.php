<?php

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_FILES)) {

    $images = $_FILES["images"];
    $allowed_files = array("jpg", "png");
    $images_dir = "images/";
    $errors = 0;

    if (!empty($images)) {

        foreach ($images["name"] as $file => $name) {

            if ($images["error"][$file] > 0 || !in_array( pathinfo($name, PATHINFO_EXTENSION), $allowed_files)) {
                $errors++;
                continue;
            } else {
                if(!move_uploaded_file($images["tmp_name"][$file], $images_dir.$name) ) {
                    $errors++;
                }
            }
        }
    }

    if($errors > 0) {
        echo json_encode(array(
            "error"   => true,
            "message" => "Wystąpił błąd!"
        ));
    } else {
        echo json_encode(array(
            "error"   => false,
            "message" => "Wysyłanie zakończone powodzeniem!"
        ));
    }

}

?>

