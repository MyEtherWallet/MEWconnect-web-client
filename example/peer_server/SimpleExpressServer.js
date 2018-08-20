const express = require('express')
const path = require('path')
// const favicon = require('serve-favicon');
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

// ============= Routes =============
const router = express.Router()
const srcDir = path.resolve('.', './example/etherwallet/dist')
/* GET home page. */
router.get('/', (req, res, next) => { // set mew site as default
  try {
    res.type('text/html')
    res.status(200)
    res.sendFile(path.join(srcDir, 'index.html'), function (error) {
      if (error) {
        next('file not found')
      }
    })
  } catch (e) {
    next('error')
  }
})

router.get('/signmsg', (req, res, next) => { // set mew site as default
  try {
    res.type('text/html')
    res.status(200)
    res.sendFile(path.join(srcDir, 'signmsg.html'), function (error) {
      if (error) {
        next('file not found')
      }
    })
  } catch (e) {
    next('error')
  }
})
const app = express()

// view engine setup
app.set('views', __dirname)
app.set('view engine', 'hbs')

// set up express
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// My Ether Wallet Development Site (with MEW Connect Integration)
app.use('/images', express.static(path.join(srcDir, 'images')))
app.use('/css', express.static(path.join(srcDir, 'css')))
app.use('/js', express.static(path.join(srcDir, 'js')))
app.use('/fonts', express.static(path.join(srcDir, 'fonts')))

app.use('/', router)

// catch 404
app.use((req, res, next) => {
  res.status(404)
  res.render('four-o-four', {message: 'Page Not Found'})
})

// final error handler
app.use((err, req, res) => {
  res.status(500) // .send({ message: 'Something Went Wrong' })
  res.render('error', { message: 'Something Went Wrong' })
})

module.exports = app
