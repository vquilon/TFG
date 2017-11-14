var fs = require('fs');
var https = require('https');
var http = require('http');
var async = require('async');
var mongoose = require('mongoose'),
	//Deployments = mongoose.model('Deployments'),
	fesmo = mongoose.model('fesmo');//Poner modelo que guarda de los fesmos

var number;
number = fs.readdirSync('files/');
number = number.length;

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
          console.error("ERROR "+err);
        }
        console.log(caption);
    }
  );  
};