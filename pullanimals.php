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

                #combine the puppies and dogs into one json string
                $json_return = array_merge($json_puppy_temp["XmlNode"], $json_dog_temp["XmlNode"]);
                $json_return_filtered = array_filter($json_return, "test_for_empty_object");
                echo json_encode($json_return_filtered);
            } else if($_GET['type']=="cat") {
                header('Content-type: application/json');

                #Pull all animals located in cattery
                $xml_cat_string = file_get_contents('http://www.petango.com/webservices/wsadoption.asmx/AdoptableSearch?authkey=' . get_option("pp_auth_key") . '&speciesID=2&sex=A&ageGroup=ALL&location=Cattery&site=Adoptions&onHold=A&orderBy=ID&primaryBreed=All&secondaryBreed=All&specialNeeds=A&noDogs=A&noCats=A&noKids=A&stageid=0');
                $xml_cat = simplexml_load_string($xml_cat_string);
                $json_cat = json_encode($xml_cat);
                $json_cat_temp = json_decode($json_cat, true);

                #Pull all animals located in kittery
                $xml_kitten_string = file_get_contents('http://www.petango.com/webservices/wsadoption.asmx/AdoptableSearch?authkey=' . get_option("pp_auth_key") . '&speciesID=2&sex=A&ageGroup=ALL&location=Kittery&site=Adoptions&onHold=A&orderBy=ID&primaryBreed=All&secondaryBreed=All&specialNeeds=A&noDogs=A&noCats=A&noKids=A&stageid=0');
                $xml_kitten = simplexml_load_string($xml_kitten_string);
                $json_kitten = json_encode($xml_kitten);
                $json_kitten_temp = json_decode($json_kitten, true);

                #combine the cats and kittens into one json string
                $json_return = array_merge($json_kitten_temp["XmlNode"], $json_cat_temp["XmlNode"]);
                $json_return_filtered = array_filter($json_return, "test_for_empty_object");
                echo json_encode($json_return_filtered);
            } else if($_GET['type']=="other") { #Pull all animals located in small animal room 
                header('Content-type: application/json');
                
                $xml_other_string = file_get_contents('http://www.petango.com/webservices/wsadoption.asmx/AdoptableSearch?authkey=' . get_option("pp_auth_key") . '&speciesID=0&sex=A&ageGroup=ALL&location=Small%20Animals&site=Adoptions&onHold=A&orderBy=ID&primaryBreed=All&secondaryBreed=All&specialNeeds=A&noDogs=A&noCats=A&noKids=A&stageid=0');
              
                $xml_other = simplexml_load_string($xml_other_string);
                $json_other = json_encode($xml_other);
                $json_other_temp = json_decode($json_other, true);

                $xml_barn_string = file_get_contents('http://www.petango.com/webservices/wsadoption.asmx/AdoptableSearch?authkey=' . get_option("pp_auth_key") . '&speciesID=0&sex=A&ageGroup=ALL&location=Receiving-Barn&site=Adoptions&onHold=A&orderBy=ID&primaryBreed=All&secondaryBreed=All&specialNeeds=A&noDogs=A&noCats=A&noKids=A&stageid=0');
                $xml_barn = simplexml_load_string($xml_barn_string);
                $json_barn = json_encode($xml_barn);
                $json_barn_temp = json_decode($json_barn, true);

                $json_return = array_merge($json_other_temp["XmlNode"], $json_barn_temp["XmlNode"]);
                $json_return_filtered = array_filter($json_return, "test_for_empty_object");
                echo json_encode($json_return_filtered);
            } else {
                echo "Unknown type set";
            }
        } else {
            echo "No type set";
        }
    }


    function test_for_empty_object($object) {
        if(count($object) == 0) {
            return false;
        } else {
            return true;
        }
    }
?>
