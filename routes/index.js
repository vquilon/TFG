var express = require('express');
var router = express.Router();
var https = require('https');
var http = require('http');

var mongoose = require('mongoose'),
Deployments = mongoose.model('Deployments');




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  /*var dep = new Deployments({title: "Prueba",url: "Prueba2",text: "Prueba3"});
  dep.save(function(err){
    if(err) throw err;
    console.log("Guardado");
  });*/
  
});

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

//Deployments--FUNCIONA CON EL CALLBACK DE https.request (COMO DEBE SER, mas sencillo pero waterfall se recomienda)
router.get('/deployments', function(req,res,next){
  var token = '';
  var request = https.request(optionsToken, function(response) {
    console.log('STATUS /token: ' + response.statusCode);
    if(response.statusCode === 401){
      console.log("UNAUTORIZADO");
    }
    else{
      console.log('HEADERS /token: ' + JSON.stringify(response.headers));
      // Buffer the body entirely for processing as a whole.
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
                /*TRES FORMAS
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
                    nameDeps.push("Deployment nº"+i);
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
});
//-------------------------INCOMPLETO
router.get('/:nameDep/devices', function(req,res,next){
  var nameDep = req.params.nameDep;
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
      var dev = [];
      var nameDev = [];

      response.on('data', function(chunk) {
        bodyChunks.push(chunk);
        token = JSON.parse(chunk).tokenId;
      }).on('end', function() {
        var postData ="";
          //poner sentencias para obtener todos los devices y sub sistemas que coincidadn con un deployment
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
              //Completar obteniendo todos los devices que pueden medir
              //Observaciones que tienen un sensor, y estos sensores un subsistema
              //Y saber cuales pertenecen al deployment específico
            }).on('end', function() {
               
              res.render('devices', {
                title: 'Get Devices of Deployment',
                devices: dev, 
                nameDev: nameDev
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

});


//Deployments----------------------------------------FUNCIONA CON WATERFALL
router.get('/deploymentsWF', function(req, res, next){
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
});

////////////////////////////


module.exports = router;
