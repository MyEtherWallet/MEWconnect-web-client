var express = require('express');
var router = express.Router();

var path = require('path');
let root = path.resolve("../..");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, "index.html"));
    // res.render('index', { title: 'Express' });
});

router.get('/peer1', function(req, res, next) {
    res.type("text/html");
    res.status(200);
    res.sendFile(path.join(root, "peer1/index.html"));
    // res.render('peer1', { title: 'Express' });
});

router.get('/peer2', function(req, res, next) {
    res.type("text/html");
    res.status(200);
    res.sendFile(path.join(root, "peer2/index.html"));
    // res.render('peer2', { title: 'Express' });
});

module.exports = router;
