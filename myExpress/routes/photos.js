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
    if (req.params.what === 'getImgData') {
        //只获得数据库数据
        console.log('!getData');
        dbShowAllFiles(res);
    } else if (req.query.filename) {
        //阅读次数增一
        console.log('!readplus');
        dbAddReadTimes(req.query.filename, false, false, res);
        dbShowAllFiles(res);
    } else {
        res.sendFile(path.resolve('./' + 'public/images/' + req.params.what));
    }

});

// 主要判断 自增 或 新增数据 的函数
function dbAddReadTimes(filename, isPost, isReqResult, res) {
    var addFileName = [];
    var plusFileName = [];
    var isHaveFileName = false;
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
            console.log(addFileName, plusFileName);
            // 没有该文件名 则准备在数据库中增加该文件的数据
            if (isHaveFileName == false) {
                addFileName.push(filename);
            }
            if (addFileName !== []) {
                addFileToDb(addFileName, db, res);
            }
            if (plusFileName !== [] && isPost === false) {
                plusReadTimes(plusFileName, db, res);
            }
            if (isPost === true) {
                dbShowAllFiles(res);
            }
            //db.close();
        });
    });
    console.log(3);

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
            console.log('获取ok');
            res.status(200).send(result);
        });
    });
}
//-----向数据库中增加数据-----------
function addFileToDb(arr, db, res) {
    for (let i = 0; i < arr.length; i++) {
        console.log('insert start');
        console.log(arr[i]);
        db.collection('imgshowTimes').insert({ 'filename': arr[i], 'showTimes': 0 });
    }
}
//-----使存在的文件阅读次数加1------------
function plusReadTimes(arr, db, res) {
    for (let i = 0; i < arr.length; i++) {
        console.log('plus start');
        console.log(arr[i]);
        db.collection('imgshowTimes').update({ 'filename': arr[i] }, { $inc: { 'showTimes': 1 } }, 0, 1);
    }
}

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

    //return file url
    var imgfolder = 'public/images/';

    dbAddReadTimes(filename, true, true, res);
    //----------------------
    // 连接数据库
    // MongoClient.connect('mongodb://192.168.0.118:27017/express', function(err, db) {
    //     if (err) {
    //         throw err;
    //     }
    //     var collection = db.collection('imgshowTimes');
    //     // 
    //     var addFileName = [];
    //     var plusFileName = [];
    //     var isHaveFileName = false;
    //     // 查数据库中 图片显示次数的集合 的所有文档
    //     collection.find().toArray(function(err, result) {
    //         if (err) {
    //             console.error(err);
    //         }
    //         //console.log(result);
    //         console.log('1');
    //         // 遍历结果，查找是否有 该文件名的数据
    //         for (let i = 0; i < result.length; i++) {
    //             if (result[i]['filename'] === filename) {
    //                 isHaveFileName = true;
    //                 // 找到的话 放到自增数组中准备自增操作
    //                 plusFileName.push(filename);
    //             } else {
    //                 //没找到的话说明 没有该文件名的数据
    //                 isHaveFileName == false;
    //             }
    //         }
    //         console.log('2');
    //         // 没有该文件名 则准备在数据库中增加该文件的数据
    //         if (isHaveFileName == false) {
    //             addFileName.push(filename);
    //         }
    //         //console.log(addFileName);
    //         //console.log(plusFileName);
    //         console.log('3');
    //         // 读取新增数据列表数组，将成员增加到数据库中
    //         for (let i = 0; i < addFileName.length; i++) {
    //             console.log('insert start');
    //             console.log(addFileName[i]);
    //             db.collection('imgshowTimes').insert({ 'filename': addFileName[i], 'showTimes': 0 }, function(err) {
    //                 console.log('insert ok');
    //                 db.close();
    //             });
    //         }
    //         dbShowAllFiles(res);
    //         console.log('4');


    //     });
    // });
    //----------------------
    // res.json({
    //     code: 200,
    //     msg: {
    //         url: 'http://' + req.headers.host + '/' + imgfolder + filename,

    //     }
    // });
    //console.log(targetPath);
    //res.sendFile(targetPath);
});
//-------------------------------------

module.exports = router;