var schedule = require('node-schedule');
var mongoose = require('mongoose');
var urlMongdb = "mongodb://localhost:27017/prosumerFiot";
var mongo = require('mongodb').MongoClient;

var https = require('https');
var http = require('http');
var Intl = require('intl');

var nodemailer = require('nodemailer'); // email sender 

var optionsToken = {
  host: 'platform.fiesta-iot.eu',
  path: '/openam/json/authenticate',
  method: 'POST',
  headers: {
    'X-OpenAM-Username': 'dmartin',//'oc1-training',
    'X-OpenAM-Password': 'proyectoDATAQUEST2017',//'12345678',
    'Content-Type': 'application/json'
  }
};

var j = schedule.scheduleJob({hour: 23, minute: 25}, function(){
  //AQUI va la fiesta
  var d = new Date();
  console.log("Comienza la tarea a las "+d.getHours()+":"+d.getMinutes());
  var actions=[];
  mongo.connect(urlMongdb, function(err, db){
    if(err) throw err;
    var cursor = db.collection('scheduledActions').find();
    cursor.forEach(function(doc, err){
      actions.push(doc);
    }, function(){
      db.close();
      console.log("Número de acciones: "+actions.length);
      for(var i=0;i<actions.length;i++){
      	var tDev = actions[i].tDev;
	    	var endp = actions[i].endp;
	    	var min = actions[i].min;
	    	var max = actions[i].max;
	    	var action = actions[i].action;
	    	var email = actions[i].email;
	    	var endpURI = endp.substring(endp.lastIndexOf("/")+1);//Nos quedamos solo con la id del endpoint
				var host = endp.substring(endp.indexOf("://")+3).substring(0,endp.substring(endp.indexOf("://")+3).indexOf('/'));
				var path = endp.substring(endp.substring(endp.indexOf("://")+3).indexOf('/')+endp.indexOf('://')+3, endp.lastIndexOf('/')+1);
				var token = '';
				console.log("Comprobando valores actuales del endpoint");
				var request = https.request(optionsToken, function(response) {
				  console.log('STATUS /token: ' + response.statusCode);
				  if(response.statusCode === 401){
				    console.info("UNAUTORIZADO");
				  }
				  else{
				  	console.log('HEADERS /token: ' + JSON.stringify(response.headers));
				  	var bodyChunks = [];

				   	response.on('data', function(chunk) {
				      bodyChunks.push(chunk);
				      token = JSON.parse(chunk).tokenId;
				    }).on('end', function() {
				      var options = {
				       	host: host,//'platform.fiesta-iot.eu',
				       	path: path+endpURI,//'/iot-registry/api/endpoints/'+,
				       	method: 'GET',
				          headers: {
				              'Cache-control': 'no-cache',
				              'Accept': 'application/ld+json',
				              'iPlanetDirectoryPro': token
				          }
				        };

				      var request = https.request(options, function(response) {
				       	console.log('STATUS /endpoints: ' + response.statusCode);
				       	if(response.statusCode === 401){
				          //Token no valido unautorizado
				          console.log("UNAUTORIZADO");
				        }
				        else{
					        console.log('HEADERS /endpoints: ' + JSON.stringify(response.headers));
					        response.on('data', function(chunk) {
					        	var JsonChunk = JSON.parse(chunk);
					        	if(JsonChunk["@graph"]!=undefined){
					        		var graph = JsonChunk["@graph"];
					          	//Extraer todas las observaciones que me sirven
					          	console.log("Recibido valores Endpoint");
					           	var i = 0;
					           	for(i;i<graph.length;i++){
					           		if(graph[i]["@type"]=="http://www.w3.org/2006/time#Instant"){
					               	//2016-12-09T01:22:07.232Z^^http://www.w3.org/2001/XMLSchema#dateTime
						               	var d = new Date(graph[i].inXSDDateTime);
						               	var lang = ["es"]; //using an array because of quirk in Chrome
							            var options = {  
							             	weekday: "long", 
							             	year: "numeric", 
							             	month: "long",  
							             	day: "numeric", 
							             	hour: "2-digit", 
							             	minute: "2-digit",
							             	second:"2-digit"  
							            };
							            var formatter = new Intl.DateTimeFormat(lang, options);
							            //date=d.toLocaleString('es-ES', options);
							            date=formatter.format(d);
						            }
							        	if(graph[i]["@type"]=="http://www.w3.org/2003/01/geo/wgs84_pos#Point"){
							            lat = graph[i]["http://www.w3.org/2003/01/geo/wgs84_pos#lat"];
							  	        long = graph[i]["http://www.w3.org/2003/01/geo/wgs84_pos#long"];
							    			}
							        	if(graph[i]["@type"]=="http://purl.oclc.org/NET/ssnx/ssn#ObservationValue"){
							        		//
							    	   		measure = graph[i]["http://www.loa.istc.cnr.it/ontologies/DUL.owl#hasDataValue"];
							        	}
							    		}
							    	}
						      }).on('end', function() {
						      	//Modulo para enviar un correo con la información
						       	console.log("Comprobando valores con la medida: "+measure);
						       	var flag = false;
						       	if(min!=""&&max!=""){
											if(measure>min&&measure<max){//condición de mínimo o máximo
												flag=true;
												console.log("Medida dentro de los valores");
						       		}
						       	}
						       	if(min==""){
						       		if(measure<max){//condicion solo max
						       			flag=true;
						       			console.log("Medida dentro de los valores");
						       		}
						       	}
						        if(max==""){
						         	if(measure>min){//condicion solo min
						         		flag=true;
						         		console.log("Medida dentro de los valores");
						         	}
						        }
						        	
						      	if(flag){
						      		console.log("Preparando para enviar el email");
						       		var to=email;
						       		var text="Se ha detectado que ha superado los limites que programó, obteniendo una medida de "+measure+" "+tDev+".";
						       		
						       		var transporter = nodemailer.createTransport({
										    service: 'Gmail',
										    auth: {
										      user: 'victor.malvo@gmail.com',//cuenta para webprosumer
										      pass: 'jarpo1994'//contraseña para webprosumer
										    }
										  });

										  var mailOptions = {
										  	from: 'Web Prosumer',
										    to: to,
										    subject: 'Medidas alcanzadas',
										    text: text
										  };

										  transporter.sendMail(mailOptions, function(error, info){
										    if (error){
										      console.log(error);
										    } else {
										      console.log("Email enviados");
										    }
										  });
						       	}
						      });
						    }
						  });
						  request.on('error', function(e) {
						    console.log("ERROR "+e.message);
						  });
					   	request.end();
					  });
					}
				});
				request.on('error', function(e) {
					console.log("ERROR "+e.message);
				});//request  
				request.end();
     	}//for
    });
  });
});


