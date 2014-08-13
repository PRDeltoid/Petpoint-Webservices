<?php
    if(!isset($_GET)) {
        echo "Get not set";
    } else {
        if(isset($_GET['id'])) {
            echo "You are looking up " . $_GET['id'];
        } else {
            echo "No id entered";
        }
    }
?>
