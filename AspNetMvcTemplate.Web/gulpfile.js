/// <binding />
"use strict";

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify");

var paths = {
    webroot: "./"
};

paths.js = paths.webroot + "js/**/*.js";
paths.minJs = paths.webroot + "js/**/*.min.js";
paths.css = paths.webroot + "css/**/*.css";
paths.editorJsDest = paths.webroot + "js/editor.min.js";
paths.concatJsDest = paths.webroot + "js/site.min.js";
paths.concatCssDest = paths.webroot + "css/site.min.css";

gulp.task("clean:js", function (cb) {
    rimraf(paths.concatJsDest, cb);
});

gulp.task("clean:css", function (cb) {
    rimraf(paths.concatCssDest, cb);
});

gulp.task("clean", ["clean:js", "clean:css"]);

gulp.task("min:js", ["clean:js"], function () {
    return gulp.src([
        "node_modules/jquery/dist/jquery.js",
        "node_modules/jquery-validation/dist/jquery.validate.js",
        "node_modules/jquery-validation/dist/localization/messages_ru.js",
        "node_modules/jquery-validation-unobtrusive/jquery.validate.unobtrusive.js",
        "Scripts/jquery.validate.unobtrusive.bootstrap.min.js",
        "node_modules/bootstrap/dist/js/bootstrap.js",
        "node_modules/knockout/build/output/knockout-latest.js",
        "node_modules/knockout.validation/dist/knockout.validation.js",
        "node_modules/knockout-validation/localization/ru-RU.js",
        "node_modules/toastr/build/toastr.min.js",
        "libs/magicsuggest/magicsuggest.js",
        "libs/magicsuggest/bindinghandlers.magicsuggest.js",
        "app/js/ko-extensions.js",
        "app/js/site-init.js",
        "app/js/site-utils.js",
        "app/js/controls/operationResult.js",
        "app/js/controls/busyIndicator.js",
        "app/js/controls/queryParams.js",
        "app/js/controls/serviceSettings.js",
        "app/js/controls/http.js",
        "app/js/controls/fileUploader.js",
        "app/js/site-api.js",
        "app/js/site-services.js",
        "app/js/site-viewmodels.js"
    ], { base: "." })
        .pipe(concat(paths.concatJsDest))
        .pipe(uglify()).on('error', function (err) { console.error('Error in min:js task', err.toString()); })
        .pipe(gulp.dest("."));
});

gulp.task("copy:fonts", function () {
    return gulp.src([
        "node_modules/font-awesome/fonts/**/*",
        "node_modules/bootstrap/fonts/**/*"
    ]).pipe(gulp.dest(paths.webroot + "/fonts/"));
});

gulp.task("min:css", ["clean:css"], function () {
    return gulp.src([
        "node_modules/bootstrap/dist/css/bootstrap.css",
        "node_modules/font-awesome/css/font-awesome.css",
        "node_modules/toastr/build/toastr.css",
        "libs/magicsuggest/magicsuggest.css",
        "app/css/site.css"])
        .pipe(concat(paths.concatCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

gulp.task("min", ["min:js", "min:css" ]);