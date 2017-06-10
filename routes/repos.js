var routes = require('express').Router();
var Event = require('../models/event');
var Repo = require('../models/repo');
var Actor = require('../models/actor');
var pagination = require('../lib/pagination');
var Promise = require('bluebird');
 
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
             { $match:  { repos: { '$in': docs.map( a => a._id ) } }},
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
  .then( repos => {
    // insert repo object instead of _id returned for it
    // inster user object instead of user id returned for it ( fetch from db each user )
  })
  .catch( e => next(e) );  
})


module.exports = routes;
