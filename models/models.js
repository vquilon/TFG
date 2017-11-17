var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// Deployments model
var DeploymentsSchema = new Schema({
  title: String,
  url: String,
  text: String
});

DeploymentsSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('deployments', DeploymentsSchema);
// SPARQL Request
var fismoSchema = new Schema({
  name: String,
  info: String,
  data: String
});

fismoSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('fismo', fismoSchema);
