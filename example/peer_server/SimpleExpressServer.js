var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// var index = require('./routes');
console.log(process.cwd())
let receiverPeerPath = path.join(path.resolve("."), "example", 'receiver_Peer');
let initiatorPeerPath = path.join(path.resolve("."), "example", 'initiator_Peer');
// ============= Routes =============
var router = express.Router();
let root = path.resolve("../..");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, "index.html"));
    // res.render('index', { title: 'Express' });
});

router.get('/initiator', function (req, res, next) {
    res.type("text/html");
    res.status(200);
    res.sendFile(path.join(initiatorPeerPath, "index.html"));
});

router.get('/receiver', function (req, res, next) {
    res.type("text/html");
    res.status(200);
    res.sendFile(path.join(receiverPeerPath, "index.html"));
});
// =========================

var app = express();

// view engine setup
app.set('views', __dirname);
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
// console.log(process.env.LOGNAME);


app.use("/vendor", express.static(path.join(path.resolve("."), "example", 'vendor')));
app.use("/src", express.static(path.resolve(".")));
app.use("/Initiator_Peer", express.static(initiatorPeerPath));
app.use("/Receiver_Peer", express.static(receiverPeerPath));

app.use('/', router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
