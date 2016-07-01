/**
 * Created by heyAaron on 2016/6/13.
 * DevTask
 */
var path = require('path');
var fs = require('fs');
var minimist = require('minimist');
var rimraf = require('rimraf');
function DevTask(gulp, plugins, conf) {
<<<<<<< HEAD
    var outputPath = conf.devPath;
    var cssPath = outputPath + 'css/';
    var jsPath = outputPath +'js/';
    var imgPath = outputPath + 'imgs/';
=======
    var outputPath = conf.devOutputPath;
    var cssPath = outputPath + '/css/';
    var jsPath = outputPath + '/js/';
    var imgPath = outputPath + '/imgs/';
    //创建新页面，依次会创建scss、js、jade
    gulp.task('newpage', function () {
        var name = minimist(process.argv.slice(2)).name;
        if(name == undefined){
            console.error('命名不合法');
            return ;
        }
        fs.exists('./public/sass/' + name + '.scss', function (exists) {
            if (exists) {
                console.error('文件已存在');
            } else {
                fs.writeFile('./public/sass/' + name + '.scss','', 'utf8')
                fs.readFile('./_tasks/_sample/jade', 'utf8', function (err, content) {
                    if (err) console.log(err);
                    fs.writeFile('./public/tpl/pages/' + name + '.jade', content, 'utf8')
                })
                fs.mkdir('./public/js/page/' + name, function () {
                    fs.writeFile('./public/js/page/' + name + '/index.js', '', 'utf8')
                })
            }
        })

    });
>>>>>>> refs/remotes/origin/master

    //jade2html

    var jade2htmlTask = function (source, jsPath) {
        var config = {//jadeTask配置
            pretty: true,//是否格式化
<<<<<<< HEAD
            data:{jsPath: jsPath}//html引入JS的路径
=======
            data: {jsPath: outputPath}//html引入JS的路径
>>>>>>> refs/remotes/origin/master
        };
        gulp.src('public/tpl/pages/' + source + '.jade')
            .pipe(plugins.jade(config))
            .pipe(gulp.dest(outputPath))
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
        var sassTask = function () {
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
                                .pipe(plugins.webpack(require('./webpack.config.js')(srcPath[i])))
                                .pipe(gulp.dest(outputPath));
                            jade2htmlTask(srcPath[i], './js/' + srcPath[i] + '/index.js')
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
    //移除dev目录
    gulp.task('rmdev',function(cb){
       return rimraf('./dev',cb);
    })
    //devTask
    gulp.task('dev', ['sass', 'webpack', 'jade2html', 'moveImgsFile', 'serve', 'connect'], function () {
        var server = plugins.livereload();
        gulp.watch(['dev/*.html', 'dev/css/*.css', 'dev/js/*.js'])
            .on('change', function (file) {
                server.changed(file.path);
            })
    });
}


module.exports = DevTask;