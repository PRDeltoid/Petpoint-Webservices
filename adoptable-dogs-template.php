<?php
/**
 * Template Name: Adoptable Dogs Template 
 * Description: A Page Template that includes scripts and css to display adoptable animals from Petpoint webservices
 *
 * @package WordPress
 * @subpackage Twenty_Eleven
 * @since Twenty Eleven 1.0
 */

get_header('tier3'); ?>

		<div id="primary">
			<div id="content-nobar" role="main">
            
            	<?php if ( function_exists('yoast_breadcrumb') ) {
				yoast_breadcrumb('<p id="breadcrumbs">','</p>');
				} ?>

				<?php while ( have_posts() ) : the_post(); ?>

					<?php get_template_part( 'content', 'page' ); ?>
                    <?php if ( is_active_sidebar( 'pp_adoptable_area_dogs' ) ) : ?>
                        <div>
                            <?php dynamic_sidebar( 'pp_adoptable_area_dogs' ); ?>
                        </div>
                    <?php endif; ?>

					<?php comments_template( '', true ); ?>

				<?php endwhile; // end of the loop. ?>

			</div><!-- #content -->
		</div><!-- #primary -->
        
<?php get_footer(); ?>
