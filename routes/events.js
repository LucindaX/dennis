var routes = require('express').Router();
var Event = require('../models/event');
var Repo = require('../models/repo');
var Actor = require('../models/actor');
var arrayStream = require('../lib/arrayStream');
var d = require('domain').create();

/**
 * GET /events/
 * params type
*/ 
routes.get('/', (req, res, next) => {
  var type = req.query.type;
  console.log(type);
  conditions = type ? { type: type } : {}
  var stream = Event.find(conditions).populate('actor').populate('repo').cursor();
  d.on('error', e => next(e));
  d.run(() => stream.pipe(arrayStream).pipe(res));
})


module.exports = routes;
