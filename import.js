/*
* name      import 做html公共模块导入操作
* by           haoxiaojun
* emal       mr_hao918512@126.com
* on           2016.7.13
*/
/*引入fs文件处理模块*/
var 
    fs = require("fs"),
    path = require("path");

/*页面路径：源路径，公共路径，目标路径*/
var 
    pagehtml = "src/page/",
    commonP = "src/common/",
    destP = "/dest/";

/*入口文件路径处理多入口，可应用于webpack多路径打包实现*/
var getEntry = function() {
    var htmlPath = path.resolve(pagehtml);
    var dirs = fs.readdirSync(htmlPath);
    var matchs = [],
        files = {};
    dirs.forEach(function(item) {
        matchs = item.match(/(.+)\.html$/);
        var _path = '';
        if (matchs) {
            _path = path.resolve(pagehtml, item);
            _path = _path.replace(/\\+/g, '/');
            files[matchs[1]] = _path;
        }
    });
    return files;
}
var fnImportExample = function( filenamePath,filename) {
    // 读取HTML页面数据
    // 使用API文档中的fs.readFile(filenamePath, [options], callback)
    fs.readFile(filenamePath, {
        // 需要指定编码方式，否则返回原生buffer
        encoding: 'utf8'
    }, function(err, data) {
        // 下面要做的事情就是把
        // <link rel="import" href="header.html">
        // 这段HTML替换成href文件中的内容
        // 可以求助万能的正则
        var dataReplace = data.replace(/<link\srel="import"\shref="(.*)">/gi, function(matchs, m1) {
            // m1就是匹配的路径地址了
            m1 = commonP+m1
            return fs.readFileSync(m1, {
                encoding: 'utf8'
            });
        });
        // 于是生成新的HTML文件
        var newDir = __dirname.replace(/\\+/g, '/')+destP;
        fs.writeFile(newDir+filename+".html", dataReplace, {
            encoding: 'utf8'
        }, function(err) {
            if (err) throw err;
            console.log(filenamePath + '生成成功！');
        });
    });
};
// 默认先执行一次
function start (){
    var filenameObj = getEntry()
     for (var i in filenameObj) {
        fnImportExample(filenameObj[i],i);
     }
}
start()

/*监控文件，变更后重新生成*/
fs.watch('./src/common/header.html' , function(event) {
    if (event == 'change') {
        console.log( 'header发生了改变，重新生成...');
        start()
    }
});
fs.watch('./src/common/footer.html' , function(event) {
    if (event == 'change') {
        console.log( 'footer发生了改变，重新生成...');
        start()
    }
});
// fs.watch('./src/common/' , function(event) {
//     if (event == 'change') {
//         console.log( '发生了改变，重新生成...');
//         start()
//     }
// });