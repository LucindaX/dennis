var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
var repoSchema = new mongoose.Schema({
  _id: {type: Number, unique: true, required: true},
  name: { type: String, unique: true, required: true},
  url: {type: String, required: true}
}); 
repoSchema.plugin(findOrCreate);
module.exports = mongoose.model('Repo', repoSchema);
