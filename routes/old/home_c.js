var number = 1;
var archivoTipo = "";
var express = require('express');
  router = express.Router(),
  mongoose = require('mongoose'),
  ReqSPARQL = mongoose.model('ReqSPARQL');//Poner modelo que guarda de los fismos
  fs = require('fs');
  multer = require('multer');

  storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'files/')
    },
    filename: function (req, file, cb) {
        cb(null, "file" + number + ".json");
  }
})

var upload = multer({ storage: storage });


router.post('/', upload.any(),function (req, res, next){
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

});

function leer(){
  var data = fs.readFileSync('files/file' + number + '.json');

    console.log("Lee el archivo ");
    if (err){
      console.error("No existen más archivos para leer", err);
      res.send("No existen más archivos para leer");
      return;
    }

    var jsonContent = JSON.parse(data);
    variables = jsonContent['vars'];
    for(var i in variables){
      varStr = JSON.stringify(variables[i]);
      varString = varStr.substr(1,varStr.length-2);

      if(varString === "lat"){
        archivoTipo = "geo";
      }

      else if(varString === "time"){
        archivoTipo = "net";
      }
    }
}

router.get('/comprobacion', function (req, res, next){
  Article.find(function(err, articles){
    console.log(articles);
    if (err){
      return console.log(err);
    } else{
      res.send(articles);
    }
  });
 });

router.get('/comprobacionArchivo/:id', function (req, res, next){
	fs.readFile('files/file' + req.params.id + '.json', 'utf8', function(err, data) {  
		if (err){
    		console.error("No existen más archivos para leer", err);
    		res.send("No existen más archivos para leer");
    		return;
		}
    	res.send(data);
    });
  number += 1;
});
