var express = require('express');
var router = express.Router();
var morgan = require('morgan');
var fs = require('fs');
var path = require('path');
var multipart = require('connect-multiparty');
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
        console.log('前端只请求发送数据库数据');
        dbShowAllFiles(res);
    } else if (req.query.filename) {
        //阅读次数增一
        console.log('前端要求执行' + req.query.filename + '的阅读次数加一');
        dbAddReadTimes(req.query.filename);
        dbShowAllFiles(res);
    } else {
        res.sendFile(path.resolve('./' + 'public/images/' + req.params.what));
    }

});

// // 主要判断 自增 或 新增数据 的函数
// function dbAddReadTimes(obj, isPost, isReqResult, res) {
//     var addFileName = [];
//     var plusFileName = [];
//     var isHaveFileName = false;
//     // 连接数据库
//     MongoClient.connect('mongodb://192.168.0.118:27017/express', function(err, db) {
//         if (err) {
//             throw err;
//         }
//         var collection = db.collection('imgshowTimes');
//         // 查数据库中 图片显示次数的集合 的所有文档
//         collection.find().toArray(function(err, result) {
//             if (err) {
//                 console.error(err);
//             }
//             //console.log(result);
//             console.log('1');
//             // 遍历结果，查找是否有 该文件名的数据
//             for (let i = 0; i < result.length; i++) {
//                 if (result[i]['filename'] === obj.filename) {
//                     isHaveFileName = true;
//                     // 找到的话 放到自增数组中准备自增操作
//                     plusFileName.push(obj.filename);
//                 } else {
//                     //没找到的话说明 没有该文件名的数据
//                     isHaveFileName == false;
//                 }
//             }
//             console.log('2');
//             console.log(addFileName, plusFileName);
//             // 没有该文件名 则准备在数据库中增加该文件的数据
//             if (isHaveFileName == false) {
//                 addFileName.push(obj);
//             }
//             if (addFileName !== []) {
//                 addFileToDb(addFileName, db, res);
//             }
//             if (plusFileName !== [] && isPost === false) {
//                 plusReadTimes(plusFileName, db, res);
//             }
//             if (isPost === true) {
//                 dbShowAllFiles(res);
//             }
//             //db.close();
//         });
//     });
//     console.log(3);

// }
// --------阅读次数自增1----------
function dbAddReadTimes(filename) {
    // 连接数据库
    MongoClient.connect('mongodb://192.168.0.118:27017/express', function(err, db) {
        if (err) {
            throw err;
        }
        var collection = db.collection('imgshowTimes');
        //-----使存在的文件阅读次数加1------------
        console.log('执行自增一');
        db.collection('imgshowTimes').update({ 'filename': filename }, { $inc: { 'showTimes': 1 } }, 0, 1);

        // // 查数据库中 图片显示次数的集合 的所有文档
        // collection.find().toArray(function(err, result) {
        //     if (err) {
        //         console.error(err);
        //     }
        //     //console.log(result);
        //     console.log('1');
        //     // 遍历结果，查找是否有 该文件名的数据
        //     for (let i = 0; i < result.length; i++) {
        //         if (result[i]['filename'] === obj.filename) {
        //             isHaveFileName = true;
        //             // 找到的话 放到自增数组中准备自增操作
        //             plusFileName.push(obj.filename);
        //         } else {
        //             //没找到的话说明 没有该文件名的数据
        //             isHaveFileName == false;
        //         }
        //     }
        //     console.log('2');
        //     console.log(addFileName, plusFileName);
        //     // 没有该文件名 则准备在数据库中增加该文件的数据
        //     if (isHaveFileName == false) {
        //         addFileName.push(obj);
        //     }
        //     if (addFileName !== []) {
        //         addFileToDb(addFileName, db, res);
        //     }
        //     if (plusFileName !== [] && isPost === false) {
        //         plusReadTimes(plusFileName, db, res);
        //     }
        //     if (isPost === true) {
        //         dbShowAllFiles(res);
        //     }
        //     //db.close();
        // });
    });

}
//--------Post专用，往数据库中插入新值，有查询和插入操作--------
function addDataToDb(data, res) {
    var addFileName = [];

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
            //console.log(result);得到查询数据
            console.log('查找数据库成功，接下来开始判断要增加数据的条目');
            // 遍历结果，查找是否有 该文件名的数据
            if (data instanceof Array) {
                //上传列表是多个的话
                data.forEach(function(val, index) {
                    let isHaveFileName = false;
                    for (let i = 0; i < result.length; i++) {
                        if (result[i]['filename'] === val.filename) {
                            isHaveFileName = true;
                            // 找到的话 放到自增数组中准备自增操作
                        }
                    }
                    isHaveFileName ? null : addFileName.push(val);
                });

            } else {
                //上传文件数只有一个的话
                let isHaveFileName = false;
                for (let i = 0; i < result.length; i++) {
                    if (result[i]['filename'] === data.filename) {
                        isHaveFileName = true;
                        // 找到的话 放到自增数组中准备自增操作
                    }
                }
                isHaveFileName ? null : addFileName.push(data);
            }

            // for (let i = 0; i < result.length; i++) {
            //     if (result[i]['filename'] === obj.filename) {
            //         isHaveFileName = true;
            //         // 找到的话 放到自增数组中准备自增操作
            //         plusFileName.push(obj.filename);
            //     }
            // }
            console.log('新增条目判明成功，以下是要新增的条目：');
            console.log(addFileName);
            // 没有该文件名 则准备在数据库中增加该文件的数据
            if (addFileName !== []) {
                addFileToDb(addFileName, db, res);
            }
            setTimeout(() => dbShowAllFiles(res), 100);
            //db.close();
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
            console.log('获取ok');
            res.status(200).send(result);
        });
    });
}
//-----向数据库中增加数据-----------
function addFileToDb(arr, db, res) {
    for (let i = 0; i < arr.length; i++) {
        console.log('执行数据插入操作');
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

router.post('/images', multipart(), function(req, res) {
    //console.log(req.files);
    console.log(req.body);
    var filename,
        targetPath,
        // 定义根目录
        _dirname = path.resolve(path.dirname(''));
    //判断多文件上传情况
    if (req.files.files instanceof Array) {
        filename = [];
        req.files.files.forEach(function(val, index) {
            //get filename
            filename.push(val.originalFilename);
            // 定义放置图片的目录
            targetPath = _dirname + '/public/images/' + val.originalFilename;
            //copy file
            fs.createReadStream(val.path).pipe(fs.createWriteStream(targetPath));
        });


    } else {
        //get filename
        filename = req.files.files.originalFilename;
        // 定义放置图片的目录
        targetPath = _dirname + '/public/images/' + filename;
        //copy file
        fs.createReadStream(req.files.files.path).pipe(fs.createWriteStream(targetPath));
    }

    //打包数据
    function sendToDbData(filename, req) {
        if (filename instanceof Array) {
            let objs = [];
            filename.forEach(function(filename, index) {
                let obj = {
                    filename: filename,
                    imgTitle: (() => req.body.imgTitle ? req.body.imgTitle[index] : 'No name')(),
                    imgURL: './images/' + filename,
                    intro: (() => req.body.intro ? req.body.intro[index] : '')(),
                    uploader: (() => req.body.uploader ? req.body.uploader[index] : randomName().name)(),
                    uploaderHeadshot: (() => req.body.uploaderHeadshot ? req.body.uploaderHeadshot[index] : randomName().headshot)(),
                    uploadTime: createtimer(),
                }
                objs.push(obj);
            });
            return objs;
        } else {
            return {
                filename: filename,
                imgTitle: req.body.imgTitle || 'No name',
                imgURL: './images/' + filename,
                intro: req.body.intro,
                uploader: req.body.uploader || randomName().name,
                uploaderHeadshot: req.body.uploaderHeadshot || randomName().headshot,
                uploadTime: createtimer(),
            }
        }
    }

    let obj = sendToDbData(filename, req);

    //return file url
    //var imgfolder = 'public/images/';

    // let obj = {
    //     filename: filename,
    //     imgTitle: req.body.imgTitle,
    //     imgURL: './images/' + filename,
    //     intro: req.body.intro,
    //     uploader: req.body.uploader || randomName().name,
    //     uploaderHeadshot: req.body.uploaderHeadshot || randomName().headshot,
    //     uploadTime: createtimer(),
    // }


    //dbAddReadTimes(obj, true, true, res);
    addDataToDb(obj, res);

});
//-------------------------------------

module.exports = router;