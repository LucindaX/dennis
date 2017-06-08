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
  Event.find(conditions).populate('actor').populate('repo').exec()
  .then( docs => {
    res.status(200).send(docs);
  })
  .catch( e => next(e) ) 
})

module.exports = routes;
