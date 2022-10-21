var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv')
var session = require('express-session')
var passport = require('passport')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login')
var apiRouter = require('./routes/api/api')
var db = require('./config/db')
var app = express();

db.connect((err)=>{
  if(err) throw err
  console.log('Database Connected Successfully')
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
dotenv.config({ path: './config/config.env'})
require('./config/passport')(passport)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var Port = process.env.PORT || 4000


//session handle
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
 
}))

//passport initialize
app.use(passport.initialize())
app.use(passport.session())

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter)
app.use('/api', apiRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});





app.listen(Port, (req,res)=>{
  console.log(`Application Running on PORT: ${Port}`)
})
