var routes = require('express').Router();
var Event = require('../models/event');
var Repo = require('../models/repo');
var Actor = require('../models/actor');
var pagination = require('../lib/pagination');
var _ = require('lodash');

/**
  * GET /repos/
  * returns repos with top contributer
  * for each
**/

routes.get('/', (req, res, next) => {
  
  var from = req.query.from;
  
  conditions = {};
  hash = {};

  if (from) conditions._id = {'$gte': parseInt(from) }
  
  Repo.find(conditions).sort('+_id').limit(101)
  .then( docs => {
      if(docs.length > 100){
        hash.links = pagination.generateLinks(req, { docs: docs, field: '_id', limit: 100 }, {}); 
      }
      docs = docs.slice(0,-1);
      hash.repos = docs;
      return Event.aggregate([
             { $match:  { repo: { '$in': docs.map( a => a._id ) } }},
             { $group: {
                 _id: { repo: '$repo', actor: '$actor' },
                 count: { '$sum': 1 },
               }
             },
             { $sort: { count: -1  } },
             { $group: {
                 _id: '$_id.repo',
                 actor: { $first: '$_id.actor' },
                 contributions: { $max: '$count' }
               } 
             }
             ])
             .exec()
  })
  .then( docs => {
    actors = []
    for(var i = 0; i< hash.repos.length; i++){
      var doc = _.find(docs, [ '_id', hash.repos[i]._id ]);
      hash.repos[i] = hash.repos[i].toObject()
      hash.repos[i].topContributer = doc.actor;
      actors.push(doc.actor);
    }
    return Actor.find({ _id: { $in: actors } }).exec();
    
  })
  .then( docs => {
    for(var i = 0; i < hash.repos.length; i++){
      var actor = _.find(docs, [ '_id', hash.repos[i].topContributer ]);
      hash.repos[i].topContributer = actor;
    }
    res.status(200).send(hash);  
  })
  .catch( e => next(e) );  
})


module.exports = routes;
