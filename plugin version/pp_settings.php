<?php function pp_generate_settings_page() { ?>
<div class='wrap'>
    <form method='post' action='options.php'> 
        <?php settings_fields( 'pp-options-group' ) ?>
        <?php do_settings_sections('pp-options-group') ?>
            <tr valign="top">
                <th scope="row">New Option Name</th>
                <td>
                    <input type="text" name="test_setting" value="<?php echo esc_attr( get_option('test_setting') ); ?>" />
                </td>
            </tr>
             
            <tr valign="top">
                <th scope="row">Some Other Option</th>
                <td>
                    <input type="text" name="some_other_test_setting" value="<?php echo esc_attr( get_option('some_other_test_setting') ); ?>" />
                </td>
            </tr>
        </tr>
        <?php submit_button() ?>
    </form>
</div>
<?php } 

function pp_setup_settings_menu() {
    $page_title = 'options-general.php';
    $menu_title = 'Petpoint Webservices';
    $capability = 'manage_options';
    $menu_slug = 'pp-webservices-settings';
    $function = 'pp_settings_menu';
    add_menu_page($page_title, $menu_title, $capability, $menu_slug, $function);
}

function pp_register_settings() {
    register_setting('pp-options-group', 'test_setting');
    register_setting('pp-options-group', 'some_other_test_setting');
}



function pp_settings_menu() {
    if (!current_user_can('manage_options')) {
        wp_die('You do not have sufficient permissions to access this page.');
    }

    echo pp_generate_settings_page();
}
?>
