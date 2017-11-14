var fs = require('fs');
var https = require('https');
var http = require('http');

var mongoose = require('mongoose'),
	//Deployments = mongoose.model('Deployments'),
	fesmo = mongoose.model('fesmo');//Poner modelo que guarda de los fesmos


//PAGINA PRINCIPAL
exports.home = function(req,res,next){
  res.render('index', { title: 'Express' });

};

