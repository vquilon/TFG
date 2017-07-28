var fs = require('fs');

var https = require('https');
var http = require('http');
var async = require('async');

var mongoose = require('mongoose'),
	Deployments = mongoose.model('Deployments'),
	ReqSPARQL = mongoose.model('ReqSPARQL');//Poner modelo que guarda de los fesmos

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

//DEPLOYMENTS - TESTBED
var testbeds = [];
//-----------------------SmartSantander 
var smartSantander = "a1yp9GcKEPw37Bx5rslgRI4QLSNCwEwBatCIOe_W0dHZCmzj2WmkExz3qoNuvWg1pueAXn1Li0JrNjvBiQwV3Q==";
testbeds[0]=smartSantander;
//-----------------------SoundCity(Inria-Paris)
var soundCity = "s87UnnzFTAStKTL_wErGRTxPObzVT6zoAXUrS1PvuvAMtwHiDSKscfLBaeU44dnq6btRFQpVlI05VX6hkQgjuA==";
testbeds[1]=soundCity;
//-----------------------University of Surrey(SmartICS)
var smartICS = "uyPgySZB-ikYt9HCYa37uQc-1fAOcyLn7RW64vsk8BsKIgc_n4qRPHXCCFyCdMKnSQb49_jfLH89D07A7H6zLS90qCN8a7byym6C2eS3LOA=";
testbeds[2]=smartICS;
//-----------------------KETI
var keti = "hRWFx405M_0veyV1H7GQvtvo8GHAZ-9ynEJZL7mZ10Fl8PaaHf_MhN_qQdAJ6zDgKJGXIHqhBMvWOzgMvIG5DO69NnP4vrilxWgYfn6mhCI=";
testbeds[3]=keti;

var preUrlDep = "";


exports.homeP = function (req, res, next){
  var titulo = "post";
  var datos =  req.files;
  var origen = "La información del hostname es " + req.hostname + ".  " + "La información de la IP es " + req.ip + ".  ";
  var seguridad = "La información es segura: " + req.secure + ".  ";
  var cookies = "La petición tiene las siguientes cookies: " + JSON.stringify(req.cookies) + ".  ";
  var tipoInfo = "El tipo de información recibida es: " + req.header('content-type');
  var header = "Date: " + req.get('Date') + " Accept-DateTime: " + req.get(' Accept-Datetime');
  var informacion = origen + seguridad + cookies + tipoInfo;
  

  var newReqSPARQL = new ReqSPARQL({
          title : titulo,
          information : informacion,
          text : datos
  });
  newReqSPARQL.save(function (err) {
  	if (err){
    	 console.log(err);
  	} 
  });
};


exports.readMongo = function (req, res, next){
  ReqSPARQL.find(function(err, reqSPARQL){
    console.log(reqSPARQL);
    if (err){
      return console.log(err);
    } else{
      res.send(reqSPARQL);
    }
  });
 };

exports.readFiles = function (req, res, next){
	fs.readFile('files/devDep' + req.params.id + '.json', 'utf8', function(err, data) {  
    if (err){
    		console.error("No existen más archivos para leer", err);
    		res.send("No existen más archivos para leer");
    		return;
		}
    	res.send(data);
    });
};


//PAGINA PRINCIPAL
exports.home = function(req,res,next){
res.render('index', { title: 'Express' });
  /*var dep = new Deployments({title: "Prueba",url: "Prueba2",text: "Prueba3"});
  dep.save(function(err){
    if(err) throw err;
    console.log("Guardado");
  });*/
};


//DEPLOYMENTS--FUNCIONA CON EL CALLBACK DE https.request (COMO DEBE SER, mas sencillo pero waterfall se recomienda)
exports.deployments = function(req,res,next){
  var token = '';
  var request = https.request(optionsToken, function(response) {
    console.log('STATUS /token: ' + response.statusCode);
    if(response.statusCode === 401){
      console.log("UNAUTORIZADO");
    }
    else{
      console.log('HEADERS /token: ' + JSON.stringify(response.headers));
      var bodyChunks = [];
      var deps = [];
      var nameDeps = [];

      response.on('data', function(chunk) {
        bodyChunks.push(chunk);
        token = JSON.parse(chunk).tokenId;
      }).on('end', function() {
        var postData = 
          "Prefix ssn: <http://purl.oclc.org/NET/ssnx/ssn#>"+
          "SELECT ?Dep"+
          " WHERE{"+
          "   ?Dep a ssn:Deployment ."+
          " }";
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
        var request = https.request(options, function(response) {
          console.log('STATUS /deployments: ' + response.statusCode);
          if(response.statusCode === 401){
            //Token no valido unautorizado
            console.log("UNAUTORIZADO");
          }
          else{
            console.log('HEADERS /deployments: ' + JSON.stringify(response.headers));
            response.on('data', function(chunk) {
              console.log("CHUNK "+chunk);
              var JsonChunk = JSON.parse(chunk);
              var items = JsonChunk.items;
              for(var i=0;i<items.length;i++){
                var d = items[i].Dep;
                deps.push(d.substring(d.lastIndexOf('/') + 1));
                /*TRES FORMAS PARA COGER TODO EL TEXTO DESPUÉS DEL ULTIMO CARACTER EN ESTE CASO '/'
                ARRAY SPLIT
                  deps[i].split("/")[deps[i].split("/").length - 1];
                REGULAR EXPRESSION
                  /[^/]*$/.exec(deps[i)[0];
                LASTINDEX AND SUBSTRING - Es la mas eficiente de todas, requiere menos iteracciones y es más claro
                */
                var urlDeps = deps[i];
                switch (urlDeps) {
                  case testbeds[0]:
                    //SmartSantander
                    nameDeps.push("SmartSantander");
                    break;
                  case testbeds[1]:
                    //Soundcity
                    nameDeps.push("Soundcity");
                    break;
                  case testbeds[2]:
                    //SmartICS
                    nameDeps.push("SmartICS");
                    break;
                  case testbeds[3]:
                    //KETI
                    nameDeps.push("KETI");
                    break;
                  default:
                    nameDeps.push("Deployment UNOWN");
                    break;
                }
              preUrlDep = deps[0].substring(0,deps[0].lastIndexOf('/')+1);
              }
              console.log("DEPLOYMENTS Json "+ deps);

            }).on('end', function() {
               
              res.render('deployments', {
                title: 'Get Deployments',
                deps: deps, 
                nameDeps: nameDeps
              });
            })
          }
        });
        request.on('error', function(e) {
          console.log("ERROR "+e.message);
        });
        request.write(postData);
        request.end();
      })
    }
  });
  request.on('error', function(e) {
    console.log("ERROR "+e.message);
  });  
  request.end();
};


//
exports.DevOfDep = function(req,res,next){
  var nameDep = req.params.nDep;//para ver que se envia desde el formulario
  var dep = req.params.dep;
  var token = '';

  var request = https.request(optionsToken, function(response) {
    console.log('STATUS /token: ' + response.statusCode);
    if(response.statusCode === 401){
      console.log("UNAUTORIZADO");
    }
    else{
      console.log('HEADERS /token: ' + JSON.stringify(response.headers));
      var bodyChunks = [];
      response.on('data', function(chunk) {
        bodyChunks.push(chunk);
        token = JSON.parse(chunk).tokenId;
      }).on('end', function() {
        //Obtener todos los devices y sub sistemas que coincidadn con un deployment
        var postData =
          "PREFIX ssn: <http://purl.oclc.org/NET/ssnx/ssn#>"+ 
          "PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"+
          "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"+
          "SELECT ?DepOne ?Dep ?dev ?DepofS ?sys ?type"+
          "WHERE {"+
            "?dev rdf:type/rdfs:subClassOf ssn:Device ."+
            "OPTIONAL{"+
              "?dev rdf:type ?type ."+
              "?dev ssn:hasDeployment ?Dep ."+
              "VALUES ?Dep {"+
                "<"dep">"+//Sustituir por el deployment
              "} ."+
            "}"+
            "OPTIONAL{"+
              "?dev iot-lite:isSubSystemOf ?sys ."+
              "?sys ssn:hasDeployment ?DepofS ."+
              "VALUES ?DepofS {"+
                "<"dep">"+//Sustituir por el deployment
              "} ."+
            "}"+
          "}ORDER BY ?dev";

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
        var devices = [];
        var typeDev = [];
        var devs = [];
        var request = https.request(options, function(response) {
          console.log('STATUS /devices: ' + response.statusCode);
          if(response.statusCode === 401){
            //Token no valido unautorizado
            console.log("UNAUTORIZADO");
          }
          else{
            console.log('HEADERS /devices: ' + JSON.stringify(response.headers));
            response.on('data', function(chunk) {
              console.log("CHUNK "+chunk);
              var JsonChunk = JSON.parse(chunk);
              var items = JsonChunk.items;
              //Extraer todos los devices que me sirven
              var i = 0;
              
              for(i;i<items.length;i++){
                //if(items[i].dev.substring(0,d.lastIndexOf("/"))!="https://platform.fiesta-iot.eu/iot-registry/api/observations"){
                if(items[i].Dep!=undefined || items[i].DepofS!=undefined){
                //Si el device no tiene Depl o un systema con Deplo no sirve el device
                  if(items[i].dev!=undefined){
                    if(items[i].type!="http://purl.oclc.org/NET/ssnx/ssn#Device"){
                      devices.push(items[i].dev);
                      devs.push(items[i].dev.substring(items[i].dev.lastIndexOf("/")+1));
                      typeDev.push(items[i].type.substring(items[i].type.lastIndexOf("#")+1));
                    }
                  }
                }
              }
            }).on('end', function() {
               
              res.render('devices', {
                title: 'Get Devices of Deployment '+nameDep,
                devices: devices,
                devs: devs, 
                typeDev: typeDev
              });
            })
          }
        });
        request.on('error', function(e) {
          console.log("ERROR "+e.message);
        });
        request.write(postData);
        request.end();
      })
    }
  });
  request.on('error', function(e) {
    console.log("ERROR "+e.message);
  });  
  request.end();
};

exports.ObsOfDev = function(req, res, next){
  var dev = req.params.dev;
  var nDev = req.params.nDev;
  var dMin = req.params.dateMin;
  var dMax = req.params.dateMax;
  var token = '';

  var request = https.request(optionsToken, function(response) {
    console.log('STATUS /token: ' + response.statusCode);
    if(response.statusCode === 401){
      console.log("UNAUTORIZADO");
    }
    else{
      console.log('HEADERS /token: ' + JSON.stringify(response.headers));
      var bodyChunks = [];

      response.on('data', function(chunk) {
        bodyChunks.push(chunk);
        token = JSON.parse(chunk).tokenId;
      }).on('end', function() {
        //Obtener todas las observaciones que coincidan con un device
        var postData =
          "PREFIX ssn: <http://purl.oclc.org/NET/ssnx/ssn#>"+ 
          "PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"+
          "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"+
          "SELECT ?obs ?s ?sys ?t ?num ?unit"+
          "WHERE {"+
            "?obs a ssn:Observation."+
            "?obs ssn:observedBy ?s ."+
            "VALUES ?s {"+
              "<"+dev+">"+
            "} ."+
            "?obs ssn:observationSamplingTime ?time ."+
            "?time time:inXSDDateTime ?t ."+
            "?obs ssn:observationResult ?result ."+
            "?result ssn:hasValue ?value ."+
            "?value iot-lite:hasUnit ?u ."+
            "?value dul:hasDataValue ?num ."+
            "?u rdf:type ?unit ."+
            //"?s iot-lite:exposedBy ?serv ."+
            //"?serv iot-lite:endpoint ?endp ."+  
          "}ORDER BY ?t";

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
        var obs = [];
        var timeObs = [];
        var request = https.request(options, function(response) {
          console.log('STATUS /observations: ' + response.statusCode);
          if(response.statusCode === 401){
            //Token no valido unautorizado
            console.log("UNAUTORIZADO");
          }
          else{
            console.log('HEADERS /observations: ' + JSON.stringify(response.headers));
            response.on('data', function(chunk) {
              console.log("CHUNK "+chunk);
              var JsonChunk = JSON.parse(chunk);
              var items = JsonChunk.items;
              //Extraer todas las observaciones que me sirven
              if(items.length!=0){
                //No hay observaciones de este sensor
              }
              else{
                var i = 0;
                for(i;i<items.length;i++){
                  if(items[i].obs!=undefined){
                    var t = items[i].t.substring(0,items[i].t.lastIndexOf("^^"));
                    obs.push(items[i].obs);
                    timeObs.push();
                    //Definir el valor de la medida y de sus unidades
                    //filtrar las observaciones en los dos rangos de tiempo

                  }
                }
              }
            }).on('end', function() {
               
              res.render('observations', {
                title: 'Get Observations of Device '+nDev,
                obs: obs, 
                timeObs: nameObs
              });
            })
          }
        });
        request.on('error', function(e) {
          console.log("ERROR "+e.message);
        });
        request.write(postData);
        request.end();
      })
    }
  });
  request.on('error', function(e) {
    console.log("ERROR "+e.message);
  });  
  request.end();
};



//Deployments----------------------------------------FUNCIONA CON WATERFALL
exports.deploymentsWF = function(req, res, next){
  async.waterfall(
    [
      function getToken(callback) {
        var request = https.request(optionsToken, function(response) {
          console.log('STATUS /token: ' + response.statusCode);
          if(response.statusCode === 401){
            callback("UNAUTORIZADO",null);
          }
          else{
            var token = '';
            console.log('HEADERS /token: ' + JSON.stringify(response.headers));
            var bodyChunks = [];
            var deps = [];
            response.on('data', function(chunk) {
              bodyChunks.push(chunk);
              token = JSON.parse(chunk).tokenId;
            }).on('end', function() {
              var body = Buffer.concat(bodyChunks);
              console.log("Render TOKEN:"+token);
              callback(null, token);
            })
          }
        });
        request.on('error', function(e) {
          callback(e.message,null);
        });  
        request.end(); 
          
      },
      function getDeployments(t, callback) {
        var options = {
          host: 'platform.fiesta-iot.eu',
          path: '/iot-registry/api/resources',
          method: 'GET',
          headers: {
              'Accept': 'application/json',
              'iPlanetDirectoryPro': t,
              'Cache-control' : 'no-cache'
          }
        };
        var postData = 
          "Prefix ssn: <http://purl.oclc.org/NET/ssnx/ssn#>"+
          "SELECT ?Dep"+
          " WHERE{"+
          "   ?Dep a ssn:Deployment ."+
          " }";
        console.log("TOKEN "+t);
        var request = https.request(options, function(response) {
          console.log('STATUS /deploymentsWF: ' + response.statusCode);
          if(response.statusCode === 401){
            //Token no valido unautorizado
            callback("UNAUTORIZADO",null);
          }
          else{
            console.log('HEADERS /deploymentsWF: ' + JSON.stringify(response.headers));
            var bodyChunks = [];
            response.on('data', function(chunk) {
              console.log("CHUNK "+chunk);
              var JsonChunk = JSON.parse(chunk);
              var items = JsonChunk.items;
              for(var i=0;i<items.length;i++){
                deps.push(items[i].Dep);
              }
              console.log("DEPLOYMENTS Json "+ deps);
            }).on('end', function() {
              var nameDeps = [];
              for(var i=0;i<deps.length;i++){
                /*TRES FORMAS
                ARRAY SPLIT
                  deps[i].split("/")[deps[i].split("/").length - 1];
                REGULAR EXPRESSION
                  /[^/]*$/.exec(deps[i)[0];
                LASTINDEX AND SUBSTRING - Es la mas eficiente de todas, requiere menos iteracciones y es más claro
                */
                var urlDeps = deps[i].substring(deps[i].lastIndexOf('/') + 1);
                switch (urlDeps) {
                  case testbeds[0]:
                    //SmartSantander
                    nameDeps.push("SmartSantander");
                    break;
                  case testbeds[1]:
                    //Soundcity
                    nameDeps.push("Soundcity");
                    break;
                  case testbeds[2]:
                    //SmartICS
                    nameDeps.push("SmartICS");
                    break;
                  case testbeds[3]:
                    //KETI
                    nameDeps.push("KETI");
                    break;
                  default:
                    nameDeps.push("Deployment nº"+i);
                    break;
                }
              }
              res.render('deployments', {
                title: 'Get Deployments WF',
                deps: deps, 
                nameDeps: nameDeps
              });
            })
          }
        });
        request.on('error', function(e) {
          callback(e.message,null);
        });
        request.write(postData);
        request.end();
        callback(null, t+" /deploymentsWF");
      }
    ],
    function (err, caption) {
        if(err){
          console.log("ERROR "+err);
        }
        console.log(caption);
    }
  );  
};