# gulp
##### 本案例跟gulpstudy1相比，只是改进了一下版本控制的方式，如之前是这样的 
> "/css/style.css" => "/dist/css/style-1d87bebe.css"    
> "/js/script1.js" => "/dist/script1-61e0be79.js"    
> "cdn/image.gif"  => "//cdn8.example.dot/img/image-35c3af8134.gif"
+>
##### 但是由于公司发布系统限制，如果用上面方法实现，每次更新都会积压过多过期无用的文件，我们预期效果是
+>
> "/css/style.css" => "/dist/css/style.css?v=1d87bebe"
> "/js/script1.js" => "/dist/script1.js?v=61e0be79"
> "cdn/image.gif"  => "//cdn8.example.dot/img/image.gif?v=35c3af8134"

###### 方法就是改gulp-rev 和 gulp-rev-collector 两个插件

1. 打开node_module/gulp-rev/index.js
    - 大约138行处：manifest[originalFile] = revisionedFile;
    - 改为：manifest[originalFile] = originalFile + '?=' + file.revHash;

1. 打开node_modeule/rev-path/index.js
    - 第10行：return filename + '-' + hash + ext;
    - 改为：return filename + ext;

1. 打开node_module/gulp-rev-collector/index.js
    - 第31行：if ( path.basename(json[key]).replace(new RegExp( opts.revSuffix ), '' ) !==  path.basename(key) ) { isRev = 0;}
    - 改为：if ( path.basename(json[key]).split('?')[0] !==  path.basename(key) ) { isRev = 0;}

