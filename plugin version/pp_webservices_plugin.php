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

    if (is_page_template('adoptable-cats-template.php')) {
        $requestURL = $plugin_base . '/pullanimals.php?type=cat';
         echo $link_scripts . '<script type="text/javascript">
                    window.onload = pull_animals("' . $requestURL . '")
                </script>';
    } else if(is_page_template('adoptable-dogs-template.php')) {
         $requestURL = $plugin_base . '/pullanimals.php?type=dog';
         echo $link_scripts . '<script type="text/javascript">
                    window.onload = pull_animals("' . $requestURL . '")
                </script>';
    }
}


function pp_setup_view_animal_page_header() {
    $plugin_base = plugins_url(null, __FILE__);
    if(is_page("View Animal"))  {
        echo '<script type="text/javascript" src="' . $plugin_base . '/js/xml2json.min.js"></script>
            <script type="text/javascript" src="' . $plugin_base . '/js/view_animal.js"></script>
            <link rel="stylesheet" href="' . $plugin_base . '/css/pp-webservices-style.css">';
        $animalid = get_query_var('animalid');
        if(!empty($animalid) ) {
            $xml = file_get_contents("http://www.petango.com/webservices/wsadoption.asmx/AdoptableDetails?authkey=pxmj0427a7afmdgc0v6030lfurxt0ypw57dbs0dr4ga2g2j0a4&animalID=" . $animalid);
            echo '<script type="text/javascript">
            var detail =' . json_encode($xml) . ';</script>';
        }
    }
}


function pp_setup_view_animal_page_footer() {
    if(is_page("View Animal"))  {
        echo '<script>window.onload = view_animal(detail)</script>';
    }
}

function pp_add_rewrite() {
    add_rewrite_rule('adopt/meet-adoptable-pets/viewanimal/([0-9]{1,})/?', 'index.php?page_id=10434&animalid=$matches[1]', 'top');
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
