var gulp = require('gulp'),
	sass = require('gulp-sass'),
	webserver = require('gulp-webserver');
gulp.task('sass', function () {
	return gulp.src('./css/*.scss')
		.pipe(sass({outputStyle:'expanded'}))
		.pipe(gulp.dest('./css'));
});
gulp.task('watch', function() {
	gulp.watch('./css/*.scss', ['sass']); 
});
gulp.task('webserver', function() {
	gulp.src('./')
		.pipe(webserver({
			livereload: true,
			directoryListing: true,
			open: true,
			fallback: 'index.html',
		}));
});