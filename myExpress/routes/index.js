var express = require('express');
var router = express.Router();
var morgan = require('morgan');
var fs = require('fs');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;

/* GET home page. */
// router.get('/', function(req, res, next) {
//     res.render('index', { title: 'Express' });
// });

router.use(function(req, res, next) {
    console.log('pass');
    next();
});
router.get('/', function(req, res) {
    res.render(express.static(path.join(__dirname, 'public')));
});
//------------------

// function addReadTimes(filename) {
//     (dataBase[filename]) ? (dataBase[filename]++) : (dataBase[filename] = 1);
//     console.log(dataBase);
// }

module.exports = router;