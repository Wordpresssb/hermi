<?php
/**
 * Page template part for displaying content in a standard grid.
 *
 * @package Hermi
 * @since Hermi 0.1.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
?>

<?php do_action( 'hermi_entry_before' ); ?>
<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<?php do_action( 'hermi_entry_top' ); ?>

	<header class="entry-header">
		<?php get_template_part( 'templates/parts/page/entry-header' ); ?>
	</header><!-- .entry-header -->

	<?php do_action( 'hermi_entry_content_before' ); ?>
	<div class="entry-content grid-container">
	
		<div class="grid-x align-center">
			<div class="cell small-12">
				<?php
					do_action( 'hermi_entry_content_top' );

					the_content();
					wp_link_pages();
					
					do_action( 'hermi_entry_content_bottom' );
				?>		
			</div><!-- .cell .small-12 -->
		</div><!-- .grid-x .align-center -->
		
	</div><!-- .entry-content grid-container -->
	<?php do_action( 'hermi_entry_content_after' ); ?>

	<?php do_action( 'hermi_entry_bottom' ); ?>
</article><!-- #post-{id} -->
<?php do_action( 'hermi_entry_after' ); ?>