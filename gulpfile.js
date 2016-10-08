'use strict';

/*
 *
 * Gulpfile that handles bedrock-style project layouts.
 * Configure themes and plugins you are developing in gulp.config.js
 * See sample config. Omit the parts your project does not need, ie. fonts
 * This file can be left untouched when adding or removing themes/plugins.
 *
 */

////////////////////////////////////////////////////////////////////////
//                              CONFIGS                               //
////////////////////////////////////////////////////////////////////////

const CONFIGS = [ require( './gulp.config' ) ];
const APPS = CONFIGS[0].apps;

////////////////////////////////////////////////////////////////////////
//                            DEPENDENCIES                            //
////////////////////////////////////////////////////////////////////////

let autoprefixer = require( 'gulp-autoprefixer' );
let browserSync  = require( 'browser-sync' ).create();
let changed      = require( 'gulp-changed' );
let collect      = require( 'gulp-rev-collector' );
let cssNano      = require( 'gulp-clean-css' );
let fs           = require( 'fs' );
let del          = require( 'del' );
let gulp         = require( 'gulp-help' )( require( 'gulp' ) );
let gulpif       = require( 'gulp-if' );
let imagemin     = require( 'gulp-imagemin' );
let less         = require( 'gulp-less' );
let merge        = require( 'merge-stream' );
let notify       = require( 'gulp-notify' );
let plumber      = require( 'gulp-plumber' );
let rename       = require( 'gulp-rename' );
let rev          = require( 'gulp-rev' );
let runSequence  = require( 'run-sequence' );
let sass         = require( 'gulp-sass' );
let shell        = require( 'gulp-shell' );
let sort         = require( 'gulp-sort' );
let sourcemaps   = require( 'gulp-sourcemaps' );
let uglify       = require( 'gulp-uglify' );
let wpPot        = require( 'gulp-wp-pot' );
let wpRev        = require( 'gulp-wp-rev' );

////////////////////////////////////////////////////////////////////////
//                             MAIN TASKS                             //
////////////////////////////////////////////////////////////////////////

gulp.task( 'default', false, ['help'] );

gulp.task( 'build', 'Clean, run pipelines and revision', () => {
    runSequence( '_clean', '_styles', '_styleguide', '_js', '_img', '_fonts', '_pot', '_rev' );
});

gulp.task( 'serve', 'Spin up browser sync and start watching for changes', [ 'build', '_browser-sync' ], () => {

    let stylesSrc = [];
    let jsSrc     = [];
    let imgSrc    = [];
    let fontsSrc  = [];
    let phpSrc    = [];

    APPS.forEach( app => {

        if ( app.styles ) {
            app.styles.src.forEach( src => {
                stylesSrc.push( app.baseDir + src );
            });
        }
        if ( app.js ) {
            app.js.src.forEach( src => {
                jsSrc.push( app.baseDir + src );
            });
        }
        if ( app.img ) {
            app.img.src.forEach( src => {
                imgSrc.push( app.baseDir + src );
            });
        }
        if ( app.fonts ) {
            app.fonts.src.forEach( src => {
                fontsSrc.push( app.baseDir + src );
            });
        }
        if ( app.php ) {
            app.php.src.forEach( src => {
                phpSrc.push( app.baseDir + src );
            });
        }

    });

    gulp.watch( stylesSrc, [ '_styles', '_styleguide' ] );
    gulp.watch( jsSrc, () => runSequence( '_js', '_browser-sync-reload' ) );
    gulp.watch( imgSrc, () => runSequence( '_img', '_browser-sync-reload' ) );
    gulp.watch( fontsSrc, () => runSequence( '_fonts', '_browser-sync-reload' ) );
    gulp.watch( phpSrc, [ '_browser-sync-reload' ] );

});

////////////////////////////////////////////////////////////////////////
//                      CSS PROCESSING PIPELINE                       //
////////////////////////////////////////////////////////////////////////

gulp.task('_styles', 'Build styles and compile out CSS', () => {

    let tasks = APPS.map( app => {

        if ( app.styles ) {

            let SRC = app.styles.src.map( source => {
                return app.baseDir + source;
            })
            let DEST = app.baseDir + app.buildLocations.css;

            return gulp.src( SRC )
            .pipe( plumber( { errorHandler: notify.onError( "Error: <%= error.message %>" ) } ) )
            .pipe( changed( DEST ) )
            .pipe( sourcemaps.init() )
            .pipe( gulpif( '*.scss', sass() ) )
            .pipe( gulpif( '*.less', less() ) )
            .pipe( autoprefixer() )
            .pipe( gulpif( app.styles.minify, cssNano() ) )
            .pipe( gulpif( app.styles.minify, rename( function( path ) {
                path.basename += ".min";
            })))
            .pipe( gulpif( app.styles.sourcemaps, sourcemaps.write( '.', {
                sourceroot: SRC
            })))
            .pipe( gulp.dest( DEST ) )
            .pipe( browserSync.stream( { match: '**/*.css' } ) );

        }

    })
    .filter( function( stream ) {
        return !!stream;
    });

    return merge( tasks );

});

////////////////////////////////////////////////////////////////////////
//                   JAVASCRIPT PROCESSING PIPELINE                   //
////////////////////////////////////////////////////////////////////////

gulp.task('_js', 'Build JavaScript and move to distribute', () => {

    let tasks = APPS.map( app => {

        if ( app.js ) {

            let SRC = app.js.src.map( source => {
                return app.baseDir + source;
            });

            let DEST = app.baseDir + app.buildLocations.js;

            return gulp.src( SRC )
            .pipe( plumber( { errorHandler: notify.onError( "Error: <%= error.message %>" ) } ) )
            .pipe( sourcemaps.init() )
            .pipe( gulpif( app.js.minify, uglify() ) )
            .pipe( rename( function( path ) {
                path.basename += ".min";
            }))
            .pipe( sourcemaps.write() )
            .pipe( gulp.dest( DEST ) );

        }

    })
    .filter( function( stream ) {
        return !!stream;
    });
    return merge( tasks );

});

////////////////////////////////////////////////////////////////////////
//                     IMAGES PROCESSING PIPELINE                     //
////////////////////////////////////////////////////////////////////////

gulp.task('_img', 'Compress and distribute images', () => {

    let tasks = APPS.map( app => {

        if ( app.img ) {

            let SRC = app.img.src.map( source => {
                return app.baseDir + source;
            })
            let DEST = app.baseDir + app.buildLocations.img;

            return gulp.src( SRC )
            .pipe( plumber( { errorHandler: notify.onError( "Error: <%= error.message %>" ) } ) )
            .pipe( changed( DEST ))
            .pipe( imagemin( {
                progressive: true
            }))
            .pipe( gulp.dest( DEST ));

        }

    })
    .filter( function( stream ) {
        return !!stream;
    });

    return merge( tasks );

});

////////////////////////////////////////////////////////////////////////
//                     FONTS PROCESSING PIPELINE                      //
////////////////////////////////////////////////////////////////////////

gulp.task('_fonts', 'Copy fonts to build', () => {

    let tasks = APPS.map( app => {

        if ( app.fonts ) {

            let SRC = app.fonts.src.map( source => {
                return app.baseDir + source;
            })
            let DEST = app.baseDir + app.buildLocations.fonts;

            return gulp.src( SRC )
            .pipe( plumber( { errorHandler: notify.onError( "Error: <%= error.message %>" ) } ) )
            .pipe( gulp.dest( DEST ) );

        }

    })
    .filter( function( stream ) {
        return !!stream;
    });

    return merge( tasks );

});

////////////////////////////////////////////////////////////////////////
//                             REVISIONS                              //
////////////////////////////////////////////////////////////////////////

gulp.task( '_rev', 'Revision styles and scripts', () => {

    let tasks = APPS.map( app => {

        if ( app.revisions ) {

            let SRC = app.revisions.src.map( source => {
                return app.baseDir + source;
            })
            let DEST = app.baseDir + app.revisions.dest;

            return gulp.src( SRC )
            .pipe( plumber( { errorHandler: notify.onError( "Error: <%= error.message %>" ) } ) )
			.pipe( gulpif(
				fs.exists( app.baseDir + app.buildLocations.css + app.revisions.cssFile ),
				wpRev( {
					css: app.baseDir + app.buildLocations.css + app.revisions.cssFile,
					cssHandle: app.revisions.cssHandle,
					js: app.baseDir + app.buildLocations.js + app.revisions.jsFile,
					jsHandle: app.revisions.jsHandle
            })))
            .pipe( gulp.dest( DEST ) );

        }

    })
    .filter( function( stream ) {
        return !!stream;
    });

    return merge( tasks );

});

////////////////////////////////////////////////////////////////////////
//                                POT                                 //
////////////////////////////////////////////////////////////////////////

gulp.task( '_pot', 'Generate translation file', () => {

    let tasks = APPS.map( app => {

        if ( app.pot ) {

            let SRC = app.pot.src.map( source => {
                console.log(app.baseDir + source);
                return app.baseDir + source;
            })
            let DEST = app.baseDir + app.pot.dest;

            return gulp.src( SRC )
            .pipe( plumber( { errorHandler: notify.onError( "Error: <%= error.message %>" ) } ) )
            .pipe( sort() )
            .pipe( wpPot( {
                domain: app.pot.domain,
                destFile: app.pot.destFile,
                package: app.pot.package,
                bugReport: app.pot.bugReport,
                lastTranslator: app.pot.lastTranslator,
                team: app.pot.team
            }))
            .pipe( gulp.dest( DEST ) );

        }

    })
    .filter( function( stream ) {
        return !!stream;
    });

    return merge( tasks );

});

////////////////////////////////////////////////////////////////////////
//                            BROWSERSYNC                             //
////////////////////////////////////////////////////////////////////////

gulp.task( '_browser-sync', 'Start up browser sync server', () => {

    if ( CONFIGS[0].server.proxy ) {

        browserSync.init({
            proxy: CONFIGS[0].server.proxy,
            port: CONFIGS[0].server.port,
            ui: {
                port: CONFIGS[0].server.ui.port
            },
            notify: CONFIGS[0].server.notify,
            logFileChanges: false
        });

    } else {

        browserSync.init({
            server: {
                baseDir: CONFIGS[0].server.baseDir
            },
            logFileChanges: false
        });

    }

});

gulp.task('_browser-sync-reload', 'Reload browsers connected to browser sync', () => {

    browserSync.reload();

});

////////////////////////////////////////////////////////////////////////
//                             STYLEGUIDE                             //
////////////////////////////////////////////////////////////////////////

gulp.task( '_styleguide', 'Generate a Nucleus Styleguide from scss', () => {

	let tasks = APPS.map( app => {

		let SRC = app.baseDir;

		if ( app.styleGuide ) {

			return gulp.src( SRC )
            .pipe( plumber( { errorHandler: notify.onError( "Error: <%= error.message %>" ) } ) )
			.pipe( shell( '( cd ' + SRC + ' ; npm run styleguide )', {
				errorMessage: 'Nucleus Styleguide failed.',
				quiet: true
			}));

		}

	});

});

////////////////////////////////////////////////////////////////////////
//                               CLEAN                                //
////////////////////////////////////////////////////////////////////////

gulp.task('_clean', 'Clean by removing any compiled files', () => {

    let tasks = APPS.map( app => {

        if ( app.buildLocations && app.buildLocations.clean ) {

            return del( app.baseDir + app.buildLocations.clean );

        }

    });

});

