/**
 * Created by admin-b on 2016/4/28.
 * fas
 */
var gulp = require('gulp'),
    useref = require('gulp-useref');

gulp.task('default', function () {
    return gulp.src('app/*.html')
        .pipe(useref({ searchPath: '.tmp' }))
        .pipe(gulp.dest('dist'));
});