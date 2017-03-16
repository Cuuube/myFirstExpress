var gulp = require('gulp'),
    sass = require('gulp-sass'),
    webserver = require('gulp-webserver');
gulp.task('sass', function() {
    return gulp.src('./myExpress/public/photos/style/*.scss')
        .pipe(sass({ outputStyle: 'expanded' }))
        .pipe(gulp.dest('./myExpress/public/photos/style'));
});
gulp.task('watch', function() {
    gulp.watch('./myExpress/public/photos/style/*.scss', ['sass']);
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