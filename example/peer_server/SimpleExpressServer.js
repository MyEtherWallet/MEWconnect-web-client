const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const receiverPeerPath = path.resolve(__dirname, '../../example/receiver_Peer');
const initiatorPeerPath = path.resolve(__dirname, '../../example/initiator_Peer');
// ============= Routes =============
const router = express.Router();
const srcDir = path.resolve('..', 'etherwallet/dist');
/* GET home page. */
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
  // res.render('index', { title: 'Express' });
});

router.get('/initiator', (req, res) => {
  res.type('text/html');
  res.status(200);
  res.sendFile(path.join(initiatorPeerPath, 'index.html'));
});

router.get('/receiver', (req, res) => {
  res.type('text/html');
  res.status(200);
  res.sendFile(path.join(receiverPeerPath, 'index.html'));
});

router.get('/devSite', (req, res) => {
  res.type('text/html');
  res.status(200);
  res.sendFile(path.join(srcDir, 'index.html'));
});

router.get('/msgSign', (req, res) => {
  res.type('text/html');
  res.status(200);
  res.sendFile(path.join(srcDir, 'signmsg.html'));
});
// =========================

const app = express();


// view engine setup
app.set('views', __dirname);
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// console.log(process.env.LOGNAME);


app.use('/vendor', express.static(path.resolve(__dirname, '../../example/vendor')));
app.use('/src', express.static(path.resolve('../..')));
app.use('/browser', express.static(path.resolve(__dirname, '../../browser')));
app.use('/Initiator_Peer', express.static(initiatorPeerPath));
app.use('/Receiver_Peer', express.static(receiverPeerPath));

// My Ether Wallet Development Site (with MEW Connect Integration)
app.use('/images', express.static(path.join(srcDir, 'images')));
app.use('/css', express.static(path.join(srcDir, 'css')));
app.use('/js', express.static(path.join(srcDir, 'js')));
app.use('/fonts', express.static(path.join(srcDir, 'fonts')));

app.use('/', router);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
