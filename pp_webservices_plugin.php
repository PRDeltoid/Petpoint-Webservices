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

$plugin_base = plugins_url(null, __FILE__);

function pp_enqueue_scripts_styles() {
    global $plugin_base;

    if (is_page(url_to_postid(get_option('view_cats_page'))) || is_page(url_to_postid(get_option('view_dogs_page')))) {
        wp_enqueue_script('pull-animals', $plugin_base . '/js/pull_animals.js', array('jquery', 'jquery-ui-core', 'jquery-ui-widget', 'jquery-ui-position', 'jquery-ui-tooltip'));
        wp_enqueue_style('pp-webservices-style',  $plugin_base . '/css/pp-webservices-style.css');
        wp_enqueue_style('pp-jquery-style', $plugin_base . '/css/jquery-ui.css');
        wp_enqueue_style('pp-jquery-structure-style', $plugin_base . '/css/jquery-ui.structure.min.css');
        wp_enqueue_style('pp-jquery-theme-style', $plugin_base . '/css/jquery-ui.theme.min.css');
    }
    if(is_page(url_to_postid(get_option('view_animal_page'))))  {
        wp_enqueue_script('view-animal', $plugin_base . '/js/view_animal.js', array('jquery', 'jquery-ui-core', 'jquery-ui-widget', 'jquery-ui-position', 'jquery-ui-tooltip'));
        wp_enqueue_style('pp-webservices-style', $plugin_base . '/css/pp-webservices-style.css');
        wp_enqueue_style('pp-bootstrap-style', $plugin_base . '/css/bootstrap.min.css');
        wp_enqueue_style('pp-jquery-style', $plugin_base . '/css/jquery-ui.css');
        wp_enqueue_style('pp-jquery-structure-style', $plugin_base . '/css/jquery-ui.structure.min.css');
        wp_enqueue_style('pp-jquery-theme-style', $plugin_base . '/css/jquery-ui.theme.min.css');
    }

}

function pp_setup_view_adoptable_page() {
    global $plugin_base;

    $view_animal_link = get_option('view_animal_page');

    if (is_page(url_to_postid(get_option('view_cats_page')))) {
        $requestURL = $plugin_base . '/pullanimals.php?type=cat';
         echo '<script type="text/javascript">
                    window.onload = pull_animals("' . $view_animal_link . '","' . $requestURL . '", sort_by_name, "sort_by_name")
                </script>';
    } else if(is_page(url_to_postid(get_option('view_dogs_page')))) {
         $requestURL = $plugin_base . '/pullanimals.php?type=dog';
         echo '<script type="text/javascript">
                     window.onload = pull_animals("' . $view_animal_link . '","' . $requestURL . '", sort_by_name, "sort_by_name");
                </script>';
    }
}

function pp_setup_view_animal_page_footer() {
    global $plugin_base;
    if(is_page(url_to_postid(get_option('view_animal_page'))))  {
        $animalid = get_query_var('animalid');
        if(!empty($animalid) ) {
            echo '<script>window.onload = view_animal(' . $animalid . ',"' .  $plugin_base . '", {cats:"' . get_option('view_cats_page') . '", dogs: "' . get_option('view_dogs_page') . '"})</script>';
        }
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
add_action('wp_footer', 'pp_setup_view_animal_page_footer');
add_action('wp_enqueue_scripts', 'pp_enqueue_scripts_styles');

//Hook for rewriting View Animal urls.
add_action('init', 'pp_add_rewrite');
?>
