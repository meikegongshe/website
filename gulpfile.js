var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    webpack = require('gulp-webpack'),
    replace = require('gulp-replace'),
    rev = require('gulp-rev');

var jsSrc = 'templates/javascripts/',
    jsDest = 'public/javascripts/',
    cssSrc = 'templates/styles/',
    cssDest = 'public/styles/';

require('dotenv').config();

gulp.task('style', function () {
    gulp.src(cssSrc + 'aui/*')
        .pipe(gulp.dest(cssDest + 'aui'));

    gulp.src(cssSrc + 'app.css')
        .pipe(gulp.dest(cssDest));
})

gulp.task('javascript', function () {
    var src = gulp.src(jsSrc + 'aui/*')
        .pipe(gulp.dest(jsDest + 'aui'));

    // app.js
    src = gulp.src(jsSrc + 'app.js')
        .pipe(webpack({
            module: {
                loaders: [
                    {test: /\.css$/, loader: 'style!css'},
                ]
            },
            output: {
                filename: 'app.js'
            }
        }));

    if (process.env.NODE_ENV === 'production') {
        src = src.pipe(uglify({
            //mangle: true,//类型：Boolean 默认：true 是否修改变量名
            mangle: {except: ['require', 'exports', 'module', '$']}    //排除混淆关键字
        }));
    }

    src.pipe(gulp.dest(jsDest));

    // appmng.js
    src = gulp.src(jsSrc + 'appmng.js')
        .pipe(webpack({
            module: {
                loaders: [
                    {test: /\.css$/, loader: 'style!css'},
                ]
            },
            output: {
                filename: 'appmng.js'
            }
        }));

    if (process.env.NODE_ENV === 'production') {
        src = src.pipe(uglify({
            //mangle: true,//类型：Boolean 默认：true 是否修改变量名
            mangle: {except: ['require', 'exports', 'module', '$']}    //排除混淆关键字
        }));
    }

    src.pipe(gulp.dest(jsDest));
});

gulp.task('build', ['style', 'javascript']);