<?php 
/**
 * Template part for displaying the container for the sticky post message.
 * 
 * Sticky posts are only styled differently on archive 
 * pages by design: https://core.trac.wordpress.org/ticket/23559
 */
?>
<div class="entry-sticky-message-wrap grid-container">

	<div class="grid-x align-center">
		<div class="cell small-12">
			<?php get_template_part( 'template-parts/post/archive/entry-sticky-message' ); ?>
		</div><!-- .cell .small-12 -->
	</div><!-- .grid-x -->
	
</div><!-- .entry-sticky-message-wrap -->
