var express = require('express');
var path = require('path');
var router = express.Router();

//:filename是匹配的名字，引用用req.params.filename
router.get('/images/:filename', function(req, res) {
    _dirname = path.resolve(path.dirname(''));
    console.log(_dirname);
    //---
    //    dbAddReadTimes(req.params.filename);
    //console.log(req.params.filename);
    //---
    res.download(_dirname + '/public/images/' + req.params.filename, 'img');
});

module.exports = router;