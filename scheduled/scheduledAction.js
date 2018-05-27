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

var j = schedule.scheduleJob({hour: 19, minute: 44}, function(){
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
      	var dev = actions[i].dev;
	    	var endp = actions[i].endp;
	    	//var obs = actions[i].obs;
	    	var min = actions[i].min;
	    	var max = actions[i].max;
	    	var action = actions[i].action;
	    	var email = actions[i].email;
	    	if(endp){
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
					        var lat="";
					        var long="";
					        var measure="";
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
						       	else{
						       		console.log("No se han alcanzado los valores");
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
			}
			if(dev){//analizar por observations
				
				var token = '';
				console.log("Comprobando valores actuales de la observacion");
				

				var request = https.request(optionsToken, function(response) {
			    console.log('STATUS /token: ' + response.statusCode);
			    if(response.statusCode === 401){
			      console.info("UNAUTORIZADO");
			    }
			    else{
			      console.log('HEADERS /token: ' + JSON.stringify(response.headers));
			      var body="";

			      response.on('data', function(chunk) {
			        body+=chunk;
			        
			      }).on('end', function() {
			        token = JSON.parse(body).tokenId;
			        //Obtener todas las observaciones que coincidan con un device
			        var postData =
			          "Prefix ssn: <http://purl.oclc.org/NET/ssnx/ssn#>"+
			          "Prefix iotlite: <http://purl.oclc.org/NET/UNIS/fiware/iot-lite#>"+ 
			          "Prefix dul: <http://www.loa.istc.cnr.it/ontologies/DUL.owl#>"+ 
			          "PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"+
			          "Prefix geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>"+
			          "Prefix time: <http://www.w3.org/2006/time#>"+
			          "Prefix m3-lite: <http://purl.org/iot/vocab/m3-lite#>"+
			          "Prefix xsd: <http://www.w3.org/2001/XMLSchema#>"+
			          "Prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>"+
			          "Prefix iot-lite: <http://purl.oclc.org/NET/UNIS/fiware/iot-lite#>"+
			          "SELECT ?obs ?s ?sys ?t ?num ?lat ?long ?unit "+
			          "WHERE {"+
			            "?obs a ssn:Observation."+
			            "?obs ssn:observedBy ?s ."+
			            "VALUES ?s { "+
			              "<"+dev+"> "+
			            "} ."+
			            "?obs geo:location ?point ."+  
			            "?point geo:lat ?lat ."+
			            "?point geo:long ?long ."+
			            "?obs ssn:observationSamplingTime ?time ."+
			            "?time time:inXSDDateTime ?t ."+
			            
			            "?obs ssn:observationResult ?result ."+
			            "?result ssn:hasValue ?value ."+
			            "?value iot-lite:hasUnit ?u ."+
			            "?value dul:hasDataValue ?num . ";
			            if(min!=""){
			            	postData=postData+"FILTER (?num > "+min+") . ";
			            }
			            if(max!=""){
			            	postData=postData+"FILTER (?num < "+max+") . ";	
			            }
			            postData=postData+
			            "?u rdf:type ?unit ."+
			            //"?s iot-lite:exposedBy ?serv ."+
			            //"?serv iot-lite:endpoint ?endp ."+  
			          "}ORDER BY ?t LIMIT 1";
			          console.log(postData);
			          //console.log("URL "+dev);
			        var options = {
			          host: 'platform.fiesta-iot.eu',
			          path: '/iot-registry/api/queries/execute/global',
			          method: 'POST',
			            headers: {
			                'Content-Type': 'text/plain',
			                'Content-Length': Buffer.byteLength(postData),
			                'Accept': 'application/json',
			                'iPlanetDirectoryPro': token
			            }
			        };
			        var timeObs = [];//fecha de las observaciones
			        var measures = [];//medidas de las observaciones
			        var units = [];//unidades de las observaciones
			        var pos={"lat":"","long":""};
			        var request = https.request(options, function(response) {
			          var body="";
			          console.log('STATUS /observations: ' + response.statusCode);
			          if(response.statusCode === 401){
			            //Token no valido unautorizado
			            console.log("UNAUTORIZADO");
			          }
			          else{
			            //console.log(response);
			            console.log('HEADERS /observations: ' + JSON.stringify(response.headers));
			            response.on('data', function(chunk) {
			              //console.log("CHUNK "+chunk);
			              //Capturar esto para ver si hay error y transmitir a la pagina un error en el servidor y guardar logs
			              body+=chunk;
			            }).on('end', function() {
			              if(response.statusCode===200){
			                var JsonChunk = JSON.parse(body);
			                var items = JsonChunk.items;
			                //Extraer todas las observaciones que me sirven
			                if(items.length==0){
			                  //No hay observaciones de este sensor
			                  console.log("NO HAY OBSERVACIONES");
			                }
			                else{
			                  	console.log("HAY OBSERVACIONES");
			                  	console.log(items);
			                  	var lat=Number(items[i].lat.substring(0,items[i].lat.lastIndexOf("^")-1));
                        		var long =Number(items[i].long.substring(0,items[i].long.lastIndexOf("^")-1));
					          	var measure=Number(items[i].num.substring(0,items[i].num.indexOf("^^")));
			                  //Modulo para enviar un cnumorreo con la información
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
						       	else{
						       		console.log("No se han alcanzado los valores");
						       	}
			                  /*var i = 0;
			                 	for(i;i<items.length;i++){
			                    if(items[i].obs!=undefined){
			                      if(items[i].lat&&items[i].long){
			                        pos.lat=Number(items[i].lat.substring(0,items[i].lat.lastIndexOf("^")-1));
			                        pos.long=Number(items[i].long.substring(0,items[i].long.lastIndexOf("^")-1));
			                      }
			                      //La Z es UTC el .356 solo son los milisegundos....
			                      //t form : 2017-03-23T07:08:07.356Z
			                      //num form : 10^^http://www.w3.org/2001/XMLSchema#double
			                      //unit form : http://purl.org/iot/vocab/m3-lite#Percent
			                      var t = items[i].t.substring(0,items[i].t.lastIndexOf("^^"));

			                      var d = new Date(t);
			                      var lang = ["en"]; //using an array because of quirk in Chrome
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
			                      var date=formatter.format(d);
			                      //if(t>=dMin && t<=dMax){//Fecha de la observación tiene que estar entre los valores máx y mín
			                        obs.push(items[i].obs);
			                        timeObs.push(date);//Coje la fecha y la hora
			                        measures.push(Number(items[i].num.substring(0,items[i].num.indexOf("^^"))));
			                        units.push(items[i].unit.substring(items[i].unit.indexOf("#")+1));
			                      //}
			                    }
			                  }*/
			                } 
			              }
			              else{
			                
			              }
			            })//on end
			          }
			        });
			        request.on('error', function(e) {
			          console.log("ERROR "+e.message);
			        });
			        request.write(postData);
			        request.end();
			      });
			    }
			  });
			  request.on('error', function(e) {
			    console.log("ERROR "+e.message);
			  });  
			  request.end();
			}
			
     	}//for
    });
  });
});


