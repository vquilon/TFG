var https = require('https');
var http = require('http');

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
//-----------------------NEW 1
var new1 = "B22BFi1KVB39zIjnTdv_dJ5LCPqAfYrrIB6GzBWI7pnqVOFzzeUGaKDECdSLyv8y5VdZ0VRH_N06C3HNiKnHnA==";
testbeds[4]=new1;
//-----------------------NEW 2
var new2 = "SQkpIs52bXH7hzb4Bjk1QOo0iq7s6zVdq4iTN0K3m03H4_qj3BHdz8u1OpbfdD95d1suggHotvIkXWHg2q14PQ==";
testbeds[5]=new2;
//-----------------------NEW 3
var new3 = "Y3PNOixpH-HmZKRtMNTPKRUV6eX0Z5h9f76XMeiEi4u7B-hyj4yvePCzG_G84-mlOv1GslUO2P1gGSeNxgD90VY7gfTtDQKW4QcEMxezFm8=";
testbeds[6]=new3;


var preUrlDep = "";

/*
CAMBIAR TODOS LOS SISTEMAS PARA QUE FUNCIONE CON LOS FESMOS QUE OBTIENEN LOS DEPLOYMENTS Y DEVICES

AL OBTENER LOS FESMOS DE ALGUNA FORMA QUE GUARDE LOS DEPLOYMENTS POR UN LADO EN UN ARRAY Y LOS DEVICES
EN OTRO SISTEMA ORDENADOS POR LOS DEPLOYMENTS


*/

//FUNCIONALIDAD CON LA API REST-------------------------------------------------------------
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
      var preUrlDeps = [];

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
                  case testbeds[4]:
                    //NEW1
                    nameDeps.push("NEW1");
                    break;
                  case testbeds[5]:
                    //NEW2
                    nameDeps.push("NEW2");
                    break;
                  case testbeds[6]:
                    //NEW3
                    nameDeps.push("NEW3");
                    break;
                  default:
                    nameDeps.push("DeploymentNEW");
                    break;
                }
              /*Coge el enlace antes de el numero*/
              preUrlDep = d.substring(0,d.lastIndexOf('/')+1);
              preUrlDeps.push(preUrlDep);

              }
              console.log("DEPLOYMENTS Json "+ deps);

            }).on('end', function() {
               
              res.render('deployments', {
                title: 'Get Deployments',
                deps: deps, 
                nameDeps: nameDeps,
                preUrlDeps: preUrlDeps
              });
            })
          }
        });
        request.on('error', function(e) {
          console.error("ERROR "+e.message);
        });
        request.write(postData);
        request.end();
      })
    }
  });
  request.on('error', function(e) {
    console.error("ERROR "+e.message);
  });  
  request.end();
};

exports.DevOfDep = function(req,res,next){
  /*Para coger los parametros de la url es con req.params.:id
    Para coger los parametros de un formulario con post req.body.:id
    Para coger los parametros de un formulario por get(en la url) con req.query.:id*/
  var nameDep = req.body.nDep;//para ver que se envia desde el formulario
  var dep = req.body.dep;
  var preUrl = req.body.preUrl;
  var token = '';
  console.log("Nombre del deployment seleccionado:"+nameDep);
  console.log("Nombre de la url del deployment:"+dep);
  dep = preUrl+dep;

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
        //Obtener todos los devices y sub sistemas que coincidadn con un deployment
        var postData =
          "PREFIX ssn: <http://purl.oclc.org/NET/ssnx/ssn#>"+ 
          "PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"+
          "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"+
          "PREFIX iot-lite: <http://purl.oclc.org/NET/UNIS/fiware/iot-lite#>"+
          "SELECT ?DepOne ?Dep ?dev ?DepofS ?sys ?type "+
          "WHERE {"+
            "?dev rdf:type/rdfs:subClassOf ssn:Device ."+
            "OPTIONAL{"+
              "?dev rdf:type ?type ."+
              "?dev ssn:hasDeployment ?Dep ."+
              "VALUES ?Dep {"+
                "<"+dep+">"+//Sustituir por el deployment
              "} ."+
            "}"+
            "OPTIONAL{"+
              "?dev iot-lite:isSubSystemOf ?sys ."+
              "?sys ssn:hasDeployment ?DepofS ."+
              "VALUES ?DepofS {"+
                "<"+dep+">"+//Sustituir por el deployment
              "} ."+
            "}"+
          "}ORDER BY ?dev";
        console.log("Peticion enviada:"+ postData);  
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
            console.info("UNAUTORIZADO");
          }
          else{
            console.log('HEADERS /devices: ' + JSON.stringify(response.headers));
            response.on('data', function(chunk) {
              //console.log("CHUNK "+chunk);
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
          console.error("ERROR "+e.message);
        });
        request.write(postData);
        request.end();
      })
    }
  });
  request.on('error', function(e) {
    console.error("ERROR "+e.message);
  });  
  request.end();
};

//---------------------------------------------------------------------------------------
/*
  Todos los devices no tienen siempre observaciones solo algunos, de ningún tiempo, hay que averiguar que
  devices tienen observaciones y comprobar como se comporta, porque almenos deberían tener observaciones
  todos los dispositivos que se muestran, o que puedan tener en un futuro, sino no se ponene
*/
exports.ObsOfDev = function(req, res, next){
  var dev = req.body.devf;//url full
  var tDev = req.query.tDev;//tipo del device (el nombre añadir mas adelante un nombre)
  var dMin = new Date(req.body.dateMin);
  var dMax = new Date(req.body.dateMax);
  var token = '';
  console.log("tDev "+tDev);
  console.log("dMin "+dMin);
  console.log("dMax "+dMax);
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
        //Obtener todas las observaciones que coincidan con un device
        var postData =
          "PREFIX ssn: <http://purl.oclc.org/NET/ssnx/ssn#>"+ 
          "PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"+
          "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"+
          "PREFIX iot-lite: <http://purl.oclc.org/NET/UNIS/fiware/iot-lite#>"+
          "PREFIX time: <http://www.w3.org/2006/time#>"+
          "PREFIX dul: <http://www.loa.istc.cnr.it/ontologies/DUL.owl#>"+
          "SELECT ?obs ?s ?sys ?t ?num ?unit "+
          "WHERE {"+
            "?obs a ssn:Observation."+
            "?obs ssn:observedBy ?s ."+
            "VALUES ?s {"+
              "<"+dev+">"+
            "} ."+
            "?obs ssn:observationSamplingTime ?time ."+
            "?time time:inXSDDateTime ?t ."+
            "FILTER (?t > "+dMin+"^^xsd:dateTime) ."+
            "FILTER (?t < "+dMax+"^^xsd:dateTime) ."+
            "?obs ssn:observationResult ?result ."+
            "?result ssn:hasValue ?value ."+
            "?value iot-lite:hasUnit ?u ."+
            "?value dul:hasDataValue ?num ."+
            "?u rdf:type ?unit ."+
            //"?s iot-lite:exposedBy ?serv ."+
            //"?serv iot-lite:endpoint ?endp ."+  
          "}ORDER BY ?t";
          console.log(postData);
          console.log("URL "+dev);
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
        var timeObs = [];//fecha de las observaciones
        var measures = [];//medidas de las observaciones
        var units = [];//unidades de las observaciones
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
              if(items.length==0){
                //No hay observaciones de este sensor
                console.log("VACIOOOOOO");
              }
              else{
                console.log("LLEEEENOO");
                var i = 0;
                for(i;i<items.length;i++){
                  if(items[i].obs!=undefined){
                    //La Z es UTC el .356 solo son los milisegundos....
                    //t form : 2017-03-23T07:08:07.356Z
                    //num form : 10^^http://www.w3.org/2001/XMLSchema#double
                    //unit form : http://purl.org/iot/vocab/m3-lite#Percent
                    var t = items[i].t.substring(0,items[i].t.lastIndexOf("^^"));
                    var tDate = t.substring(0,t.indexOf("T"));//Coje la fecha
                    var obsDate = new Date(tDate);
                    if(tDate>=dMin && tDate<=dMax){//Fecha de la observación tiene que estar entre los valores máx y mín
                      obs.push(items[i].obs);
                      timeObs.push(t.substring(0,t.indexOf(".")));//Coje la fecha y la hora
                      measures.push(items[i].num.substring(0,items[i].num.indexOf("^^")));
                      units.push(items[i].unit.substring(items[i].unit.indexOf("#")));
                    }
                  }
                }
              }
            }).on('end', function() {
               
              res.render('observations', {
                title: 'Get Observations of Device '+tDev,
                obs: obs, 
                timeObs: timeObs,
                measures: measures,
                units: units
              });
            })
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
};

exports.EndpOfDev = function(req, res, next){
  var dev = req.body.devf;//url full
  var tDev = req.query.tDev;//tipo del device (el nombre añadir mas adelante un nombre)
  var endp = req.body.endp;
  var qk = req.body.qk;
  var unit = req.body.unit;
  var endpURI = endp.substring(endp.lastIndexOf("/")+1);//Nos quedamos solo con la id del endpoint
  var host = endp.substring(endp.indexOf("://")+3).substring(0,endp.substring(endp.indexOf("://")+3).indexOf('/'));
  var path = endp.substring(endp.substring(endp.indexOf("://")+3).indexOf('/')+endp.indexOf('://')+3, endp.lastIndexOf('/')+1);
  var token = '';
  console.log("tDev "+tDev);
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
        //Variables a presentar finalmente
        var date;
        var lat;
        var long;
        var measure;

        var request = https.request(options, function(response) {
          console.log('STATUS /observations: ' + response.statusCode);
          if(response.statusCode === 401){
            //Token no valido unautorizado
            console.log("UNAUTORIZADO");
          }
          else{
            console.log('HEADERS /endpoints: ' + JSON.stringify(response.headers));
            response.on('data', function(chunk) {
              console.log("CHUNK "+chunk);
              var JsonChunk = JSON.parse(chunk);
              var items = JsonChunk.items;
              //Extraer todas las observaciones que me sirven
              var i = 0;
              for(i;i<items.length;i++){
                if(items[i].predicate=="http://www.w3.org/2006/time#inXSDDateTime"){
                  //2016-12-09T01:22:07.232Z^^http://www.w3.org/2001/XMLSchema#dateTime
                  var d = new Date(items[i].object.substring(0,items[i].object.indexOf('^')));
                  var options = {  
                    weekday: "long", 
                    year: "numeric", 
                    month: "long",  
                    day: "numeric", 
                    hour: "2-digit", 
                    minute: "2-digit",
                    second:"2-digit"  
                  };
                  date=d.toLocaleString('es-ES', options);
                }
                if(items[i].predicate=="http://www.w3.org/2003/01/geo/wgs84_pos#lat"){
                  //
                  lat = Number(items[i].object.substring(0,items[i].object.indexOf('^')));
                }
                if(items[i].predicate=="http://www.w3.org/2003/01/geo/wgs84_pos#long"){
                  //
                  long = Number(items[i].object.substring(0,items[i].object.indexOf('^')));
                }
                if(items[i].predicate=="http://www.loa.istc.cnr.it/ontologies/DUL.owl#hasDataValue"){
                  //
                  measure = Number(items[i].object.substring(0,items[i].object.indexOf('^')));
                }
                
              }
              
            }).on('end', function() {
               
              res.render('endpoints', {
                title: 'Get Endpoints of Device '+tDev,
                measure: measure, 
                date: date,
                lat: lat,
                lat: lat,
                qk: qk,
                unit: unit
              });
            })
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
  });  
  request.end();
};

/*

Nueva peticion basada en enviar un endpoint y leerlo
https://platform.fiesta-iot.eu/iot-registry/api/endpoints/mqXpJXd6ANGE71m0RMN_bsrldNnjnSBpjrs5aBhBcMm0Q06EO20AP7fSQ_hIl62kVHPWhpv7yqGRS1l3NrFZgRB90-HLazwzZpML-GKrtiZB60qgb1_yHDGKoj__A0eT^^http://www.w3.org/2001/XMLSchema#anyURI

Hay que quitar del enlace lo ultimo ^^http://www.w3.org/2001/XMLSchema#anyURI
Donde aleatoriamente se recibe un type y los valores siguientes a ese type menos el tipo de datos, por ejemplo:

PREDICATE of a type : http://www.w3.org/1999/02/22-rdf-syntax-ns#type(PREDICATE)

Type fecha: ssn#Instant(OBJECT) -> http://www.w3.org/2006/time#inXSDDateTime(PREDICATE)
                      (2016-12-09T01:22:07.232Z^^http://www.w3.org/2001/XMLSchema#dateTime)(OBJECT)

Type Localizacion: ssn#Point(OBJECT) -> http://www.w3.org/2003/01/geo/wgs84_pos#lat(PREDICATE)
                                        (4.346277E1^^http://www.w3.org/2001/XMLSchema#double)(OBJECT)
                                        http://www.w3.org/2003/01/geo/wgs84_pos#long(PREDICATE)
                                        (-3.79724E0^^http://www.w3.org/2001/XMLSchema#double)(OBJECT)

Type Medida: ssn#ObservationValue(OBJECT) -> http://purl.oclc.org/NET/UNIS/fiware/iot-lite#hasUnit(PREDICATE) -> http://www.loa.istc.cnr.it/ontologies/DUL.owl#hasDataValue(PREDICATE)
                                                                                                                  (8.5E1^^http://www.w3.org/2001/XMLSchema#double)(OBJECT)

Type Observacion: ssn#Observation(OBJECT) -> ssn#observationResult(PREDICATE) ->ssn#observationSamplingTime(PREDICATE) -> ssn#observedBy(PREDICATE) -> ssn#observedProperty(PREDICATE) -> wgs84_pos#location(PREDICATE)

Type Sensor que lo mide: ssn#SensorOutput(OBJECT) -> ssn#hasValue(PREDICATE)

Se saca con las propiedades de los devices antes-----------------------
Type Unidades OBJECT es por ejemplo m3-lite#DegreeCelsius

Type que mide OBJECT es por ejemplo m3-lite#AirTemperature

Se recibe una peticion del tipo:
{
  "vars": [
    "subject", "predicate", "object"
  ]
  "items": [
    {
      "subject": "https://platform.fiesta-iot.eu/iot-registry/api/observations/u5NTYfjZsUO2asBFiYcFC98JvtV3K3TKsXvAJfMJrT3FbDpAjHeosiNJaUSw8CAR6rRYgmOg5qFjt1SyY5YB7uECf2lEfxwOUAmUe2BXXWJ2BJx7xMT_SbQlMnF6pZkHoXPRT9Xr2IBrDBP1g1d_4Q==",
      "predicate": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
      "object": "http://purl.org/iot/vocab/m3-lite#Percent"
    },
    {
      "subject": "https://platform.fiesta-iot.eu/iot-registry/api/observations/LGjfeR6yReaqi0jaYhNd-MQceY_J9jAsGj1V18XSrbd8ymIht7n4EUKRHV9F8ny5",
      "predicate": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
      "object": "http://www.w3.org/2006/time#Instant"
    },
    {
      "subject": "https://platform.fiesta-iot.eu/iot-registry/api/observations/LGjfeR6yReaqi0jaYhNd-MQceY_J9jAsGj1V18XSrbd8ymIht7n4EUKRHV9F8ny5",
      "predicate": "http://www.w3.org/2006/time#inXSDDateTime",
      "object": "2016-12-09T01:22:07.232Z^^http://www.w3.org/2001/XMLSchema#dateTime"
    },
    {
      "subject": "https://platform.fiesta-iot.eu/iot-registry/api/observations/P_XUbMCtocnkUpS__TFpeLDVfCo6lk4aboceGt9TBvn5YpMMa7jQKE0CBUbfR0s5WsVNVgj_x9ZT8xACBSYMd7FfxJCGAeEuEoLv1no9si-WorsvDuz0nDl033hAM8ibLOlzP0JJUbemIH5qChPn7w==",
      "predicate": "http://purl.oclc.org/NET/ssnx/ssn#madeObservation",
      "object": "https://platform.fiesta-iot.eu/iot-registry/api/observations/pVs372lb0iTsa37CY8Dz2c7oNHAxzgwB8Sbk2Z6iKlGycg-q-h0Ly3VazlA5Z0u5"
    },
    {
      "subject": "https://platform.fiesta-iot.eu/iot-registry/api/observations/SPvv5wDyi8SLraozLnFx_3238KCvnh0GrID6XSIXi6n42acErnnR9YeS5CRfwk14",
      "predicate": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
      "object": "http://www.w3.org/2003/01/geo/wgs84_pos#Point"
    },
    {
      "subject": "https://platform.fiesta-iot.eu/iot-registry/api/observations/SPvv5wDyi8SLraozLnFx_3238KCvnh0GrID6XSIXi6n42acErnnR9YeS5CRfwk14",
      "predicate": "http://www.w3.org/2003/01/geo/wgs84_pos#lat",
      "object": "4.346277E1^^http://www.w3.org/2001/XMLSchema#double"
    },
    {
      "subject": "https://platform.fiesta-iot.eu/iot-registry/api/observations/SPvv5wDyi8SLraozLnFx_3238KCvnh0GrID6XSIXi6n42acErnnR9YeS5CRfwk14",
      "predicate": "http://www.w3.org/2003/01/geo/wgs84_pos#long",
      "object": "-3.79724E0^^http://www.w3.org/2001/XMLSchema#double"
    },
    {
      "subject": "https://platform.fiesta-iot.eu/iot-registry/api/observations/nEOZr8Q3VMHJ23GWZHY3C4z0gA1XmTTG4SVN62iWCAoi4_SiF4wVhy0seConNkt7",
      "predicate": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
      "object": "http://purl.oclc.org/NET/ssnx/ssn#ObservationValue"
    },
    {
      "subject": "https://platform.fiesta-iot.eu/iot-registry/api/observations/nEOZr8Q3VMHJ23GWZHY3C4z0gA1XmTTG4SVN62iWCAoi4_SiF4wVhy0seConNkt7",
      "predicate": "http://purl.oclc.org/NET/UNIS/fiware/iot-lite#hasUnit",
      "object": "https://platform.fiesta-iot.eu/iot-registry/api/observations/u5NTYfjZsUO2asBFiYcFC98JvtV3K3TKsXvAJfMJrT3FbDpAjHeosiNJaUSw8CAR6rRYgmOg5qFjt1SyY5YB7uECf2lEfxwOUAmUe2BXXWJ2BJx7xMT_SbQlMnF6pZkHoXPRT9Xr2IBrDBP1g1d_4Q=="
    },
    {
      "subject": "https://platform.fiesta-iot.eu/iot-registry/api/observations/nEOZr8Q3VMHJ23GWZHY3C4z0gA1XmTTG4SVN62iWCAoi4_SiF4wVhy0seConNkt7",
      "predicate": "http://www.loa.istc.cnr.it/ontologies/DUL.owl#hasDataValue",
      "object": "8.5E1^^http://www.w3.org/2001/XMLSchema#double"
    },
    {
      "subject": "https://platform.fiesta-iot.eu/iot-registry/api/observations/pVs372lb0iTsa37CY8Dz2c7oNHAxzgwB8Sbk2Z6iKlGycg-q-h0Ly3VazlA5Z0u5",
      "predicate": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
      "object": "http://purl.oclc.org/NET/ssnx/ssn#Observation"
    },
    {
      "subject": "https://platform.fiesta-iot.eu/iot-registry/api/observations/pVs372lb0iTsa37CY8Dz2c7oNHAxzgwB8Sbk2Z6iKlGycg-q-h0Ly3VazlA5Z0u5",
      "predicate": "http://purl.oclc.org/NET/ssnx/ssn#observationResult",
      "object": "https://platform.fiesta-iot.eu/iot-registry/api/observations/KAzochaLB3WjYixfmVz5xfG0dTtVx_ED7_X-GOh898Bs75E9XfOTEF7I2pPv6Qf0"
    },
    {
      "subject": "https://platform.fiesta-iot.eu/iot-registry/api/observations/pVs372lb0iTsa37CY8Dz2c7oNHAxzgwB8Sbk2Z6iKlGycg-q-h0Ly3VazlA5Z0u5",
      "predicate": "http://purl.oclc.org/NET/ssnx/ssn#observationSamplingTime",
      "object": "https://platform.fiesta-iot.eu/iot-registry/api/observations/LGjfeR6yReaqi0jaYhNd-MQceY_J9jAsGj1V18XSrbd8ymIht7n4EUKRHV9F8ny5"
    },
    {
      "subject": "https://platform.fiesta-iot.eu/iot-registry/api/observations/pVs372lb0iTsa37CY8Dz2c7oNHAxzgwB8Sbk2Z6iKlGycg-q-h0Ly3VazlA5Z0u5",
      "predicate": "http://purl.oclc.org/NET/ssnx/ssn#observedBy",
      "object": "https://platform.fiesta-iot.eu/iot-registry/api/resources/vdCPBx20YEufPzIvR8FgVSRriHBa0XmzsSA2icq0Y4gJx3E20zlj4xedXrsW2ihr9SgDEV4RPB1RSWS1iQvwSHV1yIKTVpI54PFaOHdjDEjvoZyivDs4_4sVSt4p2I-9qlE-KMhmeOUVuXYYRQ2S2Q=="
    },
    {
      "subject": "https://platform.fiesta-iot.eu/iot-registry/api/observations/pVs372lb0iTsa37CY8Dz2c7oNHAxzgwB8Sbk2Z6iKlGycg-q-h0Ly3VazlA5Z0u5",
      "predicate": "http://purl.oclc.org/NET/ssnx/ssn#observedProperty",
      "object": "https://platform.fiesta-iot.eu/iot-registry/api/observations/kg6Jy-bVkYj4CpK-F8xncizrZieJ9UznV-LSUUf_ZXGkmc4Qltcq71q_-nVw_ulunmlq-2MDdDHCDVsPBG-cfoSFbNu68xKMi0iCm8NFUJEGSTMWEOJ5bIxkMLCY54gz_EWUtA6KaFfIOoevsUr7GQ=="
    },
    {
      "subject": "https://platform.fiesta-iot.eu/iot-registry/api/observations/pVs372lb0iTsa37CY8Dz2c7oNHAxzgwB8Sbk2Z6iKlGycg-q-h0Ly3VazlA5Z0u5",
      "predicate": "http://www.w3.org/2003/01/geo/wgs84_pos#location",
      "object": "https://platform.fiesta-iot.eu/iot-registry/api/observations/SPvv5wDyi8SLraozLnFx_3238KCvnh0GrID6XSIXi6n42acErnnR9YeS5CRfwk14"
    },
    {
      "subject": "https://platform.fiesta-iot.eu/iot-registry/api/observations/kg6Jy-bVkYj4CpK-F8xncizrZieJ9UznV-LSUUf_ZXGkmc4Qltcq71q_-nVw_ulunmlq-2MDdDHCDVsPBG-cfoSFbNu68xKMi0iCm8NFUJEGSTMWEOJ5bIxkMLCY54gz_EWUtA6KaFfIOoevsUr7GQ==",
      "predicate": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
      "object": "http://purl.org/iot/vocab/m3-lite#BatteryLevel"
    },
    {
      "subject": "https://platform.fiesta-iot.eu/iot-registry/api/observations/KAzochaLB3WjYixfmVz5xfG0dTtVx_ED7_X-GOh898Bs75E9XfOTEF7I2pPv6Qf0",
      "predicate": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
      "object": "http://purl.oclc.org/NET/ssnx/ssn#SensorOutput"
    },
    {
      "subject": "https://platform.fiesta-iot.eu/iot-registry/api/observations/KAzochaLB3WjYixfmVz5xfG0dTtVx_ED7_X-GOh898Bs75E9XfOTEF7I2pPv6Qf0",
      "predicate": "http://purl.oclc.org/NET/ssnx/ssn#hasValue",
      "object": "https://platform.fiesta-iot.eu/iot-registry/api/observations/nEOZr8Q3VMHJ23GWZHY3C4z0gA1XmTTG4SVN62iWCAoi4_SiF4wVhy0seConNkt7"
    }
  ]
}
*/
//-----------------------------------------------------------------------------------------