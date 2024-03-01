<?php
    define('WP_USE_THEMES', false);
    require('../../../wp-blog-header.php');
    if(!isset($_GET)) {
        echo "Get not set";
    } else {
        if(isset($_GET['type'])) {
            header('HTTP/1.1 200 OK');
            $type = $_GET['type'];
            if($_GET['type']=="dog") {         #Pull all animals located in dog rooms  
                header('Content-type: application/json');
                $room_list = get_option("dog_room_list");
                echo_json($room_list);
            } else if($_GET['type']=="cat") {  #Pull all animals located in cat rooms 
                header('Content-type: application/json');
                $room_list = get_option("cat_room_list");
                echo_json($room_list);
            } else if($_GET['type']=="other") { #Pull all animals located in small animal rooms 
                header('Content-type: application/json');
                $room_list = get_option("other_room_list");
                echo_json($room_list);
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

function echo_json($room_list) {
    #Split the list into an array
    $room_array = explode(',', $room_list);

    #Initialize an empty array to store JSON data
    $json_array = [];

    foreach($room_array as $room_string) {
        $room_string = trim($room_string);
        $room_string = preg_replace('/\s+/', '%20', $room_string);

        $xml_string = file_get_contents('http://ws.petango.com/webservices/wsadoption.asmx/AdoptableSearch?authkey=' . get_option("pp_auth_key") . '&speciesID=0&sex=A&ageGroup=ALL&location=' . $room_string . '&site=&onHold=A&orderBy=ID&primaryBreed=All&secondaryBreed=All&specialNeeds=A&noDogs=A&noCats=A&noKids=A&stageid=');
        $xml = simplexml_load_string($xml_string);

        #Loop through each XmlNode
        foreach ($xml->XmlNode as $node) {
            #Skip nil nodes
            if ($node->attributes('xsi', true)->nil == 'true') {
                continue; 
            }
            $data = [];
            
            #Get child elements of adoptableSearch objects (the animals)
            foreach ($node->adoptableSearch->children() as $child) {
                $data[$child->getName()] = strval($child); #Convert SimpleXMLElement to string
            }
            #Append data to json_array array
            $json_array[] = $data;
        }
    }
     
    #encode and return the mega-object
    echo json_encode($json_array);
}
?>
