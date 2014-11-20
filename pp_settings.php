<?php

add_action('admin_menu', 'pp_create_menu');
function pp_create_menu() {
	//create new top-level menu
    add_options_page('PetPoint Plugin Settings', 'PP Webservices Settings', 'manage_options', 'pp-plugin-settings', 'pp_settings_page');
}

add_action('admin_init', 'pp_register_settings');
function pp_register_settings() {
	//register settings
	register_setting( 'pp-settings-group', 'view_animal_page' );
	register_setting( 'pp-settings-group', 'view_dogs_page' );
	register_setting( 'pp-settings-group', 'view_cats_page' );
	register_setting( 'pp-settings-group', 'view_other_page' );
	register_setting( 'pp-settings-group', 'pp_auth_key' );
    
}

function pp_settings_page() {
?>
<div class="wrap">
<h2>PP Webservices</h2>

<form method="post" action="options.php">
    <?php settings_fields( 'pp-settings-group' ); ?>
   <?php do_settings_sections( 'pp-settings-group' ); ?>
    <table class="form-table">
        <tr valign="top">
        <th scope="row">Petpoint Authentication Key</th>
        <td><input type="text" name="pp_auth_key" value="<?php echo esc_attr( get_option('pp_auth_key') ); ?>" /></td>
        </tr>

        <tr valign="top">
        <th scope="row">URL of View Animals page</th>
        <td><input type="text" name="view_animal_page" value="<?php echo esc_attr( get_option('view_animal_page') ); ?>" /></td>
        </tr>
         
        <tr valign="top">
        <th scope="row">URL of Adoptable Dogs page</th>
        <td><input type="text" name="view_dogs_page" value="<?php echo esc_attr( get_option('view_dogs_page') ); ?>" /></td>
        </tr>
        
        <tr valign="top">
        <th scope="row">URL of Adoptable Cats page</th>
        <td><input type="text" name="view_cats_page" value="<?php echo esc_attr( get_option('view_cats_page') ); ?>" /></td>
        </tr>
        <tr valign="top">
        <th scope="row">URL of Adoptable Small Animals page</th>
        <td><input type="text" name="view_other_page" value="<?php echo esc_attr( get_option('view_other_page') ); ?>" /></td>
        </tr>
    </table>
    
    <?php submit_button(); ?>

</form>
</div>
<?php } ?>
