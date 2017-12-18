<?php
/**
 * Post template part for showing loop in a standard grid.
 *
 * @package Hermi
 * @since Hermi 0.1.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
?>

<?php do_action( 'hermi_content_before' ); ?>
<main id="main-content" class="site-main">
	<?php
		do_action( 'hermi_content_top' );

		if ( have_posts() ) {

			do_action( 'hermi_content_while_before' );
			while ( have_posts() ) {
				the_post();
				/*
				 * Include the Post-Format-specific template for the content.
				 * If you want to override this in a child theme, then include a file
				 * called entry-content-post-grid-___.php (where ___ is the Post Format name) and that will be used instead.
				 */
				get_template_part( 'templates/parts/post/entry-content-post-grid', get_post_format() );
				
				
				if ( 'post' === get_post_type() ) {
					get_template_part( 'templates/parts/pagination/pagination-single-container' );
				}

				get_template_part( 'templates/parts/comments/comments-container' );
				
			}
			do_action( 'hermi_content_while_after' );
		}

		do_action( 'hermi_content_bottom' );
	?>
</main><!-- .main-content -->
<?php do_action( 'hermi_content_after' ); ?>
