<?php
    /*
    Plugin Name: PP Webservices Adoptable Animals
    Plugin URI: http://sspca.org
    Description: This plugin links PetPoint Webservices Adoptable Animals list into a page or pages. Allows users to edit what pages the animals appear on, as well as what animals are displayed.
    Version: 0.1
    Author: Taylor Britton
    Author URI: taylorbritton.me
    License: GPL2
    */
include('pp_settings.php');

function pp_setup_view_adoptable_page() {
    $plugin_base = plugins_url(null, __FILE__);

    $link_scripts = '<script type="text/javascript" src="' . $plugin_base . '/js/xml2json.min.js"></script>
                <script type="text/javascript" src="' . $plugin_base . '/js/pull_animals.js"></script>
                <link rel="stylesheet" href="' . $plugin_base . '/css/pp-webservices-style.css">';

    $view_animal_link = get_option('view_animal_page');

    if (is_page(url_to_postid(get_option('view_cats_page')))) {
        $requestURL = $plugin_base . '/pullanimals.php?type=cat';
         echo $link_scripts . '<script type="text/javascript">
                    window.onload = pull_animals("' . $view_animal_link . '","' . $requestURL . '")
                </script>';
    } else if(is_page(url_to_postid(get_option('view_dogs_page')))) {
         $requestURL = $plugin_base . '/pullanimals.php?type=dog';
         echo $link_scripts . '<script type="text/javascript">
                    window.onload = pull_animals("' . $view_animal_link . '","' . $requestURL . '")
                </script>';
    }
}


function pp_setup_view_animal_page_header() {
    $plugin_base = plugins_url(null, __FILE__);
    if(is_page(url_to_postid(get_option('view_animal_page'))))  {
        echo '<script type="text/javascript" src="' . $plugin_base . '/js/xml2json.min.js"></script>
            <script type="text/javascript" src="' . $plugin_base . '/js/view_animal.js"></script>
            <link rel="stylesheet" href="' . $plugin_base . '/css/pp-webservices-style.css">';
        $animalid = get_query_var('animalid');
if(!empty($animalid) ) {
            $xml_string = file_get_contents("http://www.petango.com/webservices/wsadoption.asmx/AdoptableDetails?authkey=" . get_option('pp_auth_key') . "&animalID=" . $animalid);
            $xml = simplexml_load_string($xml_string);
            $json = json_encode($xml);
            echo '<script type="text/javascript">
                var detail =' . $json . ';</script>';
        }
    }
}


function pp_setup_view_animal_page_footer() {
    if(is_page("View Animal"))  {
        echo '<script>window.onload = view_animal(detail)</script>';
    }
}

function pp_add_rewrite() {
    $animal_page_id = url_to_postid(get_option('view_animal_page'));
    $url = parse_url(get_option('view_animal_page'));
    $url_path = ltrim ($url['path'],'/');
    add_rewrite_rule($url_path . '([0-9]{1,})/?', 'index.php?page_id=' . $animal_page_id . '&animalid=$matches[1]', 'top');
}

function pp_add_query_vars_filter( $vars ){
  $vars[] = "animalid";
  return $vars;
}
add_filter( 'query_vars', 'pp_add_query_vars_filter' );

//Hooks for adding neccissary JS files to adoptable pages.
add_action('wp_head', 'pp_setup_view_adoptable_page');
add_action('wp_head', 'pp_setup_view_animal_page_header');
add_action('wp_footer', 'pp_setup_view_animal_page_footer');

//Hook for rewriting View Animal urls.
add_action('init', 'pp_add_rewrite');
?>
