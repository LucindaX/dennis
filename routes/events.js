var routes = require('express').Router();
var Event = require('../models/event');
var Repo = require('../models/repo');
var Actor = require('../models/actor');
var pagination = require('../lib/pagination');
//var arrayStream = require('../lib/array-stream');
//var d = require('domain').create();

/**
  * GET /events/
  * params type, from, repo
  * return all events filtered by params
**/ 
routes.get('/', (req, res, next) => {
  
  var type = req.query.type;
  var from = req.query.from;
  var repo = req.query.repo;
  
  conditions = type ? { type: type } : {}
  if (repo) conditions.repo = parseInt(repo);
  if (from) conditions.created_at = {'$gte': new Date(parseInt(from)) }
  
  Event.find(conditions).populate('actor').populate('repo').sort('+created_at').limit(101)
  .then( docs => {
      hash = {};
      if(docs.length > 100){
        hash.links = pagination.generateLinks( req, { docs: docs, field: 'created_at', limit: 100}, { type: type })
      }
      hash.events = docs.slice(0,-1);
      res.status(200).send(hash);
  })
  .catch( e => next(e) );

  //var stream = Event.find(conditions).populate('actor').populate('repo').cursor();
  //d.on('error', e => next(e));
  //d.run(() => stream.pipe(arrayStream).pipe(res));
  
})


module.exports = routes;
