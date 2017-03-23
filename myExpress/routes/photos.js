var express = require('express');
var router = express.Router();
var morgan = require('morgan');
var fs = require('fs');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;

router.get('/', function(req, res) {
    res.render(express.static(path.join(__dirname, 'public/photos/index.html')));
});

// router.get('/action/:what', function(req, res) {
//     console.log('-----' + req.params.what);
//     console.log(req.query);
//     //阅读次数增一
//     console.log('!readplus');
//     dbAddReadTimes({ 'filename': req.query.filename }, false, false, res);
//     dbShowAllFiles(res);
// });

// router.get('/addlikes/:what', function(req, res) {
//     console.log('-----' + req.params.what);
//     console.log(req.query);
//     //阅读次数增一
//     console.log('!likesplus');
//     dbAddReadTimes({ 'filename': req.query.filename }, false, false, res);
//     dbShowAllFiles(res);
// });

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
        dbAddReadTimes({ 'filename': req.query.filename }, false, false, res);
        dbShowAllFiles(res);
    } else {
        res.sendFile(path.resolve('./' + 'public/images/' + req.params.what));
    }

});

// 主要判断 自增 或 新增数据 的函数
function dbAddReadTimes(obj, isPost, isReqResult, res) {
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
                if (result[i]['filename'] === obj.filename) {
                    isHaveFileName = true;
                    // 找到的话 放到自增数组中准备自增操作
                    plusFileName.push(obj.filename);
                } else {
                    //没找到的话说明 没有该文件名的数据
                    isHaveFileName == false;
                }
            }
            console.log('2');
            console.log(addFileName, plusFileName);
            // 没有该文件名 则准备在数据库中增加该文件的数据
            if (isHaveFileName == false) {
                addFileName.push(obj);
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
        db.collection('imgshowTimes').insert({
            'filename': arr[i].filename,
            'imgTitle': arr[i].imgTitle,
            'imgURL': arr[i].imgURL,
            'intro': arr[i].intro,
            'uploader': arr[i].uploader,
            'uploaderHeadshot': arr[i].uploaderHeadshot,
            'uploadTime': arr[i].uploadTime,
            'likes': 0,
            'cmnt': 0,
            'showTimes': 0,
        });
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

//------------
function createtimer() {
    var month = {
        '0': 'January',
        '1': 'February',
        '2': 'March',
        '3': 'April',
        '4': 'May',
        '5': 'June',
        '6': 'July',
        '7': 'August',
        '8': 'September',
        '9': 'October',
        '10': 'November',
        '11': 'December',
    }
    var time = new Date();
    var str = month[time.getMonth()] + ' ' + time.getDay() + ', ' + time.getFullYear();
    return str;
}
//-----------------------
function randomName() {
    let personNames = {
        '0': 'Joan Joule',
        '1': 'Andy Partridge',
        '2': 'Bill Wilson',
        '3': 'Nelly Ferguson',
        '4': 'Maria Hubbard',
        '5': 'Truman Jackson',
        '6': 'Evan Ezekiel',
        '7': 'Primo Walton',
        '8': 'Chloe Tommy',
        '9': 'Winston Camp'
    }
    let personHeadshot = '../../images/heads/' + Math.floor(10 * Math.random()) + '.png';
    let obj = {
        name: personNames[Math.floor(10 * Math.random())],
        headshot: personHeadshot,
    };
    return obj;
};
// ------服务器重组文件并上传——-------
var multipart = require('connect-multiparty');
router.post('/images', multipart(), function(req, res) {
    //console.log(req.files);
    console.log(req.body);
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
    //打包数据
    let obj = {
        filename: filename,
        imgTitle: req.body.imgTitle,
        imgURL: './images/' + filename,
        intro: req.body.intro,
        uploader: req.body.uploader || randomName().name,
        uploaderHeadshot: req.body.uploaderHeadshot || randomName().headshot,
        uploadTime: createtimer(),
    }


    dbAddReadTimes(obj, true, true, res);

});
//-------------------------------------

module.exports = router;