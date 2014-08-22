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
//include('pp_settings.php');
include('pp_widget.php');

function pp_setup_view_adoptable_page() {
    if (is_page_template('adoptable-cats-template.php')) {
     echo '<script type="text/javascript" src="/wp-content/plugins/pp-webservices/js/xml2json.min.js"></script>
            <script type="text/javascript" src="/wp-content/plugins/pp-webservices/js/pull_animals.js"></script>
            <script type="text/javascript">
                window.onload = pull_animals("cat")
            </script>';
    } else if(is_page_template('adoptable-dogs-template.php')) {
         echo '<script type="text/javascript" src="/wp-content/plugins/pp-webservices/js/xml2json.min.js"></script>
                <script type="text/javascript" src="/wp-content/plugins/pp-webservices/js/pull_animals.js"></script>
                <link rel="stylesheet" href="/wp-content/plugins/pp-webservices/css/pp-webservices-style.css">
                <script type="text/javascript">
                    window.onload = pull_animals("dog") 
                </script>';
    }
}


function pp_setup_view_animal_page_header() {
    if(is_page("View Animal"))  {
        echo '<script type="text/javascript" src="/wp-content/plugins/pp-webservices/js/xml2json.min.js"></script>
            <script type="text/javascript" src="/wp-content/plugins/pp-webservices/js/view_animal.js"></script>
            <link rel="stylesheet" href="/wp-content/plugins/pp-webservices/css/pp-webservices-style.css">';
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
    add_rewrite_rule('adopt/meet-adoptable-pets/viewanimal/([0-9]{1,})/?', 'index.php?page_id=12926&animalid=$matches[1]', 'top');
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

//Hook for registering the widget
add_action( 'widgets_init', 'pp_register_widget' );
?>
