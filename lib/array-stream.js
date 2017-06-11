var stream = require('stream');
var arrayStream = new stream.Transform({objectMode: true});

arrayStream._hasWritten = false;

arrayStream._transform = function(chunk, encoding, cb){
  if(!this._hasWritten){
    this._hasWritten = true;
    this.push('[' + JSON.stringify(chunk));
  }else{
    this.push(',' + JSON.stringify(chunk));
  }
  cb();
};

arrayStream._flush = function(cb){
  if (!this._hasWritten) this.push('[]');
  else this.push(']');
  cb();
}

module.exports = arrayStream;
