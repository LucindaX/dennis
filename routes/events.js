var routes = require('express').Router();
var Event = require('../models/event');
var Repo = require('../models/repo');
var Actor = require('../models/actor');

/**
 * GET /events/
 * params type
*/ 
routes.get('/', (req, res, next) => {
  var type = req.query.type;
  console.log(type);
  conditions = type ? { type: type } : {}
  var stream = Event.find(conditions).populate('actor').populate('repo').batchSize(100).cursor();
  res.writeHead(200, {"Content-Type": "application/json"});
  stream.on('error', err => next(err));
  stream.on('data', doc => res.write(JSON.stringify(doc)));
  stream.on('close', () => res.end());
})

module.exports = routes;
