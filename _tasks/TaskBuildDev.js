/**
 * Created by heyAaron on 2016/6/13.
 * DevTask
 */
var path = require('path');
var fs = require('fs');
function DevTask(gulp, plugins, conf) {
    var outputPath = conf.devPath;
    var cssPath = outputPath + '/css/';
    var jsPath = outputPath +'/js/';
    var imgPath = outputPath + '/imgs/';

    //jade2html

    var jade2htmlTask = function (source, outputPath) {
        var config = {//jadeTask配置
            pretty: true,//是否格式化
            data:{jsPath: outputPath}//html引入JS的路径
        };
        gulp.src('public/tpl/pages/' + source + '.jade')
            .pipe(plugins.jade(config))
            .pipe(gulp.dest('./dev/'))
    }
    gulp.task('jade2html', function () {
        /* 每次修改jade都是webpack任务带动jade2html任务执行,
         * 目的是把js路径传给jade模版进行正常引入js,
         * 这个地方待优化,jade发生变化时仅仅出发jade2html任务,
         * 让jade2html与webpack两个任务没有耦合
         */
        gulp.watch('public/tpl/**/*.jade')
            .on('change', function () {
                webpackTask()
            })
    })


    //Sass编译
    gulp.task('sass', function () {
        var sassTask = function(){
            gulp.src('public/sass/*.scss')
                .pipe(plugins.sass.sync().on('error', plugins.sass.logError))
                .pipe(gulp.dest(cssPath));
        }
        sassTask();
        gulp.watch('public/sass/*.scss').on('change', function () {
                sassTask();
        })
    });



    //图片移动
    gulp.task('moveImgsFile', function () {
        return gulp.src('./public/imgs/*/*')
            .pipe(gulp.dest(imgPath));

    })


    //webpack打包,打包生成js,以及jade2html操作
    function webpackTask() {
        var pageJsPath = './public/js/page/';//页面js根目录
        fs.readdir(pageJsPath, function (err, data) {
            var srcPath = data;//页面JS目录中所有目录数组
            for (var i = 0; i < srcPath.length; i++) {
                (function (i) {

                    //遍历所有目录进行处理
                    fs.exists(path.join(pageJsPath, srcPath[i] + '/index.js'), function (res) {
                        if (res == true) {
                            var sourcePath = path.join(pageJsPath, srcPath[i] + '/index.js');//打包前的目录
                            var outputPath = path.join(jsPath, srcPath[i]);//打包后的目录

                            gulp.src(sourcePath)
                                .pipe(plugins.webpack(require('./webpack.config.js')(srcPath[i],'dev')))
                                .pipe(gulp.dest(outputPath));


                            jade2htmlTask(srcPath[i], './js/'+srcPath[i]+'/index.js')
                        }
                    })
                })(i)
            }
        });
    }
    gulp.task('webpack', function () {
        webpackTask()
        gulp.watch('public/js/page/**/*.js').on('change', webpackTask)

    });








    //创建server服务
    gulp.task('connect', function () {
        var connect = require('connect');
        var app = connect()
            .use(require('connect-livereload')({port: 35729}))
            .use(connect.static('dev'))
            .use(connect.directory('dev'));

        require('http').createServer(app)
            .listen(conf.port)
            .on('listening', function () {
                console.log('Started connect web server on http://localhost:' + conf.port);
            });
    });
    //在浏览器中打开
    gulp.task('serve', ['connect'], function () {
        if (conf.autoOpenBrowser) {
            var opn = require('opn');
            opn('http://localhost:' + conf.port);
        }

    });
    //devTask
    gulp.task('dev', ['sass', 'webpack', 'jade2html','moveImgsFile', 'connect', 'serve'], function () {
        var server = plugins.livereload();
        gulp.watch(['dev/*.html', 'dev/css/*.css', 'dev/js/*.js'])
            .on('change', function (file) {
                server.changed(file.path);
            })
    });
}


module.exports = DevTask;