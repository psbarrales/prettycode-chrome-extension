var gulp = require('gulp');
var sass = require('gulp-sass');
var copy = require('gulp-copy');
var uglifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var gutil = require('gulp-util');

// build File
var build = require('./build.json');


gulp.task('prepare', function(){
	return gulp.src('./src/vendor/highlightjs/styles/*.css').pipe(rename({
		extname: ".scss"
	})).pipe(gulp.dest('./src/highlightjs'));
});

gulp.task('sass', function(){
	return gulp.src('./src/scss/**/*.scss')
		.pipe(sass().on('error', function(err){
			console.error(gutil.colors.red(err));
			cb();
			return;
		}))
		//.pipe(gulp.dest('./build/styles/'))
		.pipe(uglifyCss({
			keepSpecialComments: 0
		}))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('./build/styles/'));
});

gulp.task('icon', function(){
	var icon = build.icons;
	return gulp.src(icon, {cwd: 'src'}).pipe(copy('build'));
});

gulp.task('manifest', function(){
	var manifest = build.manifest;
	return gulp.src([manifest], {cwd: 'src'}).pipe(rename({
		basename: "manifest",
		extname: ".json"
	})).pipe(copy('build'));

});

gulp.task('vendor', function(){
	var moves = [];
	for(i in build.vendor){
		moves.push(build.vendor[i]);
	}
	return gulp.src(moves, {cwd: 'src/vendor'}).pipe(copy('build/vendor'));
});

gulp.task('move', function(){
	var moves = [];
	for(i in build.move.html){
		moves.push(build.move.html[i]);
	}
	for(i in build.move.js){
		moves.push(build.move.js[i]);
	}
	return gulp.src(moves, {cwd: 'src'}).pipe(copy('build/'));
});

gulp.task('build', ['manifest', 'icon', 'vendor', 'sass', 'move'], function(){

});