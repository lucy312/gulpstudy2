/**
 * Created by csm on 16/5/16.
 * 综合应用,添加版本号,格式为all.min.css?=460b0d7b0a
 */
'use strict';
var gulp = require('gulp'),
    jshint=require('gulp-jshint'),
    del = require('del'),
    sourceMaps=require('gulp-sourcemaps'),
    htmlMin=require('gulp-htmlmin'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    miniCSs = require('gulp-minify-css'),
    autoPre=require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    notify = require('gulp-notify'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector'),
    runSequence=require('gulp-run-sequence'),
    browserSync=require('browser-sync').create(),
    reload=browserSync.reload;


//删除文件
gulp.task('del', function () {
    del(['dist','rev']);                            //删除文件
});

//合并压缩css
gulp.task('css',function () {
    return gulp.src('src/css/*.css')
        .pipe(sourceMaps.init())
        .pipe(autoPre({
            browser:['last 2 versions'],
            cascade:true,  //是否美化属性
            remove:true    //是否去掉不必要的前缀
        }))
        .pipe(concat('all.min.css'))           //合并文件
        .pipe(miniCSs())                   //压缩css
        .pipe(rev())                        //文件名加MD5后缀
        .pipe(gulp.dest('dist/css'))
        .pipe(sourceMaps.write())
        .pipe(rename('all.debug.css'))       //重命名文件
        .pipe(gulp.dest('dist/css'))       //输出文件
        .pipe(rev.manifest())              //生成一个rev-mainfest.json文件
        .pipe(gulp.dest('rev/css'))            //将rev-mainfest.json文件保存到rev
});

//合并压缩js
gulp.task('js', function () {
    return gulp.src('src/js/*.js')
        .pipe(sourceMaps.init())
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('all.min.js'))
        .pipe(uglify())                     //压缩js文件
        .pipe(rev())
        .pipe(gulp.dest('dist/js'))
        .pipe(rename('all.debug.js'))
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('dist/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/js'))
});

//替换文件,压缩html
gulp.task('rev',['css','js','img'],function () {
    var options={
        removeComments:true,   //清除注释
        collapseWhitespace:true, //压缩html
        collapseBooleanAttributes:true,//省略布尔值的属性
        removeEmptyAttributes:true, //删除空值属性
        removeScriptTypeAttributes:true,//删除script标签的type属性
        removeStyleLinkTypeAttributes:true, //删除style和link标签的type属性
        minifyJS:true, //压缩页面js
        minifyCSS:true //压缩页面css
    } ;
    gulp.src(['rev/**/**/*', 'src/index.html'])   //读取rev-mainfest.json文件以及需要进行css名替换的文件
        .pipe(revCollector())               //执行文件内css名的替换
        .pipe(htmlMin(options))
        .pipe(gulp.dest('./dist'))
        .pipe(reload({stream:true}));             //替换后文件输出的目录
});

//图片压缩
gulp.task('img', function () {
    return gulp.src('src/imgs/*')
        .pipe(cache(imagemin(
            //{
            //optimizationLevel:5,  //类型：Number  默认：3  取值范围：0-7（优化等级）
            //progressive:true,     //类型：Boolean 默认：false 无损压缩jpg图片
            //interlaced:true,      //类型：Boolean 默认：false 隔行扫描gif进行渲染
            //multipass:true       //类型：Boolean 默认：false 多次优化svg直到完全优化
            //}
        )))
        .pipe(rev())
        .pipe(gulp.dest('dist/imgs'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/imgs'))
        .pipe(reload({stream:true}));
});

//静态服务器
gulp.task('server',function(){
   browserSync.init({
       server:{
           baseDir:'./dist'
       }
   }) ;
    gulp.watch(['src/**/*.{css,js}','src/imgs/**/*','src/index.html'],['rev']);
    gulp.watch(['./dist/**/*.{css,js}','./dist/imgs/**/*','./dist/*.html']).on('change',reload);
});

//默认任务
gulp.task('default', function (cb) {
    runSequence('del',['css', 'js', 'img'], 'rev','server');
});