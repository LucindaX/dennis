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

routes.get('/:login/repos', (req, res, next) => {
  var login = req.params.login;
  hash = {};
  Actor.findOne({ login: login}).exec()
  .then( doc => {
    //if (!doc) res.status(404).send({ message: 'actor not found'});
    hash.actor = doc;
    return Event.find({ actor: doc._id }).populate('repo').select('repo').exec();
  })
  .then( docs => {
    var repos = docs.map( a => a.repo );
    hash.repos = repos;
    res.status(200).send(hash)
  })
  .catch( e => { next(e) })
});

routes.get('/:login/topRepo', (req, res, next) => {
  var login = req.params.login;
  hash = {};
  Actor.findOne({ login: login}).exec()
  .then( doc => {
    //if(!doc)
    hash.actor = doc;
    return Event.aggregate([
      { $match: { actor: doc.id } },
      { $group: { _id: '$repo', count: { $sum: 1 } } },
      { $sort: { count: -1 }},
      { $group: { _id: '$_id', contributions: { $max: '$count' } } }
    ]).exec();
  })
  .then( doc => {
    //if(!doc.length) res.status(200).send({ message: 'Actor has no contributions' });
    hash.contributions = doc[0].contributions;
    return Repo.findOne({ _id: doc[0]._id}).exec()
  })
  .then( doc => {
    if(!doc) return res.status(404).send({ message: 'Repo not found' });
    hash.repo = doc;
    res.status(200).send(hash);
  })
  .catch( e => next(e) )

});


module.exports = routes;
