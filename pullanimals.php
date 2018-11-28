<?php
    define('WP_USE_THEMES', false);
    require('../../../wp-blog-header.php');
    if(!isset($_GET)) {
        echo "Get not set";
    } else {
        if(isset($_GET['type'])) {
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
    $json_array = array();

    # Prevent file_get_contents from breaking over an OpenSSL HTTPS connection
	$arrContextOptions=array(
		"ssl"=>array(
			"verify_peer"=>false,
			"verify_peer_name"=>false,
		),
	);

    #Cycle through each room in the list, and pull the animal data for that room.
    foreach($room_array as $room_string) {
        $room_string = trim($room_string);
        $room_string = preg_replace('/\s+/', '%20', $room_string);
        $xml_temp_string = file_get_contents('http://ws.petango.com/webservices/wsadoption.asmx/AdoptableSearch?authkey=' . get_option("pp_auth_key") . '&speciesID=0&sex=A&ageGroup=ALL&location=' . $room_string . '&site=Adoptions&onHold=A&orderBy=ID&primaryBreed=All&secondaryBreed=All&specialNeeds=A&noDogs=A&noCats=A&noKids=A&stageid=0');
        $xml_temp = simplexml_load_string($xml_temp_string);
        $json_temp = json_encode($xml_temp);
        $json_temp_decode = json_decode($json_temp, true);
        $json_array[] = $json_temp_decode;
    }

    #Cycle through each JSON object, and merge it together into one mega-JSON object
    $merged_array = array();
    foreach($json_array as $json) {
        $merged_array = array_merge($merged_array, $json["XmlNode"]);
        $merged_array = array_filter($merged_array, "test_for_empty_object");
    }
     
    #encode and return the mega-object
    echo json_encode($merged_array);
}
?>
