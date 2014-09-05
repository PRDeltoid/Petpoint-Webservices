<?php
    define('WP_USE_THEMES', false);
    require('../../../wp-blog-header.php');
    if(!isset($_GET)) {
        echo "Get not set";
    } else {
        if(isset($_GET['type'])) {
            $type = $_GET['type'];
            if($_GET['type']=="dog") {
                header('Content-type: application/json');
                $xml_string = file_get_contents('http://www.petango.com/webservices/wsadoption.asmx/AdoptableSearch?authkey=' . get_option("pp_auth_key") . '&speciesID=1&sex=A&ageGroup=ALL&location=Dog%20Runs&site=Adoptions&onHold=no&orderBy=ID&primaryBreed=All&secondaryBreed=All&specialNeeds=A&noDogs=A&noCats=A&noKids=A&stageid=0');
                $xml = simplexml_load_string($xml_string);
                $json = json_encode($xml);
                echo $json;
            } else if($_GET['type']=="cat") {
                header('Content-type: application/json');
                $xml_string = file_get_contents('http://www.petango.com/webservices/wsadoption.asmx/AdoptableSearch?authkey=' . get_option("pp_auth_key") . '&speciesID=2&sex=A&ageGroup=ALL&location=Cattery&site=Adoptions&onHold=no&orderBy=ID&primaryBreed=All&secondaryBreed=All&specialNeeds=A&noDogs=A&noCats=A&noKids=A&stageid=0');
                $xml = simplexml_load_string($xml_string);
                $json = json_encode($xml);
                echo $json;
            } else {
                echo "Unknown type set";
            }
        } else {
            echo "No type set";
        }
    }
?>
