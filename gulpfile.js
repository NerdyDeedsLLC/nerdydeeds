var DESIGN_MODE=true;

var PATHS = {
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

var gulp, notify, gulpFn, pipelogger, watch, changed, sass, babel, autoprefixer, runCLICmd, bs, reload, postcss, rucksack;

gulp         = require('gulp');
notify       = require("gulp-notify");
gulpFn       = require('gulp-fn');

watch        = require('gulp-watch');
changed      = require('gulp-changed');
sass         = require('gulp-sass');                            // gulp-sass is a very light-weight wrapper around node-sass, which in turn is a Node binding for libsass, which in turn is a port of Sass
babel        = require("gulp-babel");                           // Automatically converts ES6 code into CommonJS (http://bit.ly/vmu-gulp-babel)
autoprefixer = require('gulp-autoprefixer');                    // Applies prefixes for common and popular platforns and browsers (-ms-, -webkit-)
runCLICmd    = require('gulp-run-command').default;             // Allows for the execution of Bash shell commands from gulp.

postcss      = require('gulp-postcss');
rucksack     = require('rucksack-css');

bs           = require('browser-sync').create();                // TODO: Severs any instances already running?
//bs  = bs.create();                        // Instantiates and executes a perpetual comm link with the browser
reload       = bs.reload;

function cl(){
    console.log.apply(console, arguments);
}


var successMsgCount = 0;
var successMessages = ["ALL SUCCESS COMMENTARY:", "...Now dat's done.", "...Now dat is done also.", "...Dis here? Dis is def'nately doneded.", "...Dis too I have done.", "...Dat is also a ting I has done for you."];
function SUCCESS_MSG() {
    // console.log(successMessages[successMsgCount]);
    successMsgCount = (successMsgCount >= successMessages.length) ? 0 : successMsgCount + 1;
    return successMessages[successMsgCount];
}

var errorMsgCount = 0;
var errorMessages = ["ALL ERROR COMMENTARY:", "D'awwwwww, de boss ain't gonna like dis! We's gots errors!"];
var errorOutput = "";
function ERROR_MSG (errInput) {
    console.log(errorMessages[errorMsgCount]);
    console.log("Dis is what da compiley man said:\n", errInput);
    errorMsgCount = (errorMsgCount >= errorMessages.length) ? 0 : errorMsgCount + 1;
}

gulp.task('server', function() {
    if(DESIGN_MODE){
        bs.init({
            server: PATHS.html.dest,
        });
        bs.notify("<b>Server initialized.</b><br>Serving files from <ul><li>HTML: " + PATHS.html.dest + "</li><li>JS: " + PATHS.js.dest + "</li><li>CSS: " + PATHS.css.dest + "</li></ul>Watching for changes...", 5000);

        bs.watch(PATHS.html.source).on('change', bs.reload);
        bs.watch(PATHS.js.source).on('change', build_js);
        bs.watch(PATHS.js.dest).on('change', bs.reload);
        bs.watch(PATHS.css.source).on('change', build_css);
        bs.watch(PATHS.css.dest).on('change', bs.reload);
    }else{
        bs.init({
            proxy: 'http://localhost:8080',
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
    .pipe(bs.stream())
    .pipe(gulp.dest(PATHS.css.dest))
    .on('change', bs.reload);
}

function build_js(){
    return gulp.src(PATHS.js.source)
    .pipe(babel())
    .pipe(gulp.dest(PATHS.js.dest))
    .on('change', bs.reload);
}


gulp.task('css', function() {
    return build_css();
});


gulp.task('js', function() {
    return build_js();
}); 

gulp.task('default', gulp.parallel('css', 'js', 'server'));
