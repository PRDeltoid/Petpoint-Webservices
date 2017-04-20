<?php
    define('WP_USE_THEMES', false);
    require('../../../wp-blog-header.php');
    if(!isset($_GET)) {
        echo "Get not set";
    } else {
        if(isset($_GET['id']) && is_numeric($_GET['id'])) {
            header('Content-type: application/json');
            $xml_string = file_get_contents("http://ws.petango.com/webservices/wsadoption.asmx/AdoptableDetails?authkey=" . get_option('pp_auth_key') . "&animalID=" . $_GET['id']);
            $xml = simplexml_load_string($xml_string);
            $json = json_encode($xml);
            echo $json;
        }
    }
?>
