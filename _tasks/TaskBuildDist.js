/**
 * Created by admin-b on 2016/6/13.
 * OutputTask
 */
function OutputTask(gulp, plugins) {
    gulp.task('moveCssFile', function () {
        return gulp.src('./public/css/*')
            .pipe(gulp.dest('./output/css/'));
    })
    gulp.task('moveImgsFile', function () {
        gulp.src('./public/imgs/*/*')
            .pipe(gulp.dest('./output/imgs/'));

    })
    gulp.task('build', ['moveCssFile', 'moveImgsFile'], function () {
        gulp.src('./output/css/*.css')
            .pipe(plugins.cssSpritesmith({
                imagepath: './output/imgs/slice/',
                spritedest: './output/imgs/sprite/',
                spritepath: '../imgs/sprite/'
            }))
            .pipe(gulp.dest('./'));
    });

}


module.exports = OutputTask;