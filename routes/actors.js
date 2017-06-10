var routes = require('express').Router();
var Event = require('../models/event');
var Repo = require('../models/repo');
var Actor = require('../models/actor');
var pagination = require('../lib/pagination');

/**
 * GET /actors/
 * return all actors
*/ 
routes.get('/', (req, res, next) => {
  
  var from = req.query.from;  
  var conditions = {};
 
  if (from) conditions._id = {'$gte': parseInt(from) }
  
  Event.find(conditions).sort('+id').limit(101)
  .then( docs => {
      hash = {};
      if(docs.length > 100){
        hash.links = pagination.generateLinks(req, {docs: docs, limit: 100, field: 'id'}, {})
      }
      hash.events = docs.slice(0,-1);
      res.status(200).send(hash);
  })
  .catch( e => next(e) );

})

routes.get('/:id/repos', (req, res, next) => {
  var id = req.params.id;
  try { parseInt(id) }
  catch(e) { next(e) }
  hash = {};
  Actor.find({ _id: id}).exec()
  .then( doc => {
    if (!doc) res.status(404).send({ message: 'actor not found'});
    hash.actor = doc;
    return Event.find({ actor: id }).populate('repo').select('repo').exec();
  })
  .then( docs => {
    var repos = docs.map( a => a.repo );
    hash.repos = repos;
    res.status(200).send(hash)
  })
  .catch( e => { next(e) })
});


module.exports = routes;
