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
	register_setting( 'pp-settings-group', 'pp_theme_color' );
	register_setting( 'pp-settings-group', 'dog_room_list' );
	register_setting( 'pp-settings-group', 'cat_room_list' );
	register_setting( 'pp-settings-group', 'other_room_list' );
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

        <th scope="row">Theme Color:</th>
        <td><input type="text" name="pp_theme_color" value="<?php echo esc_attr( get_option('pp_theme_color') ); ?>" /></td>
        </tr>
         
        <tr valign="top">
        <th scope="row">URL of Adoptable Dogs page</th>
        <td><input type="text" name="view_dogs_page" value="<?php echo esc_attr( get_option('view_dogs_page') ); ?>" /></td>
        
        <th scope="row">URL of Adoptable Cats page</th>
        <td><input type="text" name="view_cats_page" value="<?php echo esc_attr( get_option('view_cats_page') ); ?>" /></td>
        </tr>

        <tr valign="top">
        <th scope="row">URL of Adoptable Small Animals page</th>
        <td><input type="text" name="view_other_page" value="<?php echo esc_attr( get_option('view_other_page') ); ?>" /></td>

        <th scope="row">URL of View Animals page</th>
        <td><input type="text" name="view_animal_page" value="<?php echo esc_attr( get_option('view_animal_page') ); ?>" /></td>
        </tr>

        <tr valign="top">
        <th scope="row">Dog Rooms (Comma Seperated List)</th>
        <td><input type="text" name="dog_room_list" value="<?php echo esc_attr( get_option('dog_room_list') ); ?>" /></td>

        <th scope="row">Cat Rooms (Comma Seperated List)</th>
        <td><input type="text" name="cat_room_list" value="<?php echo esc_attr( get_option('cat_room_list') ); ?>" /></td>
        </tr>

        <tr valign="top">
        <th scope="row">Other Animal Rooms (Comma Seperated List)</th>
        <td><input type="text" name="other_room_list" value="<?php echo esc_attr( get_option('other_room_list') ); ?>" /></td>
        </tr>
    </table>
    
    <?php submit_button(); ?>

</form>
</div>
<?php } ?>
