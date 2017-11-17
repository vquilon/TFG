var fs = require('fs');
var https = require('https');
var http = require('http');

var mongoose = require('mongoose'),
	//Deployments = mongoose.model('Deployments'),
	fismo = mongoose.model('fismo');//Poner modelo que guarda de los fismos


//PAGINA PRINCIPAL
exports.home = function(req,res,next){
  res.render('index', { title: 'Express' });

};

