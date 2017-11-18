var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/*MONGODB EN LA APLICAION PRINCIPAL
var mongoose = require("mongoose");//MongoDB Warning solucionado añadiendo useMongoClient: true de la fuente
//https://github.com/nodkz/mongodb-memory-server/issues/16
//Linea para quitar el warning (node:4316) DeprecationWarning: Mongoose: mpromise (mongoose's default promise library) is deprecated, plug in your own promise library instead: http://mongoosejs.com/docs/promises.html
//https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;
var db = mongoose.connect("mongodb://localhost/prosumerFiot", { useMongoClient: true }, function(err, db){
	if(err) throw err;
});

var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});
db.once('open', function() {
  console.log('Conectado a la BD: '+db);

});*/

//CAGAR MODELOS DE LA BD
//var models = require("./models/models.js");
//RUTAS DE CONTROLADORES
var index = require('./routes/index');
var users = require('./routes/users');
//SCHEDULED ACTIONS
var scheduled = require('.scheduled/scheduledAction.js');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
