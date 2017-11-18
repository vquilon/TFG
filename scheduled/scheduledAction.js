var schedule = require('node-schedule');
var mongoose = require('mongoose');
var urlMongdb = "mongodb://localhost:27017/prosumerFiot";
var mongo = require('mongodb').MongoClient;

var j = schedule.scheduleJob({hour: 9, minute: 30}, function(){
  //AQUI va la fiesta

});