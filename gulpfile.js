'use strict';
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('concat', function() {
  gulp.src('./public/javascripts/**/*.js')
  .pipe(sourcemaps.init())
  .pipe(concat('bundle.js'))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('public'));
});

gulp.task('default', function(){
  gulp.watch('./public/javascripts/**.js', ['concat']);
});
