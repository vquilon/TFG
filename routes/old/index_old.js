var express = require('express');
var router = express.Router();

var https = require('https');
var http = require('http');
var async = require('async');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//var token = '';
var flagt=true;
var body = '';
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
//TOKEN---------------------------------------------
//con post no va
router.get('/token', function(req, res, next){
  //RECIBIR DATOS QUE TE ENVIAN
  /*var data = req.body;
  res.render('data', {//envia en index las variables
      title: 'Data example',
      data: data
    });
  console.log(typeof(data));*/
  var request = https.request(optionsToken, function(response) {
    console.log('STATUS /token: ' + response.statusCode);
    if(response.statusCode === 401){
      console.log("UNAUTORIZADO");
    }
    else{
      var token = '';
      console.log('HEADERS /token: ' + JSON.stringify(response.headers));

      // Buffer the body entirely for processing as a whole.
      var bodyChunks = [];
      response.on('data', function(chunk) {
        // You can process streamed parts here...
        bodyChunks.push(chunk);
        //console.log("CHUNK: "+chunk.length());
          
        token = JSON.parse(chunk).tokenId;
            
      }).on('end', function() {
        body = Buffer.concat(bodyChunks);
          
        // ...and/or process the entire body here.
        console.log("Render TOKEN:"+token);
        //envia en index las variables
        res.render('token', {
          title: 'Get Token',
          user: 'dmartin',
          token: token
        });
      })
    }
  });
  request.on('error', function(e) {
    console.log('ERROR /token: ' + e.message);
  });  
  request.end(); 
});


//OBSERVATIONS----------------------------------------FUNCIONA CON EL CALLBACK DE https.request (COMO DEBE SER, mas sencillo pero waterfall se recomienda)
router.get('/observations', function(req, res, next){
  /*async.waterfall(
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
            // Buffer the body entirely for processing as a whole.
            var bodyChunks = [];
            response.on('data', function(chunk) {
              // You can process streamed parts here...
              bodyChunks.push(chunk);
              //console.log("CHUNK: "+chunk.length());
                
              token = JSON.parse(chunk).tokenId;
                  
            }).on('end', function() {
              body = Buffer.concat(bodyChunks);
                
              // ...and/or process the entire body here.
                console.log("Render TOKEN "+token);
                callback(null, token);
            })
          }
        });
        request.on('error', function(e) {
          callback(e.message,null);
        });  
        request.end(); 
          
      },
      function getObservations(t, callback) {
        var options = {
          host: 'platform.fiesta-iot.eu',
          path: '/iot-registry/api/observations',
         // host: 'echo.jsontest.com',
         // path: '/key/value/one/two',
          method: 'GET',
            headers: {
                'Accept': 'application/json',
                'iPlanetDirectoryPro': token
            }
        };
        console.log("TOKEN "+t);
        //requestIoT('Resources', options, res)
        //SE puede usar http.get o request pero el resquest hay que hacer alfinal .end()
        var request = https.request(options, function(response) {
          console.log('STATUS /observations: ' + response.statusCode);
          if(response.statusCode === 401){
            //Token no valido unautorizado
            callback("UNAUTORIZADO",null);
          }
          else{
            console.log('HEADERS /observations: ' + JSON.stringify(response.headers));

            // Buffer the body entirely for processing as a whole.
            var bodyChunks = [];
            response.on('data', function(chunk) {
              // You can process streamed parts here...
              bodyChunks.push(chunk);
              //console.log("CHUNK: "+chunk.length());
            }).on('end', function() {
              body = Buffer.concat(bodyChunks);
              
              //console.log('BODY: ' + body);
              // ...and/or process the entire body here.
              res.render('observations', {
                title: 'Get Observations',
                obs: body
              });
            })
          }
        });
        request.on('error', function(e) {
          callback(e.message,null);
        });
        request.end();
        callback(null, t+" /observations");
      }
    ],
    function (err, caption) {
        if(err){
          console.log("ERROR "+err);
        }
        console.log(caption);
    }
  );*/
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
      response.on('data', function(chunk) {
        // You can process streamed parts here...
        bodyChunks.push(chunk);
        //console.log("CHUNK: "+chunk.length());
          
        token = JSON.parse(chunk).tokenId;
            
      }).on('end', function() {
        body = Buffer.concat(bodyChunks);
          
        // ...and/or process the entire body here.
        //PONER AQUI EL CALLBACK DE GET OBSERVATIONS
        console.log("Render TOKEN "+token);

        var options = {
          host: 'platform.fiesta-iot.eu',
          path: '/iot-registry/api/observations',
         // host: 'echo.jsontest.com',
         // path: '/key/value/one/two',
          method: 'GET',
            headers: {
                'Accept': 'application/json',
                'iPlanetDirectoryPro': token
            }
        };
        console.log("OPTIONS "+options.headers.iPlanetDirectoryPro);
        console.log("TOKEN CALL "+token);
        //requestIoT('Resources', options, res)
        //SE puede usar http.get o request pero el resquest hay que hacer alfinal .end()
        var request = https.request(options, function(response) {
          console.log('STATUS /observations: ' + response.statusCode);
          if(response.statusCode === 401){
            //Token no valido unautorizado
            console.log("UNAUTORIZADO");
          }
          else{
            console.log('HEADERS /observations: ' + JSON.stringify(response.headers));
            // Buffer the body entirely for processing as a whole.
            var bodyChunks = [];
            response.on('data', function(chunk) {
              // You can process streamed parts here...
              bodyChunks.push(chunk);
              //console.log("CHUNK: "+chunk.length());
            }).on('end', function() {
              body = Buffer.concat(bodyChunks);
              
              //console.log('BODY: ' + body);
              // ...and/or process the entire body here.
              res.render('observations', {
                title: 'Get Observations',
                obs: body
              });
            })
          }
        });
        request.on('error', function(e) {
          console.log("ERROR "+e.message);
        });
        request.end();
      })
    }
  });
  request.on('error', function(e) {
    console.log("ERROR "+e.message);
  });  
  request.end();
});

//RESOURCES----------------------------------------FUNCIONA CON WATERFALL
router.get('/resources', function(req, res, next){
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
            // Buffer the body entirely for processing as a whole.
            var bodyChunks = [];
            response.on('data', function(chunk) {
              // You can process streamed parts here...
              bodyChunks.push(chunk);
              //console.log("CHUNK: "+chunk.length());
                
              token = JSON.parse(chunk).tokenId;
                  
            }).on('end', function() {
              body = Buffer.concat(bodyChunks);
                
              // ...and/or process the entire body here.
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
      function getResources(t, callback) {
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
        console.log("TOKEN "+t);
        //requestIoT('Resources', options, res)
        //SE puede usar http.get o request pero el resquest hay que hacer alfinal .end()
        var request = /*await*/ https.request(options, function(response) {
          console.log('STATUS /resources: ' + response.statusCode);
          if(response.statusCode === 401){
            //Token no valido unautorizado
            callback("UNAUTORIZADO",null);
          }
          else{
            console.log('HEADERS /resources: ' + JSON.stringify(response.headers));
            // Buffer the body entirely for processing as a whole.
            var bodyChunks = [];
            response.on('data', function(chunk) {
              // You can process streamed parts here...
              bodyChunks.push(chunk);
              //console.log("CHUNK: "+chunk.length());
            }).on('end', function() {
              body = Buffer.concat(bodyChunks);
              //console.log('BODY: ' + body);
              // ...and/or process the entire body here.
              res.render('resources', {
                title: 'Get Resources',
                res: body
              });
            })
          }
        });
        request.on('error', function(e) {
          callback(e.message,null);
        });
          
        request.end();
        callback(null, t+" /resorces");
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
      response.on('data', function(chunk) {
        // You can process streamed parts here...
        bodyChunks.push(chunk);
        //console.log("CHUNK: "+chunk.length());
          
        token = JSON.parse(chunk).tokenId;
            
      }).on('end', function() {
        body = Buffer.concat(bodyChunks);
          
        // ...and/or process the entire body here.
        //PONER AQUI EL CALLBACK DE GET OBSERVATIONS
        console.log("Render TOKEN "+token);

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
        
        console.log("OPTIONS "+options.headers.iPlanetDirectoryPro);
        console.log("TOKEN CALL "+token);
        //requestIoT('Resources', options, res)
        //SE puede usar http.get o request pero el resquest hay que hacer alfinal .end()
        var request = https.request(options, function(response) {
          console.log('STATUS /devices: ' + response.statusCode);
          if(response.statusCode === 401){
            //Token no valido unautorizado
            console.log("UNAUTORIZADO");
          }
          else{
            console.log('HEADERS /devices: ' + JSON.stringify(response.headers));
            // Buffer the body entirely for processing as a whole.
            var bodyChunks = [];
            response.on('data', function(chunk) {
              // You can process streamed parts here...
              bodyChunks.push(chunk);
              //console.log("CHUNK: "+chunk.length());
            }).on('end', function() {
              body = Buffer.concat(bodyChunks);
              
              //console.log('BODY: ' + body);
              // ...and/or process the entire body here.
              res.render('data', {
                title: 'Get devices',
                data: body
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
/*
DEPLOYMENTS - TESTBED

-----------------------SmartSantander 
a1yp9GcKEPw37Bx5rslgRI4QLSNCwEwBatCIOe_W0dHZCmzj2WmkExz3qoNuvWg1pueAXn1Li0JrNjvBiQwV3Q==
-----------------------SoundCity(Inria-Paris)
s87UnnzFTAStKTL_wErGRTxPObzVT6zoAXUrS1PvuvAMtwHiDSKscfLBaeU44dnq6btRFQpVlI05VX6hkQgjuA==
-----------------------University of Surrey(SmartICS)
uyPgySZB-ikYt9HCYa37uQc-1fAOcyLn7RW64vsk8BsKIgc_n4qRPHXCCFyCdMKnSQb49_jfLH89D07A7H6zLS90qCN8a7byym6C2eS3LOA=
-----------------------KETI
hRWFx405M_0veyV1H7GQvtvo8GHAZ-9ynEJZL7mZ10Fl8PaaHf_MhN_qQdAJ6zDgKJGXIHqhBMvWOzgMvIG5DO69NnP4vrilxWgYfn6mhCI=

*/
module.exports = router;
