var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

var actorSchema = new mongoose.Schema({
  _id: { type: Number, unique: true, required: true },
  login: { type: String, unique: true, required: true },
  gravatar_id: String,
  url: {type: String, required: true},
  avatar_url: String
}, { versionKey: false }); 

actorSchema.pre('save', function(next){
  this.login = this.login.toLowerCase();
  next();
})

actorSchema.plugin(findOrCreate);
module.exports = mongoose.model('Actor', actorSchema);
