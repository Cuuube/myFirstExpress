var MongoClient = require('mongodb').MongoClient;



MongoClient.connect('mongodb://192.168.0.118:27017/express', function(err, db) {
    if (err) {
        throw err;
    }
    var collection = db.collection('imgshowTimes');
    var data = { 'img1': '1', 'img2': '5' };
    // 查
    collection.find().toArray(function(err, result) {
        if (err) {
            throw err;
        }
        console.log(result);
        result.forEach(function(data) {
            if (data['img1']) {
                console.log(data['img1']);
            }
        });
    });
    // 增
    // collection.insert(data, function(err, result) {
    //     if (err) {
    //         console.error('error', err);
    //         return;
    //     }
    // console.log('insert ok')
    // });
    // 改
    // collection.update({ 'img1': 99 }, { $set: { 'img1': 89 } }, function(err, result) {
    // if (err) {
    //     throw err;
    // }
    //  console.log('update ok');
    // });
    // 删
    // collection.remove({ 'img1': 89 }, function(err, result) {
    //     if (err) {
    //         throw err;
    //     }
    //     console.log('remove ok');
    // });
    db.close();
});