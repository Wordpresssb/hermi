<?php
/**
 * Enqueue JavaScipt used on the front end of the theme.
 * 
 * JS is compiled via Gulp.
 * 
 * @since Hermi 0.1.0
 * @return void
 */
add_action( 'wp_enqueue_scripts', 'hermi_scripts' );
function hermi_scripts() {
	// Add Foundation JavaScript to the footer.
	wp_enqueue_script( 'foundation-js', 
		get_template_directory_uri() . '/assets/dist/js/foundation' . hermi_get_script_suffix() . '.js',
		[ 'jquery' ],
		HERMI_VERSION,
		true
	);
	
	// Add general JavaScript used by theme to the footer.
	wp_enqueue_script( 'theme-js',
		get_template_directory_uri() . '/assets/dist/js/scripts' . hermi_get_script_suffix() . '.js',
		[ 'jquery', 'foundation-js' ],
		HERMI_VERSION,
		true
	);
	
	// Load comment reply JavaScript only when necessary.
	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) && ! is_front_page() ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
