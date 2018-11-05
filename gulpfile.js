var DESIGN_MODE=true;                                           // Enables browsersync's auto-refresh while in localhost

var PATHS = {                                                   // Paths to distro folders and locations
    'serverProxy': 'http://localhost:8080',
    'js' : {
        'source': '_js/**/*.js',
        'dest': 'public/lib/js/'
    },
    'css' : {
        'source': '_scss/**/*.scss',
        'dest': 'public/lib/css/'
    },
    'html' : {
        'source': './public/*.html',
        'dest': 'public/'
    }
};

var gulp, sass, babel, autoprefixer, shell, postcss, rucksack, bigBrother, runCLICmd;

gulp         = require('gulp');

sass         = require('gulp-sass');                            // Provides CSS PRE-processing (via a light-weight wrapper around node-sass, itself a Node binding for libsass/Sass)
babel        = require('gulp-babel');                           // Automatically converts ES6 code into CommonJS
autoprefixer = require('gulp-autoprefixer');                    // Applies prefixes for common and popular platforns and browsers (-ms-, -webkit-)
runCLICmd    = require('gulp-run-command').default;             // Allows for the execution of Bash shell commands directly from gulp.
shell        = require('gulp-shell');                           // Provides CSS POST-processing
postcss      = require('gulp-postcss');                         // Provides CSS POST-processing
rucksack     = require('rucksack-css');                         // CSS Post-processor rules (responsiveness, hex conversions, certain polyfills)

bigBrother   = require('browser-sync').create();                // TODO: Detect and terminate any instances already running?
 
// function cl(){
//     console.log.apply(console, arguments);
// }

gulp.task('server', function() {
    if(DESIGN_MODE){
        bigBrother.init({
            server: PATHS.html.dest,
        });
        bigBrother.notify('<b>Server initialized.</b><br>Serving files from <ul><li>HTML: ' + PATHS.html.dest + '</li><li>JS: ' + PATHS.js.dest + '</li><li>CSS: ' + PATHS.css.dest + '</li></ul>Watching for changes...', 5000);

        // Big Brother is watching you...
        bigBrother.watch(PATHS.html.source).on('change', bigBrother.reload);    // BrowserSync is comin' to town!
        bigBrother.watch(PATHS.js.source).on('change', build_js);               // He sees your code a-changin'
        bigBrother.watch(PATHS.js.dest).on('change', bigBrother.reload);        // He knows when changes pass!
        bigBrother.watch(PATHS.css.source).on('change', build_css);             // He can't recover from errors, 
        bigBrother.watch(PATHS.css.dest).on('change', bigBrother.reload);       // So be sure of your syntax!
    }else{
        bigBrother.init({
            proxy: PATHS.serverProxy,
        });
    }
});

function build_css(){
    var sassSettings = {
            outputStyle: 'expanded',
            errLogToConsole: true
        };
    var autoprefixerSettings = {
            browsers: 'last 2 versions'
        };
    var rucksackSettings = {
            responsiveType:    true,    // Def: true
            shorthandPosition: true,    // Def: true
            quantityQueries:   true,    // Def: true
            alias:             true,    // Def: true
            inputPseudo:       true,    // Def: true
            clearFix:          true,    // Def: true
            fontPath:          true,    // Def: true
            hexRGBA:           true,    // Def: true
            easings:           true,    // Def: true
            fallbacks:         false,   // Def: false
            autoprefixer:      false    // Def: false
        };


    return gulp.src(PATHS.css.source)
    .pipe(sass(sassSettings).on('error', sass.logError))
    .pipe(postcss([ rucksack(rucksackSettings) ]))
    .pipe(autoprefixer(autoprefixerSettings))
    .pipe(bigBrother.stream())
    .pipe(gulp.dest(PATHS.css.dest))
    .on('change', bigBrother.reload);
}

function build_js(){
    return gulp.src(PATHS.js.source)
    .pipe(babel())
    .pipe(gulp.dest(PATHS.js.dest))
    .on('change', bigBrother.reload);
}


gulp.task('css', function() {
    return build_css();
});


gulp.task('js', function() {
    return build_js();
}); 

const shellSettings = {
    PATH: process.env.PATH,
    verbose: true,
    shell: '/usr/local/Cellar/bash/4.4.23/bin/bash'
};

gulp.task('cleanup', function(){
    return gulp.src('*.js', {read: false})
      .pipe(shell([
        'killall gulp && killall open && echo "Purged all instances of gulp, node, and open."'
       // 'killall gulp && killall node && killall open && echo "Purged all instances of gulp, node, and open."'
      ], shellSettings));
});
gulp.task('greet', shell.task('echo Hello, World!'));
gulp.task('default', gulp.parallel('greet', 'css', 'js', 'server'));
