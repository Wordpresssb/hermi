'use strict';
/**
 * The default gulp file.
 * Here is where we initialize variables and define functions and tasks.
 *
 * To run alternate gulp file (e.g., for testing) use the command: gulp --gulpfile=gulpfile2.babel.js
 *
 * Task functions are broken out into separate files and have thier dependencies injected.
 * This is done to keep this file from becoming too large and unwieldy. 
 *
 * The following dependencies will be available to our tasks:
 *
 *    gulp:    Gulp instance.
 *    plugins: Gulp plugins **and other modules** used by the build process.
 *    CONFIG:  Configuration parameters set in the config.yml file.
 *    ARGS:    Arguments passed to gulp command.
 *    browser: BrowserSync instance.
 * 
 */
 
/**
 * Initialize various modules.
 */
var gulp    = require( 'gulp' ),
		browser = require( 'browser-sync' ).create(),
		argv    = require( 'yargs' ).argv;

/**
 * Create "plugins" variable which includes both Gulp plugins and other modules 
 * which we pass into separate Gulp task files as dependencies.
 */
var plugins = require( 'gulp-load-plugins' ) ( {
	// We include non-gulp modules inside the plugins varaible,
	// so make sure that gulp-load-plugins grabs them too:
  pattern: [ 
		'gulp-*',
		'gulp.*',
		'del',
		'rimraf',
		'js-yaml',
		'jshint-stylish',
		'merge-stream'
	],
	rename : {
		'js-yaml'        : 'yaml',
		'jshint-stylish' : 'stylish',
		'merge-stream'   : 'merge',
		'gulp-clip-empty-files' : 'clip'
	},
	DEBUG: false,
	lazy: true
});

/**
 * Configuration variables used by our build process.
 * See /config.yml for settings.
 */
const CONFIG = loadConfig();

/**
 * Command line arguments passed when executing the gulp command.
 */
const ARGS = {};

/**
 * Set production flag which can be set when running gulp.
 * E.g.: gulp --production
 */
ARGS.PRODUCTION = !!( argv.production );

/**
 * Helper functions
 * Functions used for set up.
 */
 
/**
 * Handle loading of the configuration variables.
 */		
function loadConfig() {
	var fs      = require( 'fs' );
	let ymlFile = fs.readFileSync( './build/config.yml', 'utf8' );
	return plugins.yaml.load( ymlFile );
}


/**
 * Task functions
 * Functions that define what a task does.
 */
 
/**
 * Start a server with Browsersync to preview the site.
 */
function server( done ) {
	// Using the original URL, not proxy, with browsersync
	// http://stackoverflow.com/a/29607382/3059883
	// https://github.com/BrowserSync/browser-sync/issues/646
  browser.init( {
		logSnippet: true,
		open:   false,
		port:   3000,
		notify: false,
		ghost:  false
		
		/*

		
		proxy: "localhost/wp-theme-testing",
		host:   "localhost/wp-theme-testing"
		//notify: 'false'		
		*/
		
		
		
		//proxy:  "http://localhost/wp-theme-testing"
		
		/*,

    //proxy:  "daveromsey.com", // TODO Use a default and override with parameters cia cli
    //host:   "daveromsey.com",
    //host:   "wp-theme-testing",
    
		//proxy:  "localhost/wp-theme-testing", // TODO Use a default and override with parameters cia cli
    
		//open:   'external',
    //host:   "localhost",
		//proxy:  "localhost/wp-theme-testing",
		
		watchOptions: { debounceDelay: 1000 },
		files: [
			PATHS.sass,
			PATHS.javascript,
			PATHS.javascriptFoundationAll,
			PATHS.php
		]*/
  } );

  done();
}

/**
 * Reload the browser with BrowserSync
 * @link https://github.com/zurb/foundation-zurb-template/pull/37
 */
function reload( done ) {
  browser.reload();
  done();
}

/**
 * Watch files for changes and reload browser.
 */ 
function watch() {
	// Watch theme's PHP files
	gulp.watch( CONFIG.PATHS.PHP ).on( 'change', gulp.series( reload ) );
	
	// Watch images directory
	gulp.watch( CONFIG.PATHS.IMAGES ).on( 'change', gulp.series( images, reload ) );
	
	// Watch Sass files
	gulp.watch( CONFIG.PATHS.SASS ).on( 'change', gulp.series( stylesSass, reload ) );

	// Watch valilla CSS files
	gulp.watch( CONFIG.PATHS.CSS ).on( 'change', gulp.series( stylesCSS, reload ) );
  
	// Watch Foundation's JavaScript files
  gulp.watch( CONFIG.PATHS.JAVASCRIPT_FOUNDATION_COMPONENTS ).on( 'change', gulp.series( foundationJS, reload ) );
  
	// Watch theme's various other JavaScript files.
	gulp.watch( CONFIG.PATHS.JAVASCRIPT ).on( 'change',
		gulp.series(
			gulp.parallel( 
				siteJS,
				tinymceJS,
				customizeControlsJS,
				customizePreviewJS
			),
			reload
		)
	);
}

/**
 * Clear out /dist directory
 */ 
function clean() {
	return require( './build/clean' )( gulp, plugins, CONFIG, ARGS );
}

/**
 * Process image files.
 */
function images() {
	return require( './build/images' )( gulp, plugins, CONFIG, ARGS, browser );
}

/**
 * Process Sass files
 */
function stylesSass() {
	return require( './build/styles-sass' )( gulp, plugins, CONFIG, ARGS, browser );
}

/**
 * Copies CSS files from /source to /dist directory.
 * This is used just in case we want to include some plain
 * CSS files with our theme. For instance, packages not available
 * via a package manager or dependencies that are written in vanilla CSS.
 */
function stylesCSS() {
	return require( './build/styles-css' )( gulp, plugins, CONFIG, ARGS, browser );
}

function sociconIcons() {
	return require( './build/socicons' )( gulp, plugins, CONFIG, ARGS );
}

function materialIcons() {
	return require( './build/material-icons' )( gulp, plugins, CONFIG, ARGS );
}

function materialIconsByClassName() {
	return require( './build/material-icons-by-class-name' )( gulp, plugins, CONFIG, ARGS );
}

function siteJS() {
	return require( './build/site-js' )( gulp, plugins, CONFIG, ARGS );
}

function foundationJS() {
	return require( './build/foundation-js' )( gulp, plugins, CONFIG, ARGS );
}

function tinymceJS() {
	return require( './build/tinymce-js' )( gulp, plugins, CONFIG, ARGS );
}

function scrollUp() {
	return require( './build/scrollup-js' )( gulp, plugins, CONFIG, ARGS );
}

function customizeControlsJS() {
	return require( './build/customize-controls-js' )( gulp, plugins, CONFIG, ARGS );
}

function customizePreviewJS() {
	return require( './build/customize-preview-js' )( gulp, plugins, CONFIG, ARGS );
}

/**
 * This is a function used for testing and debugging.
 * Customize as needed and associate it with a task.
 */
function testing( done ) {
	clean();
	//console.log( clean );
	//return done();
	//require('./build/config-load')(gulp, plugins, config);
	return done();
	
}

/**
 * Gulp Tasks
 * 
 */
gulp.task( 'mdclasses',
  gulp.series(
		materialIconsByClassName,
		
		function( done ) { done() }
	)
);

// socicons

// scripts

// materialIcons

gulp.task( 'images',
  gulp.series(
		images,
		
		function( done ) { done() }
	)
);

// TODO: some of these can run in parallel?
gulp.task( 'styles',
	gulp.series(
		clean,
		//gulp.series( sociconIcons ),		
		gulp.series(
			sociconIcons,
			materialIcons,
			materialIconsByClassName,
			stylesSass,
			stylesCSS
		),
		
		function( done ) { done(); }
	)
);

gulp.task( 'build',
	gulp.series(
		// Clear out dist directory
		gulp.series( clean ),
		
		// Import and process dependencies
		gulp.parallel(
			sociconIcons,
			scrollUp,
			gulp.series( materialIcons, materialIconsByClassName ),
		),
		
		// Process various assets
		gulp.parallel(
				images,
				stylesSass,
				stylesCSS,
				siteJS,
				tinymceJS,
				foundationJS,
				customizeControlsJS,
				customizePreviewJS				
		),
		
		function( done ) { done(); }
	)
);

// Start up the Browsersync server, build the Sass and JS, watch for file changes
gulp.task( 'default',
  gulp.series(
		'build', // Task
		server,  // Function
		watch,   // Function
		function( done ) {
			done();
		}
	)
);
