var https = require('https');
var http = require('http');
var Intl = require('intl');

var APIKeyGMJS = "AIzaSyD5m1jKSlB97XyZOOITUKLjKXsyZKCpW-o";

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
CAMBIAR TODOS LOS SISTEMAS PARA QUE FUNCIONE CON LOS fismoS QUE OBTIENEN LOS DEPLOYMENTS Y DEVICES

AL OBTENER LOS fismoS DE ALGUNA FORMA QUE GUARDE LOS DEPLOYMENTS POR UN LADO EN UN ARRAY Y LOS DEVICES
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
      var deps = [];
      var nameDeps = [];
      var preUrlDeps = [];

      response.on('data', function(chunk) {
        body+=chunk;
      }).on('end', function() {
        token = JSON.parse(body).tokenId;
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
          var body="";
          console.log('STATUS /deployments: ' + response.statusCode);
          if(response.statusCode === 401){
            //Token no valido unautorizado
            console.log("UNAUTORIZADO");
          }
          else{
            console.log('HEADERS /deployments: ' + JSON.stringify(response.headers));
            response.on('data', function(chunk) {
              console.log("CHUNK "+chunk);
              body+=chunk;
            }).on('end', function() {
              var JsonChunk = JSON.parse(body);
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
  /*Para coger los parametros de la url es con req.params.id(en la ruta /:id)
    Para coger los parametros de un formulario con post req.body.id
    Para coger los parametros de un formulario por get(en la url ?id=) con req.query.id*/
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
      var body="";
      response.on('data', function(chunk) {
        body+=chunk;
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
            "?dev a ssn:Device ."+
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
          var body="";
          console.log('STATUS /devices: ' + response.statusCode);
          if(response.statusCode === 401){
            //Token no valido unautorizado
            console.info("UNAUTORIZADO");
          }
          else{
            console.log('HEADERS /devices: ' + JSON.stringify(response.headers));
            response.on('data', function(chunk) {
              console.log("CHUNK "+chunk);
              body+=chunk
            }).on('end', function() {
              var JsonChunk = JSON.parse(body);
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
  var dev = req.body.devobs;//url full
  var tDev = req.params.tDev;//tipo del device (el nombre añadir mas adelante un nombre)
  var dMin = req.body.dateMin;
  var dMax = req.body.dateMax;
  var token = '';
  var dep = req.body.dep;
  var nameDep = req.params.nameDep;
  if(dep){
    var ulrDep = dep.substring(dep.lastIndexOf('/') + 1);
    var preUrl = dep.substring(0,dep.lastIndexOf('/')+1);
  }
  console.log("tDev "+tDev);
  console.log("dMin "+dMin);
  console.log("dMax "+dMax);
  var request = https.request(optionsToken, function(response) {
    console.log('STATUS /token: ' + response.statusCode);
    if(response.statusCode === 401){
      console.info("UNAUTORIZADO");
      res.render('observations', {
                  title: 'Observations of Device '+tDev,
                  tDev: tDev,
                  obs: [],//obs, 
                  timeObs: timeObs,
                  measures: [],//measures,
                  units: [],//units,
                  preUrl: preUrl,
                  ulrDep: ulrDep,
                  nameDep: nameDep,
                  dev: dev,
                  APIKeyGMJS: APIKeyGMJS,
                  pos: {"lat":"","long":""}//pos
                });
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
            "?time time:inXSDDateTime ?t .";
            if(dMin!=""){
            	postData=postData+"FILTER (?t > '"+dMin+"'^^xsd:dateTime) .";
            }
            if(dMax!=""){
            	postData=postData+"FILTER (?t < '"+dMax+"'^^xsd:dateTime) .";	
            }
            postData=postData+
            "?obs ssn:observationResult ?result ."+
            "?result ssn:hasValue ?value ."+
            "?value iot-lite:hasUnit ?u ."+
            "?value dul:hasDataValue ?num ."+
            "?u rdf:type ?unit ."+
            //"?s iot-lite:exposedBy ?serv ."+
            //"?serv iot-lite:endpoint ?endp ."+  
          "}ORDER BY ?t";
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
        var obs = [];
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
                  var i = 0;
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
                  }
                } 

                res.render('observations', {
                  title: 'Observations of Device '+tDev,
                  tDev: tDev,
                  obs: obs, 
                  timeObs: timeObs,
                  measures: measures,
                  units: units,
                  preUrl: preUrl,
                  ulrDep: ulrDep,
                  nameDep: nameDep,
                  dev: dev,
                  APIKeyGMJS: APIKeyGMJS,
                  pos: pos
                });
              }
              else{
                
              }
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
  var nameDep = req.params.nameDep;
  var tDev = req.params.tDev;//tipo del device (el nombre añadir mas adelante un nombre)
  var dev = req.body.devf;//url full
  var endp = req.body.endp;
  var qk = req.body.qk;
  var dep = req.body.dep;
  var unit = req.body.unit;
  if(dep){
    var ulrDep = dep.substring(dep.lastIndexOf('/') + 1);
    var preUrl = dep.substring(0,dep.lastIndexOf('/')+1);
  }
  //Variables a presentar finalmente
  var date="";
  var lat="";
  var long="";
  var measure="";
  if(endp!="NODATA"){
    var endpURI = endp.substring(endp.lastIndexOf("/")+1);//Nos quedamos solo con la id del endpoint
    var host = endp.substring(endp.indexOf("://")+3).substring(0,endp.substring(endp.indexOf("://")+3).indexOf('/'));
    var path = endp.substring(endp.substring(endp.indexOf("://")+3).indexOf('/')+endp.indexOf('://')+3, endp.lastIndexOf('/')+1);
    var token = '';
    var request = https.request(optionsToken, function(response) {
    console.log('STATUS /token: ' + response.statusCode);
    if(response.statusCode === 401){
      console.info("UNAUTORIZADO");
      res.render('endpoints', {
                title: 'Endpoint of Device '+tDev,
                measure: "",//measure, 
                date: "",//date,
                lat: "",//lat,
                long: "",//long,
                qk: qk,
                unit: unit,
                nameDep: nameDep,
                preUrl: preUrl,
                ulrDep: ulrDep,
                tDev: tDev,
                dev: dev,
                endp: endp,
                APIKeyGMJS: APIKeyGMJS//PARA EL MAPA TEMPORAL
      });
    }
    else{
      console.log('HEADERS /token: ' + JSON.stringify(response.headers));
      var body="";

      response.on('data', function(chunk) {
        body+=chunk;
        
      }).on('end', function() {
        token = JSON.parse(body).tokenId;
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
          var body="";
          console.log('STATUS /observations: ' + response.statusCode);
          if(response.statusCode === 401){
            //Token no valido unautorizado
            console.log("UNAUTORIZADO");
          }
          else{
            console.log('HEADERS /endpoints: ' + JSON.stringify(response.headers));
            response.on('data', function(chunk) {
            body+=chunk
              
            }).on('end', function() {
               
              var JsonChunk = JSON.parse(body);
              if(JsonChunk["@graph"]!=undefined){
                var graph = JsonChunk["@graph"];
              
              
                //Extraer todas las observaciones que me sirven
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

              res.render('endpoints', {
                title: 'Endpoint of Device '+tDev,
                measure: measure, 
                date: date,
                lat: lat,
                long: long,
                qk: qk,
                unit: unit,
                nameDep: nameDep,
                preUrl: preUrl,
                ulrDep: ulrDep,
                tDev: tDev,
                dev: dev,
                endp: endp,
                APIKeyGMJS: APIKeyGMJS//PARA EL MAPA TEMPORAL
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
  }
  else{
    res.render('endpoints', {
      title: 'Endpoint of Device '+tDev,
      measure: measure, 
      date: date,
      lat: lat,
      long: long,
      qk: qk,
      unit: unit,
      nameDep: nameDep,
      tDev: tDev,
      dev: dev,
      endp: endp,
      APIKeyGMJS: APIKeyGMJS//PARA EL MAPA , es TEMPORAL
    });
  }

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
  "@graph": [
    {
      "@id": "https://platform.fiesta-iot.eu/iot-registry/api/observations/55QJpSyYNuSYDmXstDF3LZ8QRekKiccftefGdzNxv0MPX_V3AoMmZ0Urc8Vt6KbD_rsQv_5Rejlp32SEeDHKjL9sCpixoiilt87Qz0w0b5MQ3lyCZDmrV5YlpxlkX3qahyVjgUvNAI3rvl2eWSojnRnDO-zKam7vIwMkxnMPOVy6JduEy8LaAVWQWDCoKlWm",
      "@type": "http://purl.org/iot/vocab/m3-lite#MicrogramPerCubicMetre"
    },
    {
      "@id": "https://platform.fiesta-iot.eu/iot-registry/api/observations/7axQhj_LGQalV1RnoOwQanAWu0z1JtXlauxyHGpo6zqA54MOwjowzUgj7DSDs5a6IkJ8aQOU0JVpPRLejP2fmkwckGdO2dmadSkPzTJ5nAMV1-pDFnjwKmgFje-a76IiiWxzvzBFQDeBFbxiwsJW7jZbDz32iEit9oNWKx6QMjj_wj3Vut46ObChB37L6fnS",
      "@type": "http://purl.org/iot/vocab/m3-lite#ChemicalAgentAtmosphericConcentrationNO2"
    },
    {
      "@id": "https://platform.fiesta-iot.eu/iot-registry/api/observations/D71goXpI2wRk7xn3tU17olHknAosNuqVR1qXuNbWZJE5Qx1S8TTpR9faWdx4Z-OP",
      "@type": "http://purl.oclc.org/NET/ssnx/ssn#Observation",
      "observationResult": "https://platform.fiesta-iot.eu/iot-registry/api/observations/hVla1UX0GebQ7rUNPxWZChZE_cH80R0yRTop0_GCb0aFn4R2yWVhfW3sV0Xllwjk",
      "observationSamplingTime": "https://platform.fiesta-iot.eu/iot-registry/api/observations/JofutoLCHbctYvSPQBPg99TU1L-PN-QkJ63YjlbAXIb0bt2t4Tx1NFOji0mI3heO",
      "observedBy": "https://platform.fiesta-iot.eu/iot-registry/api/resources/byaSwddb1aG-M0uFXzEeZxpxltWA_vuTyhY-CaZf2EfxeBu9b5wyG7c7N4xU8Dcy9x3w1-pAIjRur28V8tYqQ8_jPtu4sm-j7SLLKY0kho8U9brDPn-XPDgLaf-_RvkhT6d2kUT_FDigCtfaZpHOoEYMfrLqJQROwYJuPo3Xs5s=",
      "observedProperty": "https://platform.fiesta-iot.eu/iot-registry/api/observations/7axQhj_LGQalV1RnoOwQanAWu0z1JtXlauxyHGpo6zqA54MOwjowzUgj7DSDs5a6IkJ8aQOU0JVpPRLejP2fmkwckGdO2dmadSkPzTJ5nAMV1-pDFnjwKmgFje-a76IiiWxzvzBFQDeBFbxiwsJW7jZbDz32iEit9oNWKx6QMjj_wj3Vut46ObChB37L6fnS",
      "location": "https://platform.fiesta-iot.eu/iot-registry/api/observations/oVnQpJzZQ2ouvQqlFd5RiPuf3U_UEGeWnpTV9lafT-khl7tpchJV5Omh29dzDotd"
    },
    {
      "@id": "https://platform.fiesta-iot.eu/iot-registry/api/observations/DU1j86UUzmXGPEZDCL5Kaf24hzuylhKhJzOGbcCyOpXv0gA89UbIeIoPaLyeu3SC",
      "@type": "http://purl.oclc.org/NET/ssnx/ssn#ObservationValue",
      "hasUnit": "https://platform.fiesta-iot.eu/iot-registry/api/observations/55QJpSyYNuSYDmXstDF3LZ8QRekKiccftefGdzNxv0MPX_V3AoMmZ0Urc8Vt6KbD_rsQv_5Rejlp32SEeDHKjL9sCpixoiilt87Qz0w0b5MQ3lyCZDmrV5YlpxlkX3qahyVjgUvNAI3rvl2eWSojnRnDO-zKam7vIwMkxnMPOVy6JduEy8LaAVWQWDCoKlWm",
      "http://www.loa.istc.cnr.it/ontologies/DUL.owl#hasDataValue": 115
    },
    {
      "@id": "https://platform.fiesta-iot.eu/iot-registry/api/observations/JofutoLCHbctYvSPQBPg99TU1L-PN-QkJ63YjlbAXIb0bt2t4Tx1NFOji0mI3heO",
      "@type": "http://www.w3.org/2006/time#Instant",
      "inXSDDateTime": "2017-10-09T08:40:02.000Z"
    },
    {
      "@id": "https://platform.fiesta-iot.eu/iot-registry/api/observations/P9IwXSBpVET517-YNKS5-NkbU0dRt7hpHTo4DKX9E6onq0RxXmfuVp4odPSA7Ibu8mH9lxIcUNnCZweTfTwAfFeIXnaYVxvyJWmJuFB4JcHDV8JRbytrq4JmUJLwavYV_0Zvbv3nl8jvZ7141msGAl5Wz1X6obVaGDnvl45u9kQ=",
      "madeObservation": "https://platform.fiesta-iot.eu/iot-registry/api/observations/D71goXpI2wRk7xn3tU17olHknAosNuqVR1qXuNbWZJE5Qx1S8TTpR9faWdx4Z-OP"
    },
    {
      "@id": "https://platform.fiesta-iot.eu/iot-registry/api/observations/hVla1UX0GebQ7rUNPxWZChZE_cH80R0yRTop0_GCb0aFn4R2yWVhfW3sV0Xllwjk",
      "@type": "http://purl.oclc.org/NET/ssnx/ssn#SensorOutput",
      "hasValue": "https://platform.fiesta-iot.eu/iot-registry/api/observations/DU1j86UUzmXGPEZDCL5Kaf24hzuylhKhJzOGbcCyOpXv0gA89UbIeIoPaLyeu3SC"
    },
    {
      "@id": "https://platform.fiesta-iot.eu/iot-registry/api/observations/oVnQpJzZQ2ouvQqlFd5RiPuf3U_UEGeWnpTV9lafT-khl7tpchJV5Omh29dzDotd",
      "@type": "http://www.w3.org/2003/01/geo/wgs84_pos#Point",
      "http://www.w3.org/2003/01/geo/wgs84_pos#lat": 43.4694051,
      "http://www.w3.org/2003/01/geo/wgs84_pos#long": -3.8123466
    }
  ],
  "@context": {
    "inXSDDateTime": {
      "@id": "http://www.w3.org/2006/time#inXSDDateTime",
      "@type": "http://www.w3.org/2001/XMLSchema#dateTime"
    },
    "hasUnit": {
      "@id": "http://purl.oclc.org/NET/UNIS/fiware/iot-lite#hasUnit",
      "@type": "@id"
    },
    "hasDataValue": {
      "@id": "http://www.loa.istc.cnr.it/ontologies/DUL.owl#hasDataValue",
      "@type": "http://www.w3.org/2001/XMLSchema#double"
    },
    "hasValue": {
      "@id": "http://purl.oclc.org/NET/ssnx/ssn#hasValue",
      "@type": "@id"
    },
    "madeObservation": {
      "@id": "http://purl.oclc.org/NET/ssnx/ssn#madeObservation",
      "@type": "@id"
    },
    "observationResult": {
      "@id": "http://purl.oclc.org/NET/ssnx/ssn#observationResult",
      "@type": "@id"
    },
    "observationSamplingTime": {
      "@id": "http://purl.oclc.org/NET/ssnx/ssn#observationSamplingTime",
      "@type": "@id"
    },
    "observedBy": {
      "@id": "http://purl.oclc.org/NET/ssnx/ssn#observedBy",
      "@type": "@id"
    },
    "observedProperty": {
      "@id": "http://purl.oclc.org/NET/ssnx/ssn#observedProperty",
      "@type": "@id"
    },
    "location": {
      "@id": "http://www.w3.org/2003/01/geo/wgs84_pos#location",
      "@type": "@id"
    },
    "lat": {
      "@id": "http://www.w3.org/2003/01/geo/wgs84_pos#lat",
      "@type": "http://www.w3.org/2001/XMLSchema#double"
    },
    "long": {
      "@id": "http://www.w3.org/2003/01/geo/wgs84_pos#long",
      "@type": "http://www.w3.org/2001/XMLSchema#double"
    }
  }
}
*/
//-----------------------------------------------------------------------------------------