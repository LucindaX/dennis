var express = require('express'),
    mongoose = require('mongoose'),
    request = require('request'),
    path = require('path'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    config = require('./config');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname,'public')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// connect to DB
mongoose.Promise = require('bluebird');
mongoose.connect(config.database);
mongoose.connection.on('error', function(){
  console.log('Error: Could not connect to MongoDB');
});

app.get('/',function(req, res, next){
  res.send('Welcome To API');
});

//app.use('/repos', require('./routes/repos'));
//app.use('/actors', require('./routes/actors'));
app.use('/events', require('./routes/events'));

app.use(function(err, req, res, next){
  console.log(err.stack);
  res.status(err.status || 500);
  res.send({message: err.message});
});

app.listen(app.get('port'), function(){
  console.log('Express server listening on port '+ app.get('port'));
});
