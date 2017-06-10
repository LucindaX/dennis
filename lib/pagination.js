module.exports = {
  generateLinks: (req, options, params) => {
    var docs = options.docs,
        limit = options.limit,
        field = options.field;

    var url = req.protocol + '://' + req.get('host') + req.originalUrl.split('?')[0];
    var selfFrom = docs[0][field] instanceof Date ? docs[0][field].getTime() : docs[0][field] ;
    var nextFrom = docs[limit][field] instanceof Date ? docs[limit][field].getTime() : docs[limit][field] ;
    var qs = '';
    for (var key in params){
      if(params.hasOwnProperty(key)){
        qs += key + '=' + params[key] + '&';
      }
    }
    return {
      self: url + '?from='+ selfFrom + '&' + qs,
      next: url + '?from=' + nextFrom + '&' + qs
    }
  } 
}
