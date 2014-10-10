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

                #Pull all animals located in the Dog Runs 
                $xml_dog_string = file_get_contents('http://www.petango.com/webservices/wsadoption.asmx/AdoptableSearch?authkey=' . get_option("pp_auth_key") . '&speciesID=1&sex=A&ageGroup=ALL&location=Dog%20Runs&site=Adoptions&onHold=A&orderBy=ID&primaryBreed=All&secondaryBreed=All&specialNeeds=A&noDogs=A&noCats=A&noKids=A&stageid=0');
                $xml_dog = simplexml_load_string($xml_dog_string);
                $json_dog = json_encode($xml_dog);
                $json_dog_temp = json_decode($json_dog, true);
                
                #Pull all animals located in the Puppy Room
                $xml_puppy_string = file_get_contents('http://www.petango.com/webservices/wsadoption.asmx/AdoptableSearch?authkey=' . get_option("pp_auth_key") . '&speciesID=1&sex=A&ageGroup=ALL&location=Puppy%20Room&site=Adoptions&onHold=A&orderBy=ID&primaryBreed=All&secondaryBreed=All&specialNeeds=A&noDogs=A&noCats=A&noKids=A&stageid=0');
                $xml_puppy= simplexml_load_string($xml_puppy_string);
                $json_puppy = json_encode($xml_puppy);
                $json_puppy_temp = json_decode($json_puppy, true);
                $json_return = array_merge($json_puppy_temp["XmlNode"], $json_dog_temp["XmlNode"]);
                echo json_encode($json_return);
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
