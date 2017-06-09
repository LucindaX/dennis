var routes = require('express').Router();
var Event = require('../models/event');
var Repo = require('../models/repo');
var Actor = require('../models/actor');
//var arrayStream = require('../lib/arrayStream');
//var d = require('domain').create();

/**
 * GET /events/
 * params type
*/ 
routes.get('/', (req, res, next) => {
  
  var type = req.query.type;
  var from = req.query.from;
  
  conditions = type ? { type: type } : {}
  
  if (from) conditions.created_at = {'$gte': new Date(parseInt(from)) }
  
  var url = req.protocol + '://' + req.get('host');
  
  Event.find(conditions).populate('actor').populate('repo').sort('+created_at').limit(101)
  .then( docs => {
      hash = {};
      if(docs.length > 100){
        hash.links = 
          { self: url + '/events?from=' + docs[0].created_at.getTime() + '&type=' + type,
            next: url + '/events?from=' + docs[100].created_at.getTime() + '&type=' +type
          };
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
