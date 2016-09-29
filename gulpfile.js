"use strict";

var browserSync   = require("browser-sync");
var reload        = browserSync.reload;
var gulp          = require("gulp");
var jade          = require("gulp-jade");
var plumber       = require("gulp-plumber");
var postcss       = require("gulp-postcss");
var autoprefixer  = require("autoprefixer");
var precss        = require("precss");
var cssnano       = require("cssnano");
var sprites       = require("postcss-sprites");
var mqpacker      = require("css-mqpacker");//Группирует медиазапросы и помещает их в конец CSS документа.
var fontsMagician = require('postcss-font-magician');

var paths = {
    "styles": {
        "src"   : "src/styles/*.css",
        "watch" : "src/styles/**/*.css",
        "build" : "build/styles"
    },
    "jade": {
        "src"   : "src/jade/pages/*.jade",
        "watch" : "src/jade/**/*.jade",
        "build" : "build"
    },
    "sprites": {
        "stylesheetPath": "build/styles/style.css",
        "spritePath": "build/img/sprites"
    },
    "images": {
        "src"   : "src/img/img/*",
        "build" : "build/img/"
    },
    "js": {
        "src"   : "src/js/*.js",
        "watch" : "src/js/**/*.js",
        "build" : "build/js/"
    },
    "browserSync" : { //модуль отвечает за обновленеие сайта
         "baseDir" : 'app', 
         "watchPaths" : ['build/*.html', 'build/styles/**/*css', 'build/js/**/*.js'] 
       },
    "build" : "build"
};

gulp.task("styles", function () {
    var processors = [
        precss,
        sprites(paths.sprites),
        autoprefixer,
        mqpacker,
        fontsMagician({}),
        cssnano
    ];
    return gulp.src(paths.styles.src)
        .pipe(plumber())
        .pipe(postcss(processors))
        .pipe(gulp.dest(paths.styles.build))
        .pipe(reload({stream:true}));
});

gulp.task("jade", function () {
    return gulp.src(paths.jade.src)
        .pipe(plumber())
        .pipe(jade({
            pretty: "\t"
        }))
        .pipe(gulp.dest(paths.jade.build))
        .pipe(reload({stream:true}));
});

gulp.task("images", function () {
    return gulp.src(paths.images.src)
        .pipe(plumber())
        .pipe(gulp.dest(paths.images.build))
        .pipe(reload({stream:true}));
});

gulp.task("js", function () {
    return gulp.src(paths.js.src)
        .pipe(plumber())
        .pipe(gulp.dest(paths.js.build))
        .pipe(reload({stream:true}));
});

gulp.task("browserSync", function() {
    browserSync({
        server: {
            baseDir: paths.build
        }
    });
});

gulp.task ("watch", function(){
    gulp.watch(paths.styles.watch, ["styles"]);
    gulp.watch(paths.jade.watch, ["jade"]);
    gulp.watch(paths.js.watch, ["js"]);
    gulp.watch(paths.images.src, ["images"]);
    gulp.watch(paths.browserSync.watchPaths).on('change', browserSync.reload); 
});

gulp.task("default", ["browserSync", "styles", "jade", "js", "watch"]);