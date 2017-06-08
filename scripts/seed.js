var JSONStream = require('JSONStream');
var fs = require('fs');
var _ = require('lodash');
var config = require('../config');
var path = require('path');

var Actor = require('../models/actor'),
    Event = require('../models/event'),
    Repo = require('../models/repo');

var mongoose = require('mongoose');
var Promise = require('bluebird');

mongoose.Promise = Promise;

mongoose.connect(config.database);

//mongoose.set('debug', true);

var parser = JSONStream.parse();

parser.on('data', function(data){
  parser.pause();
  digest(data)
});

parser.on('end', () => mongoose.disconnect());

var filePath = path.join(__dirname, '../data/dump.json');
var stream = fs.createReadStream(filePath, { flags: 'r', encoding: 'utf-8' });

function digest(record){
  var actor = record.actor;
  var repo = record.repo;
  var event = _.pick(record, ['id', 'type', 'actor.id', 'repo.id', 'created_at']);
  event.actor = actor.id;
  event.repo = repo.id;
  Actor.findOrCreate({ _id: actor.id }, actor)
  .then(Repo.findOrCreate({ _id: repo.id}, repo))
  .then(Event.findOrCreate({ _id: event.id}, event))
  .then(() => parser.resume())
  .catch( e => console.log(e) )
}

mongoose.connection.on('error', function(){
  console.log('Error: Could not connect to DB');
});
mongoose.connection.once('connected', function(){ 
  console.log('Connected to DB'); 
  mongoose.connection.db.dropDatabase();
  stream.pipe(parser); 
});
