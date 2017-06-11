var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
var eventSchema = new mongoose.Schema({
  _id: {type: Number, unique: true, required: true},
  type: String,
  actor: {type: Number, ref: 'Actor'},
  repo: {type: Number, ref: 'Repo'},
  created_at: Date
}, { versionKey: false });


eventSchema.pre('save', function(next){
  this.type = this.type.toLowerCase();
  next();
})

eventSchema.plugin(findOrCreate);
module.exports = mongoose.model('Event', eventSchema);
