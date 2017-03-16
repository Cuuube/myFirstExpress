var express = require('express');
var router = express.Router();
var morgan = require('morgan');
var fs = require('fs');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;

router.get('/', function(req, res) {
    res.render(express.static(path.join(__dirname, 'public/photos/index.html')));
});
router.get('/images/:what', function(req, res) {
    console.log('-----' + req.params.what);
    console.log(req.query);
    if (req.query.filename) {
        dbAddReadTimes(req.query.filename, false);
        dbShowAllFiles(res);

    } else {
        //_dirname = path.resolve(path.dirname(''));
        //console.log(path.resolve('../' + 'public/photos/' + req.params.what));
        //dbAddReadTimes(req.params.what);
        res.sendFile(path.resolve('./' + 'public/images/' + req.params.what));
        //res.render('aaaa' + req.params.what);
    }

});

// 主要判断 自增 或 新增数据 的函数
function dbAddReadTimes(filename, isPost) {
    // 连接数据库
    MongoClient.connect('mongodb://192.168.0.118:27017/express', function(err, db) {
        if (err) {
            throw err;
        }
        var collection = db.collection('imgshowTimes');
        // 
        var addFileName = [];
        var plusFileName = [];
        var isHaveFileName = false;
        // 查数据库中 图片显示次数的集合 的所有文档
        collection.find().toArray(function(err, result) {
            if (err) {
                console.error(err);
            }
            //console.log(result);
            console.log('1');
            // 遍历结果，查找是否有 该文件名的数据
            for (let i = 0; i < result.length; i++) {
                if (result[i]['filename'] === filename) {
                    isHaveFileName = true;
                    // 找到的话 放到自增数组中准备自增操作
                    plusFileName.push(filename);
                } else {
                    //没找到的话说明 没有该文件名的数据
                    isHaveFileName == false;
                }
            }
            console.log('2');
            // 没有该文件名 则准备在数据库中增加该文件的数据
            if (isHaveFileName == false) {
                addFileName.push(filename);
            }
            //console.log(addFileName);
            //console.log(plusFileName);
            console.log('3');
            // 读取新增数据列表数组，将成员增加到数据库中
            for (let i = 0; i < addFileName.length; i++) {
                console.log('insert start');
                console.log(addFileName[i]);
                db.collection('imgshowTimes').insert({ 'filename': addFileName[i], 'showTimes': 0 }, function(err) {
                    console.log('insert ok');
                    db.close();
                });
            }
            if (isPost === false) {
                // 读取已存在的数组列表，将该列表中的文件的显示次数自增1
                for (let i = 0; i < plusFileName.length; i++) {
                    console.log('plus start');
                    console.log(plusFileName[i]);
                    db.collection('imgshowTimes').update({ 'filename': plusFileName[i] }, { $inc: { 'showTimes': 1 } }, 0, 1,
                        function(err) {
                            console.log('insert ok');
                            db.close();
                        });
                }
            }
            console.log('4');

        });
    });
}

//--------------------------
// 查询数据库全部资料的函数
function dbShowAllFiles(res) {
    // 连接数据库
    MongoClient.connect('mongodb://192.168.0.118:27017/express', function(err, db) {
        if (err) {
            throw err;
        }
        var collection = db.collection('imgshowTimes');
        // 查数据库中 图片显示次数的集合 的所有文档
        collection.find().toArray(function(err, result) {
            if (err) {
                console.error(err);
            }
            res.status(200).send(result);

        });
    });
}

//--------------------------


// ------服务器重组文件并上传——-------
var multipart = require('connect-multiparty');
router.post('/images', multipart(), function(req, res) {
    //console.log(req.files);
    //console.log(req.body);
    //get filename
    var filename = req.files.files.originalFilename;
    // 定义根目录
    _dirname = path.resolve(path.dirname(''));
    // 定义放置图片的目录
    var targetPath = _dirname + '/public/images/' + filename;
    //copy file
    fs.createReadStream(req.files.files.path).pipe(fs.createWriteStream(targetPath));

    dbAddReadTimes(filename, true);
    console.log('-----req.body---------');
    console.log(req.body);
    //return file url
    var imgfolder = 'public/images/';
    res.json({
        code: 200,
        msg: {
            url: 'http://' + req.headers.host + '/' + imgfolder + filename,

        }
    });
    //console.log(targetPath);
    //res.sendFile(targetPath);
});
//-------------------------------------

module.exports = router;