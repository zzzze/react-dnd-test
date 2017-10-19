require("babel-register");
const gulp = require('gulp');
const express = require('gulp-dev-express');
const notify = require('gulp-notify');
const clean = require('gulp-clean');
const webpack = require('webpack-stream');

// script合并，压缩文件
gulp.task('script', function() {
    const config = process.env.NODE_ENV == 'development'
        ? require('./webpack.config.babel.js')
        : require('./webpack.config.prod.babel.js');

    return gulp.src('src/index.js')
        .pipe(webpack(config))
        .pipe(gulp.dest('dist'))
        .pipe(notify({ message: 'script task complete' }));
});

// clean
gulp.task('clean', function() {
    return gulp.src(['dist/*'], {read: false})
        .pipe(clean())
        .pipe(notify({ message: 'clean task complete' }));
});

// watch
gulp.task('watch', function () {
    gulp.watch('src/**/*.js', express('server.js'));
    gulp.watch('src/**/*.js', ['script']);
});

// server
gulp.task("server", function () {
    express('server.js');
});

// dev
gulp.task('dev', ['clean'],  function () {
    process.env.NODE_ENV = 'development';
    gulp.start('watch', 'script');
});

// build
gulp.task('build', ['clean'], function() {
    process.env.NODE_ENV = 'production';
    gulp.start('script');
});

// default
gulp.task('default', function() {
    gulp.start('dev');
});


