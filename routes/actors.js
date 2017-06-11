var routes = require('express').Router();
var Event = require('../models/event');
var Repo = require('../models/repo');
var Actor = require('../models/actor');
var pagination = require('../lib/pagination');
var NotFoundError = require('../lib/errors/not-found-error');
var EmptySetError = require('../lib/errors/empty-set-error');

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

routes.get('/:login/repos', (req, res, next) => {
  var login = req.params.login;
  hash = {};
  Actor.findOne({ login: login}).exec()
  .then( doc => {
    if(!doc)  throw new NotFoundError('actor not found');
    hash.actor = doc;
    return Event.find({ actor: doc._id }).populate('repo').select('repo').exec();
  })
  .then( docs => {
    var repos = docs.map( a => a.repo );
    hash.repos = repos;
    res.status(200).send(hash)
  })
  .catch( e => { 
    if( e instanceof NotFoundError ) res.status(e.status).send({ message: e.message });
    else next(e); 
  })
});

routes.get('/:login/topRepo', (req, res, next) => {
  var login = req.params.login;
  hash = {};
  Actor.findOne({ login: login}).exec()
  .then( doc => {
    if(!doc) throw new NotFoundError('actor not found');
    hash.actor = doc;
    return Event.aggregate([
      { $match: { actor: doc._id } },
      { $group: { _id: '$repo', count: { $sum: 1 } } },
      { $sort: { count: -1 }},
      { $group: { _id: '$_id', contributions: { $max: '$count' } } }
    ]).exec();
  })
  .then( doc => {
    if(!doc.length) throw new EmptySetError('actor has no contributions');
    console.log(doc)
    hash.contributions = doc[0].contributions;
    return Repo.findOne({ _id: doc[0]._id}).exec()
  })
  .then( doc => {
    if(!doc) throw new NotFoundError('Repo not found');
    hash.repo = doc;
    res.status(200).send(hash);
  })
  .catch( e => {
    if( e instanceof NotFoundError || e instanceof EmptySetError )
      res.status(e.status).send({ message: e.message });
    else
      next(e);
  })

});


module.exports = routes;
