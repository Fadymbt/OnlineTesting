const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const createError = require('http-errors');
const bodyParser = require('body-parser');
const sessions = require('express-session');

const indexRouter = require('./routes/index');
const candidatesRouter = require('./routes/candidates');
const humanResourcesRouter = require('./routes/humanResources');
const typesRouter = require('./routes/types');
const examRouter = require('./routes/exams');

const app = express();

app.use(cookieParser());
app.use(sessions({
  secret: 'This is a secret',
  resave: false,
  saveUninitialized : false,
  cookie: { maxAge: 60 * 60 * 24 * 30 }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/stylesheets', express.static(__dirname + '/public/stylesheets/'));
app.use('/javascripts', express.static(__dirname + '/public/javascripts/'));
// app.use('/uploadedCVs', express.static(__dirname + '/uploadedCVs/'));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//init validator
app.use(expressValidator({
      errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while(namespace.length){
          formParam += '[' + namespace.shift()
        }
        return{
          param: formParam,
          msg: msg,
          value: value
        };
      }
}));

// messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use('/', indexRouter);
app.use('/candidates', candidatesRouter);
app.use('/humanResources', humanResourcesRouter);
app.use('/types', typesRouter);
app.use('/exams', examRouter);
app.use(function (req,res){
  res.redirect("/");
});


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
  // res.render('error');
});

module.exports = app;
