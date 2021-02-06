var fs = require('fs');
var https = require('https');
var http = require('http');

var mongoose = require('mongoose');
var mongo = require('mongodb');
//var Grid = require('mongodb').Grid;
var Grid = require('gridfs-stream');

//connect GridFS with and Mongo
var newurlMongdb = process.env.MONGODB_URI;
if(!newurlMongdb) {
  newurlMongdb = "mongodb://localhost:27017/prosumerFiot";
  // newurlMongdb = "mongodb://user:password@ds237620.mlab.com:37620/prosumerfiot";
  //mongoose.connect(urlMongdb);
  //var conn = mongoose.connection;
  //var conn = mongoose.createConnection(urlMongdb);
}



//Grid.mongo = mongoose.mongo;
//var gfs = Grid(conn.db);
//console.log(conn);
var MongoClient = mongo.MongoClient;
// create or use an existing mongodb-native db instance.
// for this example we'll just create one:
//var db = new mongo.Db('prosumerFiot', new mongo.Server("localhost", 27017));
//var db = new mongo.Db('prosumerfiot', new mongo.Server("user:password@ds237620.mlab.com", 37620));

  //Deployments = mongoose.model('Deployments'),
  //fismo = mongoose.model('fismo');//Poner modelo que guarda de los fismos



var useMongo = true;
MongoClient.connect(newurlMongdb, function (err, db) {
  if(err !== null) {
    useMongo = false;
    console.log("NO HAY CONEXION A LA BASE DE DATOS")
  }
});

//var mongo = require('mongodb').MongoClient;
// var number;
// number = fs.readdirSync('files/');
const dirents = fs.readdirSync('files/', { withFileTypes: true });
var number = dirents.filter(dirent => dirent.isFile()).map(dirent => dirent.name);
number = number.length;

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
var nameT = [];
//-----------------------SmartSantander 
var smartSantander = "a1yp9GcKEPw37Bx5rslgRI4QLSNCwEwBatCIOe_W0dHZCmzj2WmkExz3qoNuvWg1pueAXn1Li0JrNjvBiQwV3Q==";
testbeds[0]=smartSantander;
nameT[0]="Smart Santander";
//-----------------------SoundCity(Inria-Paris)
var soundCity = "s87UnnzFTAStKTL_wErGRTxPObzVT6zoAXUrS1PvuvAMtwHiDSKscfLBaeU44dnq6btRFQpVlI05VX6hkQgjuA==";
testbeds[1]=soundCity;
nameT[1]="Sound City";
//-----------------------University of Surrey(SmartICS)
var smartICS = "uyPgySZB-ikYt9HCYa37uQc-1fAOcyLn7RW64vsk8BsKIgc_n4qRPHXCCFyCdMKnSQb49_jfLH89D07A7H6zLS90qCN8a7byym6C2eS3LOA=";
testbeds[2]=smartICS;
nameT[2]="Smart ICS";
//-----------------------KETI
var keti = "hRWFx405M_0veyV1H7GQvtvo8GHAZ-9ynEJZL7mZ10Fl8PaaHf_MhN_qQdAJ6zDgKJGXIHqhBMvWOzgMvIG5DO69NnP4vrilxWgYfn6mhCI=";
testbeds[3]=keti;
nameT[3]="KETI";
//-----------------------Waterford Institute of Technology – TSSG(RealDC)
var realDC = "bJmHbf3m2A8E6ftmOEGtcn2iMZulg14DfU6ZKwVJfks78HlfnVtZ_AipIZfW2GjN6ItVMJoAzd7o664ArbwSr8rd2GfiQ16kRDDnTJpc_Z0=";
testbeds[4]=realDC;
nameT[4]="Real DC";
//-----------------------Univeristy of Thessaly (GR): Nitos FIesta IoT Extension
var nitos = "P5v07leDmwHCdZ-7lqbFBNVyAxmXuV0Vz_GwUeYVehmhi5mjD6VLs1q7dCwTrr0MQEbRdbFa7Nx2hMHS6xlO7w==";
testbeds[5]=nitos;
nameT[5]="Nitos";
//-----------------------GridNet(EXTEND)
var extend = "gg3MVCEADVr4w8Ledz619Ytph-O6-u2AtehqmicTfBdKPjiyA3YkDNkhFwahBlklGuAD-z854KsnPoBt3Fg3Kg==";
testbeds[6]=extend;
nameT[6]="EXTEND";
//-----------------------Tera4Agri
var tera4Agri = "A8nfIgx5d39uM-ffd2NU_IQP8hRN8aH9ZACN_Wld9mgwLXIS7graIsWTvbNyicQEQ478_pxceFUazwFXB3Yc7Q==";
testbeds[7]=tera4Agri;
nameT[7]="Tera4Agri";
/*//-----------------------NEW 1
var new1 = "B22BFi1KVB39zIjnTdv_dJ5LCPqAfYrrIB6GzBWI7pnqVOFzzeUGaKDECdSLyv8y5VdZ0VRH_N06C3HNiKnHnA==";
testbeds[4]=new1;
//-----------------------NEW 2
var new2 = "SQkpIs52bXH7hzb4Bjk1QOo0iq7s6zVdq4iTN0K3m03H4_qj3BHdz8u1OpbfdD95d1suggHotvIkXWHg2q14PQ==";
testbeds[5]=new2;
//-----------------------NEW 3
var new3 = "Y3PNOixpH-HmZKRtMNTPKRUV6eX0Z5h9f76XMeiEi4u7B-hyj4yvePCzG_G84-mlOv1GslUO2P1gGSeNxgD90VY7gfTtDQKW4QcEMxezFm8=";
testbeds[6]=new3;*/
var preUrlDep = "";


//FUNCINALIDAD CON fismoS---------------------------------------------------------------
exports.fismo = function (req, res, next){
  var d = new Date();
  //NUEVO
  console.log(req);
  var file = fs.readFileSync(req.files[0].path);
  console.log(file);
  //console.log("BUFFER: "+ Buffer.from(req.files[0].buffer));
  var name = "devices&Deployments"+ Date.now() + "N" + number + ".json";
  //var data =  /*Buffer.from(*/req.files[0].buffer/*)*/;//Fichero del fismo con los devices y deployments
  var data = file.toString();
  var origin = "Hostname Information: " + req.hostname + " | IP information: " + req.ip + " | ";
  //var secure = "Info Secure: " + req.secure + ".  ";
  //var cookies = "Cookies: " + JSON.stringify(req.cookies) + ".  ";
  var infoType = "Info type: " + req.header('content-type');
  var infoFile = " | Encoding: " + req.files[0].encoding + " |  Size: " + req.files[0].size + " bytes | MimeType: " + req.files[0].mimetype+" | Type: "+typeof(data);
  var header = "Date: "+d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()+" | Time: "+d.getHours()+":"+d.getMinutes();
  var info = header + origin + infoType + infoFile;

  MongoClient.connect(newurlMongdb, function (err, db) {

  /*db.open(function (err) {
    if (err){ 
      return handleError(err);
    }*/
   

    var gfs = Grid(db, mongo);
    var writestream = gfs.createWriteStream(
      {
        filename: 'DepsDevsObs.json', // a filename
        mode: 'w', // default value: w
        //chunkSize: 1024,
        content_type: req.files[0].mimetype, // For content_type to work properly, set "mode"-option to "w" too!
        root: 'fismos',
      }
    );
    fs.createReadStream(req.files[0].path).pipe(writestream);

    writestream.on('close', function (file) {
      // do something with `file`
      console.log(file.filename);
      db.close();
    });

  //});

  /*var newfismo = {
    name : name,
    info : info,
    data : data
  };
  mongo.connect(urlMongdb, function(err, db){
    if(err) throw err;
    db.collection('fismos').insertOne(newfismo, function(err, records){
      if(err){
        console.warn(err.message);
      }
      else{
        console.log("fismo added");
      }
      db.close();
    });
    
  });

  res.send(data);*/
  //db.close();
  });
};

exports.fismo2 = function (req, res, next){
  //FECHA Y HORA
  var dateTime = new Date();
  var day = dateTime.getDate();
  var month = dateTime.getMonth()+1;
  var year = dateTime.getFullYear();
  var date = day+"-"+month+"-"+year;
  var time = dateTime.getHours()+":"+dateTime.getMinutes();
  //NUEVO
  //var file = fs.readFileSync(req.files[0].path);
  //console.log(req);
  //CREAR VARIABLES A GUARDAR
  var name = "DevicesDeployments";
  var data =  req.files[0].buffer;//Fichero del fismo con los devices y deployments
  console.log("Tipo de buffer1 "+typeof(req.files[0].buffer));
  console.log("Tipo de buffer2 "+typeof(data));
  data = data.toString();
  console.log("Tipo de buffer3 "+typeof(data));
  //data = JSON.parse(data);
  var origin = "Hostname Information: " + req.hostname + " | IP information: " + req.ip + " | ";
  //var secure = "Info Secure: " + req.secure + ".  ";
  //var cookies = "Cookies: " + JSON.stringify(req.cookies) + ".  ";
  var infoType = "Info type: " + req.header('content-type');
  var infoFile = " | Encoding: " + req.files[0].encoding + " |  Size: " + req.files[0].size + " bytes | MimeType: " + req.files[0].mimetype
  var header = "Date: "+date+" | Time: "+ time + " | ";
  var info = header + origin + infoType + infoFile;
  console.log("INFO: "+info);
  //GUARDAR EN LA BASE DE DATOS
  /*var newfismo = {
    name : name,
    info : info,
    data : data
  };*/
  MongoClient.connect(newurlMongdb, function (err, db) {
  /*db.open(function (err, db) {
    if (err){ 
      return handleError(err);
      db.close();
    }*/
    var gfs = Grid(db, mongo);
    var writestream = gfs.createWriteStream(
      {
        filename: 'DepsDevsObs.json', // a filename
        mode: 'w', // default value: w
        //chunkSize: 1024,
        content_type: req.files[0].mimetype, // For content_type to work properly, set "mode"-option to "w" too!
        root: 'fismos',
      }
    );
    
    writestream.on('close', function(file){
      console.log(file.filename);
      res.send(file);
      db.close();
    });
    writestream.on('error', function(err){
      console.log("ERROR "+err);
    });
    writestream.write(data);
    writestream.end();
  //});
  /*mongo.connect(urlMongdb, function(err, db){
    if(err) throw err;
    db.collection('fismos').findAndModify(
      {name:"DepsDevsObs"},
      [['_id','asc']],
      {$set: {"info":info, "data":data}},
      //Crea uno nuevo si no encuentra ningun fismo(si esta vacio)
      //https://stackoverflow.com/questions/16358857/mongodb-atomic-findorcreate-findone-insert-if-nonexistent-but-do-not-update
      {upsert: true},
      function(err, result){
        if(err){
          console.warn("ERROR "+err.message);
          /*db.collection('fismos').insertOne(newfismo, function(err, records){
            console.log("Record added as "+records[0]._id);
          });//*
        }else{
            //console.dir(result);
            console.log("Update fismo");
        }

        db.close();
    });
  });*/

  //ANTIGUO CON LA BD ABIERTA EN APP
  /*fismo.update({name:"DevicesDeployments"}, {info:info, data:data}, function(err){
    if(err){
      console.log("No existe ningún dato, Creando...");
      var newfismo = new fismo({
          name : name,
          info : info,
          data : data
      });
      newfismo.save(function (err) {
      if (err){
         console.error(err);
      } 
      });
    }
  });*/
  
  //res.send(data);
  //db.close();
  });
};

exports.readMongo = function (req, res, next){
 //ANTIGUO CON LA BD ABIERTA EN APP
 /*fismo.find(function(err, fismo){
    console.log("Tipo: "+ typeof(fismo));
    var f = JSON.stringify(fismo);
    console.log("Tipo2: "+typeof(f));
    //console.log(JSON.parse(fismo));
    if (err){
      return console.error(err);
    } else{
      res.render('data',
          { title:'Data of MongoDB',
            data:f});
    }
  });*/

  /*var fismoArray = [];
  var names = [];
  mongo.connect(urlMongdb, function(err, dbs){
    if(err) throw err;
    var cursor = dbs.collection('fismos.files').find();
    cursor.forEach(function(doc, err){
      fismoArray.push(doc);
    }, function(){
      dbs.close();
      //var dataJson=JSON.parse(fismoArray[0].data);
      for(var i=0;i<fismoArray.length;i++){
        names.push(fismoArray[i].filename);
        console.log(fismoArray[i].filename+" i:"+i);
        
      }
    });
  });*/
  //for(var i=0;i<names.length;i++){
     //Version NUEVA con GRIDFS
       MongoClient.connect(newurlMongdb, function (err, db) {
        /*db.open(function (err, db) {
          if (err){ 
            console.log("ERROR "+err);
            db.close();
          }*/
          var gfs = Grid(db, mongo);
          //console.log(gfs);
          gfs.collection('fismos');
          gfs.files.find().toArray(function (err, files) {
            if(err){console.log("ERROR "+err);}
            else{
              console.log(files);
              var long = Number(files[0].length);
              var data1 = "";
              var data2 = "";
              var data3 = "";
              var data = [];
              var readstream = gfs.createReadStream({
                filename: files[0].filename
              });

              readstream.on("data", function(chunk){
                if(data1.length+data2.length+data3.length<=long/3){
                  data1+=chunk.toString();
                } else if(data1.length+data2.length+data3.length<=(2*long)/3){
                  data2+=chunk.toString();
                } else if(data1.length+data2.length+data3.length<=long){
                  data3+=chunk.toString();
                }
                
                //console.log("Numero de chunks "+data.length);
              });

              readstream.on("end", function(){
                data.push(data1);
                data.push(data2);
                data.push(data3);
                //console.log("FIRST "+typeof(data));
                //data = JSON.parse(data);
                //console.log("BUFFER "+typeof(data));
                //if(i+1===names.length){
                  res.render('data',{ 
                    title:'Data of MongoDB',
                    data:data
                  });
                  db.close();
                //}
              });
            }
          });
        //});db.open
        db.close();
      });
  //}
  


  //Version anterior con mongo sin mas
  /*mongo.connect(urlMongdb, function(err, db){
    if(err) throw err;
    var cursor = db.collection('fismos').find();
    cursor.forEach(function(doc, err){
      fismoArray.push(doc);
    }, function(){
      db.close();
      //var dataJson=JSON.parse(fismoArray[0].data);
      res.render('data',{ 
        title:'Data of MongoDB',
        data:fismoArray
      });
    });
  });

 };*/
//Abrir y cerrar conexion en vez de iniciarla al principio en app.js
/*mongoClient.connect(urlMongdb, function(err, db) {
      if (err) {
          console.log('Sorry unable to connect to MongoDB Error:', err);
      } else {
          console.log("Connected successfully to server", urlMongdb);
          var collection = db.collection('fismo');
    
          console.log("Print persons collection:- ");
    
          collection.find({}).toArray(function(err, person) {
              console.log(JSON.stringify(person, null, 2));
          });
    
          db.close();
      }
  });
*/
};
//Mostrar los deployments por mongo o files, y de un deployment mostrar los devices


exports.home = function(req, res, next){
  var listArray = [];
  MongoClient.connect(newurlMongdb, function(err, db){
    if(err) throw err;
    var cursor = db.collection('devicesList').find();
    cursor.forEach(function(doc, err){
      listArray.push(doc);
    }, function(){
      var listName = [];
      var devices = [];
      var id = [];
      var requestDevices="";
      for(var i=0;i<listArray.length;i++){
        console.log("Data id "+listArray[i]._id);
        console.log("Nombre de la lista"+listArray[i].listName);
        console.log("Listas "+listArray.length);
        listName.push(listArray[i].listName);
        //var id1 = (listArray[i]._id).toString();
        //id1="list"+(id1).substring(0,3);
        id.push(listArray[i]._id);
        var auxD=[];
        for(var j=0;j<listArray[i].devices.length;j++){
          var dev = "<"+listArray[i].devices[j]+"> ";
          auxD.push(listArray[i].devices[j]);
        }
        console.log("Numero Devices "+auxD.length);
        devices.push(auxD);
        console.log("Numero Listas de Device "+devices.length);
        requestDevices+=dev;
      }
      console.log("Length of lists "+devices.length);
      //console.log(data[0].type);
      res.render('index', {
        id: id,
        devices: devices,
        listName: listName,
        APIKeyGMJS: APIKeyGMJS,
      });

      db.close();
    });
  });
}

exports.listsOfDevices = function(req, res, next){
  var listName = req.body.listName;
  var id = req.body.listId;
  var listArray = [];
  console.log("Nombre de la lista"+listName);
  console.log("Data "+id);
  var data = {
   "type":[],
    "endp":[],
    "qk":[],
    "unit":[],
    "pos":[],
     "value":[],
     "Dep":[],
      "nameDep":[]
   };
  MongoClient.connect(newurlMongdb, function(err, db){
    if(err) throw err;
    var cursor = db.collection('devicesList').find();
    cursor.forEach(function(doc, err){
      listArray.push(doc);
    }, function(){
      var devices = [];
      var requestDevices="";
      var length=0;
      for(var i=0;i<listArray.length;i++){
        console.log("--Nombre de la lista"+listArray[i].listName);
        console.log("--Data "+listArray[i]._id);
        //var auxD=[];
        //var id2 = (listArray[i]._id).toString();
        if(listName==listArray[i].listName&&id==listArray[i]._id){
          console.log("Coincide");
          for(var j=0;j<listArray[i].devices.length;j++){
            if(j+1==listArray[i].devices.length){
              var dev = "<"+listArray[i].devices[j]+">";
            }
            else{
              var dev = "<"+listArray[i].devices[j]+"> ";
            }
            devices.push(listArray[i].devices[j]);
            data.type.push(listArray[i].types[j]);
            data.endp.push("--");
            data.qk.push(listArray[i].qks[j]);
            data.unit.push(listArray[i].units[j]);
            data.pos.push("--");
            data.value.push(listArray[i].values[j]);
            data.Dep.push("--");
            data.nameDep.push("--");
          }
          console.log("-Device "+dev);
          requestDevices+=dev;
        }
        //console.log("Numero Devices "+auxD.length);
        //devices.push(auxD);
        
      }
      console.log(data);
      console.log("Archivo FINAL "+requestDevices);
      var token = '';
      var body="";
      var request = https.request(optionsToken, function(response) {
        console.log('STATUS /token: ' + response.statusCode);
        if(response.statusCode === 401){
          console.info("UNAUTORIZADO TOKEN");
          res.render('lists', {
                    status: "status",
                    data: data,
                    length: length,
                    devices: devices,
                    listName: listName,
                    APIKeyGMJS: APIKeyGMJS,
                  });
        }
        else{
          console.log('HEADERS /token: ' + JSON.stringify(response.headers));
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
              "SELECT ?obs ?s ?sys ?t ?num ?unit ?long ?lat ?qk ?Dep ?type "+
              "WHERE {"+
                "?obs a ssn:Observation."+
                "?obs ssn:observedBy ?s ."+
                "VALUES ?s { "+
                  requestDevices+//"<"+dep+">"+
                " } ."+
                "?s rdf:type ?type ."+
                "optional{"+
                "?s iot-lite:isSubSystemOf ?sys ."+
                "?sys ssn:hasDeployment ?Dep ."+
                "}"+
                "?obs ssn:observationSamplingTime ?time ."+
                "?time time:inXSDDateTime ?t ."+
                "?obs ssn:observationResult ?result ."+
                "?result ssn:hasValue ?value ."+
                "?obs geo:location ?point ."+
                "?point geo:lat ?lat ."+
                "?point geo:long ?long. "+
                "?value dul:hasDataValue ?num ."+
                "?s iot-lite:hasQuantityKind ?qKURI ."+
                "?qKURI rdf:type ?qk ."+
                "?s iot-lite:hasUnit ?unitURI ."+
                "?unitURI rdf:type ?unit ."+
              "}ORDER BY ?s";
              console.log(postData);
            var options = {
              host: 'platform.fiesta-iot.eu',
              path: '/iot-registry/api/queries/execute/global',
              method: 'POST',
              headers: {
                    'Content-Type': 'text/plain',
                    'Content-Length': Buffer.byteLength(postData),
                    'Accept': 'application/json',
                    'iPlanetDirectoryPro': token
              },
              timeout: 600000//10 minutos
            };
            //var timeObs = [];//fecha de las observaciones
            //var measures = [];//medidas de las observaciones
            var request = https.request(options, function(response) {
              body="";
              console.log('STATUS /observations: ' + response.statusCode);
              if(response.statusCode === 401){
                //Token no valido unautorizado
                console.log("UNAUTORIZADO");
                res.render('lists', {
                    status: "status",
                    data: data,
                    length: length,
                    devices: devices,
                    listName: listName,
                    APIKeyGMJS: APIKeyGMJS,
                  });
              }
              else{
                console.log('HEADERS /observations: ' + JSON.stringify(response.headers));
                response.on('data', function(chunk) {
                  //Capturar esto para ver si hay error y transmitir a la pagina un error en el servidor y guardar logs
                  body+=chunk;
                  console.log("CHUNK "+chunk);
                }).on('end', function() {
                  /*var data={
                     "type":[],
                     "endp":[],
                     "qk":[],
                     "unit":[],
                     "pos":[],
                     "value":[],
                     "Dep":[],
                     "nameDep":[]
                  };*/
                  if(response.statusCode===200){
                    var status = response.statusCode;
                    var JsonChunk = JSON.parse(body);
                    var items = JsonChunk.items;
                    //Extraer todas las observaciones que me sirven
                    if(items.length==0){
                      //No hay observaciones de este sensor
                      console.log("VACIOOOOOO");
                    }
                    else{
                      console.log("LLEEEENOO Listas");
                      //var flagList = false;
                      //var tNew="";
                      var sensorN="";
                      var flagNuevo=false;
                      var flagTime = false;
                      for(i=0;i<items.length;i++){
                        if(items[i].s!=undefined){
                          var sensorN1=items[i].s;
                          if(sensorN==""){
                            sensorN=items[i].s;
                            flagNuevo=true;
                          }
                          else{
                            if(sensorN!=sensorN1){
                              flagNuevo=true;
                            }else{
                              flagNuevo=false;
                            }
                          }

                          //Si es nuevo entonces no comprueba con el tiempo anterior
                          /*if(items[i].t){
                            if(tNew=""){
                              tNew = new Date(items[i].t.substring(0,items[i].t.lastIndexOf("^^")));
                              flagTime = true;
                            }
                            else{
                              var t = new Date(items[i].t.substring(0,items[i].t.lastIndexOf("^^")));
                               if(t>tNew){
                                tNew=t;
                                flagTime = true;
                              }else{
                                flagTime = false;
                              }
                            }
                          }*/

                          if(/*flagTime&&*/flagNuevo){
                            //Añade uno nuevo solo cuando detecta un nuevo sensor y tiene guardado la posicion del mas nuevo
                            length++;
                            data.type.push(items[i].type.substring(items[i].type.lastIndexOf("#")+1));          
                            if(items[i].endp!=undefined){
                              data.endp.push(items[i].endp.substring(0,items[i].endp.lastIndexOf("^")-1));
                            }
                            else{
                              data.endp.push("NODATA");
                            }
                            if(items[i].qk!=undefined){
                              data.qk.push(items[i].qk.substring(items[i].qk.lastIndexOf("#")+1));
                            }
                            else{
                              data.qk.push("NODATA");
                            }
                            if(items[i].unit!=undefined){
                              data.unit.push(items[i].unit.substring(items[i].unit.lastIndexOf("#")+1));
                            }
                            else{
                              data.unit.push("NODATA");
                            }
                            if(items[i].lat!=undefined&&items[i].long!=undefined){
                              var pos ={
                                "lat":Number(items[i].lat.substring(0,items[i].lat.lastIndexOf("^")-1)),
                                "long":Number(items[i].long.substring(0,items[i].long.lastIndexOf("^")-1))
                              }
                               data.pos.push(pos);
                            }
                            else{
                              data.pos.push("NODATA");
                            }
                            if(items[i].Dep!=undefined){
                              for(var j=0;j<testbeds.length;j++){
                                if(testbeds[j]==items[i].Dep.substring(items[i].Dep.lastIndexOf('/') + 1)){
                                 data.nameDep[i]=nameT[j];
                                }
                              }
                              data.Dep.push(items[i].Dep);
                            }
                            else{
                              data.Dep.push("testbed");
                            }
                            data.value.push(Number(items[i].num.substring(0,items[i].num.indexOf("^^"))));
                          }
                        }
                      }
                    }//else lleno
                  }//response 200
                  else{
                    //Fiesta-Iot ha respondido con un 500 o no ha funcionado la peticion

                  }
                  console.log("Length of lists "+devices.length);
                  //console.log(data[0].type);
                  res.render('lists', {
                    status: status,
                    data: data,
                    length: length,
                    devices: devices,
                    listName: listName,
                    APIKeyGMJS: APIKeyGMJS,
                  });
                });//end
              }//else 401
            });

            request.on('error', function(e) {
              console.log("ERROR "+e.message);
              res.render('lists', {
                    status: "status",
                    data: data,
                    length: length,
                    devices: devices,
                    listName: listName,
                    APIKeyGMJS: APIKeyGMJS,
                  });
            });
            request.write(postData);
            request.end();
          });
        }
      });
      request.on('error', function(e) {
        console.log("ERROR "+e.message);
        res.render('lists', {
                    status: "status",
                    data: data,
                    length: length,
                    devices: devices,
                    listName: listName,
                    APIKeyGMJS: APIKeyGMJS,
                  });
      });  
      request.end();
      db.close();
    });
  });
}


exports.readFiles = function (req, res, next){
  const dirents = fs.readdirSync('files/', { withFileTypes: true });
  const filesNames = dirents
    .filter(dirent => dirent.isFile())
    .map(dirent => dirent.name);
  
  // var files = fs.readdirSync('files/');
  console.log(filesNames);
  var data = [];
  filesNames.forEach(file => {
    data.push(fs.readFileSync('files/' + file, 'utf8')); 
  });

  res.render('files',
          { title:'Read Files',
            files:filesNames,
            data:data});
};

exports.deploymentsReadFile = function(req,res,next){
  const dirents = fs.readdirSync('files/', { withFileTypes: true });
  const files = dirents.filter(dirent => dirent.isFile()).map(dirent => dirent.name);
  var data = "";
  var max = 0;
  var n="";
  files.forEach(file => {
    console.log("Nombre del archivo: "+file);
    // console.log("Tipo del archivo: "+typeof(file));
    var maxf = Number(file.substring(file.lastIndexOf('T')+1,file.lastIndexOf('N')));
    if(maxf>max){
      n=file;
      console.log("AHORA: "+n);
    }
  });
  data = fs.readFileSync('files/' + n, 'utf8');
     
  var deps = [];
  var nameDeps = [];
  var preUrlDeps = [];
  //Completar añadiendo lectura de mongodb------------------------------
  //console.log("CHUNK "+chunk);
  //var JsonChunk = JSON.parse(chunk);
  console.log(typeof(data));
  console.log(typeof(data.items));
  
  var dataJson = JSON.parse(data);//fismoArray[0].
  var items = dataJson.items;
  //console.log(items.length);
  //console.log(items[2].Deps)
  for(var i=0;i<items.length;i++){
    if(items[i].DepOne){
      var d = items[i].DepOne;
      var urlDeps = d.substring(d.lastIndexOf('/') + 1);
      deps.push(urlDeps);
       //TRES FORMAS PARA COGER TODO EL TEXTO DESPUÉS DEL ULTIMO CARACTER EN ESTE CASO '/'
       //ARRAY SPLIT
        // deps[i].split("/")[deps[i].split("/").length - 1];
       //REGULAR EXPRESSION
       //  /[^/]*$/.exec(deps[i])[0];
       //LASTINDEX AND SUBSTRING - Es la mas eficiente de todas, requiere menos iteracciones y es más claro
       
      switch (urlDeps) {
        case testbeds[0]:
          //SmartSantander
          nameDeps.push("Smart Santander");
          break;
        case testbeds[1]:
          //Soundcity
          nameDeps.push("Sound City");
          break;
        case testbeds[2]:
          //SmartICS
          nameDeps.push("Smart ICS");
          break;
        case testbeds[3]:
          //KETI
          nameDeps.push("KETI");
          break;
        case testbeds[4]:
          //TSSG(RealDC)
          nameDeps.push("Real DC");
          break;
        case testbeds[5]:
          //Univeristy of Thessaly(Nitos)
          nameDeps.push("NITOS");
          break;
        case testbeds[6]:
          //GridNet(EXTEND)
          nameDeps.push("EXTEND");
          break;
        case testbeds[7]:
          //Tera4Agri
          nameDeps.push("Tera4Agri");
          break;
        default:
          nameDeps.push("Testbed");
          break;
       }
      //Coge el enlace antes de el numero
        preUrlDep = d.substring(0,d.lastIndexOf('/')+1);
        preUrlDeps.push(preUrlDep);
    }
  }
  console.log("DEPLOYMENTS Json "+ deps);
          
  res.render('deployments', {
     title: 'Deployments',
     deps: deps, 
      nameDeps: nameDeps,
      preUrlDeps: preUrlDeps
  });
};

exports.deploymentsReadMongo = function(req,res,next){

  /*var fismoArray = [];
  mongo.connect(urlMongdb, function(err, db){
    if(err) throw err;
    var cursor = db.collection('fismos').find();
    cursor.forEach(function(doc, err){
      fismoArray.push(doc);
    }, function(){*/
      //LA FIESTA VA AQUI
  

  MongoClient.connect(newurlMongdb, function (err, db) {
  //conn.once('open', function(){
  //console.log(conn.db);
  //console.log(mongoose.mongo);

  /*db.open(function (err, db) {
    if (err){ 
      console.log("ERROR "+err);
    db.close();
    }*/
    //var bucket = new mongo.GridFSBucket(db);
    var gfs = Grid(db, mongo);
    //NUEVO
    //var gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('fismos');
    gfs.files.find().toArray(function (err, files) {
      if(err){
        console.log("ERROR "+err);
        db.close();
      }
      else{
        console.log(files);
        var data = "";

        var readstream = gfs.createReadStream({
          filename: files[0].filename
        });

        readstream.on("data", function(chunk){
          //console.log(chunk.toString());
          data+=chunk.toString();
        });

        readstream.on("end", function(){
          var deps = [];
          var nameDeps = [];
          var preUrlDeps = [];
          //Completar añadiendo lectura de mongodb------------------------------
          //console.log("CHUNK "+chunk);
          //var JsonChunk = JSON.parse(chunk);
          console.log(typeof(data));
          console.log(typeof(data.items));
          
          var dataJson = JSON.parse(data);//fismoArray[0].
          var items = dataJson.items;
          //console.log(items.length);
          //console.log(items[2].Deps)
          for(var i=0;i<items.length;i++){
            if(items[i].DepOne){
              var d = items[i].DepOne;
              var urlDeps = d.substring(d.lastIndexOf('/') + 1);
              deps.push(urlDeps);
               //TRES FORMAS PARA COGER TODO EL TEXTO DESPUÉS DEL ULTIMO CARACTER EN ESTE CASO '/'
               //ARRAY SPLIT
                // deps[i].split("/")[deps[i].split("/").length - 1];
               //REGULAR EXPRESSION
               //  /[^/]*$/.exec(deps[i])[0];
               //LASTINDEX AND SUBSTRING - Es la mas eficiente de todas, requiere menos iteracciones y es más claro
               
              switch (urlDeps) {
                case testbeds[0]:
                  //SmartSantander
                  nameDeps.push("Smart Santander");
                  break;
                case testbeds[1]:
                  //Soundcity
                  nameDeps.push("Sound City");
                  break;
                case testbeds[2]:
                  //SmartICS
                  nameDeps.push("Smart ICS");
                  break;
                case testbeds[3]:
                  //KETI
                  nameDeps.push("KETI");
                  break;
                case testbeds[4]:
                  //TSSG(RealDC)
                  nameDeps.push("Real DC");
                  break;
                case testbeds[5]:
                  //Univeristy of Thessaly(Nitos)
                  nameDeps.push("NITOS");
                  break;
                case testbeds[6]:
                  //GridNet(EXTEND)
                  nameDeps.push("EXTEND");
                  break;
                case testbeds[7]:
                  //Tera4Agri
                  nameDeps.push("Tera4Agri");
                  break;
                default:
                  nameDeps.push("Testbed");
                  break;
               }
              //Coge el enlace antes de el numero
                preUrlDep = d.substring(0,d.lastIndexOf('/')+1);
                preUrlDeps.push(preUrlDep);
            }
          }
          console.log("DEPLOYMENTS Json "+ deps);
                  
          res.render('deployments', {
             title: 'Deployments',
             deps: deps, 
              nameDeps: nameDeps,
              preUrlDeps: preUrlDeps
          });
          db.close();
        });
      }
    });
  });
    //db.close();
  //});//MongoCLient
};
/*
  Systemas
  -hasSubsystem(todos los subDevices que tienen)
  -onPlatform(caracteristica)
  -hasDeployment
  -type(Device)

  Devices
  -hasQuantityKind | Se comporta como un ssn:Sensor que es lo que miden las Observation
  -hasUnit         | Este Device se utiliza para buscar Obervation que tengan asociado un ssn:Sensor(Sensor==Device)
  -isSubSystemOf
  -type(specific)
  -exposedBy(determina un service(iot-lite))
    Los Service son servicios que pueden tener algunos devices, los endpoint determinan medidas en tiempo real
    Puede ser util, se puede agregar un endpoint al fismo y que este la opción también

  Device==System(No tiene subsistemas)
  -hasQuantityKind | Se comporta como un ssn:Sensor que es lo que miden las Observation
  -hasUnit         | Este Device se utiliza para buscar Obervation que tengan asociado un ssn:Sensor(Sensor==Device)
  -onPlatform
  -hasDeployment
  -type(Specific)


  Todos los devices tienen un type, si es Device es un systema y tiene subsistemas que tienen un tipo especifico
  y los systemas tienen siempre un deployment pero hay devices sin systema que tienen un tipo especifico y un deployment
  Los systemas tiene un Onplatform siempre
                       
    :OnPlatform         ______________________________          
    :HasDeployment      | -> Devices:type(especific) |
  Systems:type(device)__| -> Devices:type(especific) |
     |                  | -> Devices:type(especific) | El sistema tiene caracteristicas de sistema y subsistemas(cada
     |                  |____________________________| device con su tipo y caracteristicas de device)
     |                  
  ___|___________________
  |Device:type especific| El systema es un Device y tiene caracteristicas de system y device
  |_____________________|

  Solo se obtienen devices del type Device porque la busqueda que hize con SPARQL solo meti a los de type Device
  Tengo que mirar si se pueden agregar todos o si hay alguno que los engloba a todos

  Cada Deployment tiene x devices, un device(Su tipo es Device) puede ser un sistema y si lo es tiene sub devices y estos son de 
  algun tipo(pero no tienen un type para saberlo, Hay que averiguar si pueden tener medidas o unidades para
  saber que tipo de Device es.
              ______________
             | ->  dev:type|
  Deployment |_____________|
             | ______________________    ________
             | ->       sys         |-> |dev:type|
             |     dev:type(Device) |   |________|
             |______________________|

SYSTEMS==DEVICES - 14/11/2017
0:1544 https://platform.fiesta-iot.eu/iot-registry/api/resources/ACeOoODFI1jLuBSxwn1o600ML41KRbtml_Tmjs1hWxTtr-5tgkXqNYOMjfUKju4j-ESpDtQcOGzDi1PgCOH15auCQZ_LLZ0Gl3JDAOc9fH8=
"qK": "http://purl.org/iot/vocab/m3-lite#Humidity",
"unit": "http://purl.org/iot/vocab/m3-lite#Percent"
1:3414 https://platform.fiesta-iot.eu/iot-registry/api/resources/QzzCgR5DFPTemE8Kzc_-j3GPgx38icHOj4vGrS0dxP6DMbhcr4U-v-9dgUDdpv5ElzAuiCR_eabUXKi0Zy82fAcUVU4eBCb0qF2hipH7PfU=
"qK": "http://purl.org/iot/vocab/m3-lite#TemperatureWasteContainer",
"unit": "http://purl.org/iot/vocab/m3-lite#DegreeCelsius"
2:4413 https://platform.fiesta-iot.eu/iot-registry/api/resources/aqoBU_y-A30Ie9EE2bQGVVBlHCOXF0WqI-Zd8NoHl_-HLiuTVbWQf4gJSw-_oH4b8hoR89AOqN4pXeKvi3wxOltFAObU0nBRMRGxVqHEXVg=
"qK": "http://purl.org/iot/vocab/m3-lite#TemperatureWasteContainer",
"unit": "http://purl.org/iot/vocab/m3-lite#DegreeCelsius"
3:4546 https://platform.fiesta-iot.eu/iot-registry/api/resources/cQ1aaePYADz5Ge2Goo17Z2F9543A5qTTVYk_PSoRlAbjFuatZVR46gcY08rgLAKD7Nrf6y_VHjuIfypKjmRX_gMn46ld8XxKKDG8IOCQoWg=
"qK": "http://purl.org/iot/vocab/m3-lite#Humidity",
"unit": "http://purl.org/iot/vocab/m3-lite#Percent"
*/
/*exports.readMongoDevofDep = function(req,res,next){
  var allD=0;
  var nameDep = req.body.nDep;//para ver que se envia desde el formulario
  var dep = req.body.dep;
  var preUrl = req.body.preUrl;
  console.log("Nombre del deployment seleccionado:"+nameDep);
  console.log("Nombre de la url del deployment:"+dep);
  dep = preUrl + dep;
  
  var fismoArray = [];
  mongo.connect(urlMongdb, function(err, db){
    if(err) throw err;
    var cursor = db.collection('fismos').find();
    cursor.forEach(function(doc, error){
      if(error) throw error;
      fismoArray.push(doc);
    }, function(){
      //LA FIESTA VA AQUI
      var dataJson = JSON.parse(fismoArray[0].data);
      var items = dataJson.items;
      var devices = [];//dispositivos que son su propio systema
      var typeDev = [];
      var endpoints = [];
      var qks = [];
      var units = [];
      var positions = [];
      var measures = [];
      //var devs = [];
      //Array de systemas
      var sys = [];
      //Array de array donde van los subsistemas
      var subsystems = [];
      var typeSubs = [];
      var endSubs = [];
      var qkSubs = [];
      var unitSubs = [];
      var positionSubs = [];
      var measureSubs =[];
      //Extraer todos los devices que me sirven
      var i = 0;
      var numSys = 0;
      for(i;i<items.length;i++){
      //if(items[i].dev.substring(0,d.lastIndexOf("/"))!="https://platform.fiesta-iot.eu/iot-registry/api/observations"){
        if(items[i].Dep!=undefined){
        //Si el device no tiene Depl o un systema con Deplo no sirve el device
          if(items[i].Dep==dep){//Que el deployment sea el que se ha seleccionado
            //Los dev que tienen un sys se añaden en otro momento
            if(items[i].dev!=undefined){//hay subD o no
              //if(items[i].type!="http://purl.oclc.org/NET/ssnx/ssn#Device"){
                //Solo leo los dispositivos que son del tipo Device osea systemas
                
                if(items[i].type.substring(items[i].type.lastIndexOf("#")+1)=="Device"){
                  //typeDev.push("System");
                  sys.push(items[i].dev);
                  var auxS = [];
                  var auxT = [];
                  var auxE = [];
                  var auxqK = [];
                  var auxU = [];
                  var auxP = [];
                  var auxM = [];
                  //Agregar aqui PLATFORM con localizacion
                  //Hay Subsystemas o no
                  if(items[i].subD!=undefined){
                    var j=0;
                    //Busca los subsystemas que tiene ese device y los mete en un array
                    for(j;j+i<items.length;j++){
                      if(items[i+j].dev==items[i].dev){
                        auxS.push(items[i+j].subD);
                        auxT.push(items[i+j].typeSubD.substring(items[i+j].typeSubD.lastIndexOf("#")+1));
                        //NUMERO DEVICES
                        allD++;
                        if(items[i+j].endp!=undefined){
                          auxE.push(items[i+j].endp.substring(0,items[i+j].endp.lastIndexOf("^")-1));
                        }
                        else{
                          auxE.push("NODATA");
                        }
                        //Puede que haya que hacer sentencia if else pero en teoria todos los devices tienen un qk y unit
                        if(items[i+j].qK!=undefined){
                          auxqK.push(items[i+j].qK.substring(items[i+j].qK.lastIndexOf("#")+1));
                        }
                        else{
                          auxqK.push("NODATA");
                        }
                        if(items[i+j].unit!=undefined){
                          auxU.push(items[i+j].unit.substring(items[i+j].unit.lastIndexOf("#")+1));
                        }
                        else{
                          auxU.push("NODATA");
                        }
                        if(items[i+j].lat!=undefined&&items[i+j].long!=undefined){
                          var pos ={
                            "lat":Number(items[i+j].lat.substring(0,items[i+j].lat.lastIndexOf("^")-1)),
                            "long":Number(items[i+j].long.substring(0,items[i+j].long.lastIndexOf("^")-1))
                          }
                          auxP.push(pos);
                        }
                        else{
                          auxP.push("NODATA");
                        }
                        //NUEVO
                        if(items[i+j].num!=undefined){
                          
                          if(t){

                          }
                          Number(items[i+j].num.substring(0,items[i].num.indexOf("^^")))
                        }
                        else{
                          auxM.push("NODATA"); 
                        }          
                      }
                      else{
                        //console.log("VALOR DE I"+i);
                        //console.log("VALOR DE I"+j);
                        i=i+j;//Continua el valor de i mas los subsystemas agregados con valor j
                        //Ya que estan ordenados por dev, y aparece el mismo system con diferentes
                        //subsystem en cada siguiente iteracción
                        //console.log("VALOR DE I2"+i);
                        break;
                      }
                    }
                    
                  }
                  //Systemas sin ningun subsystem
                  else{//Deberia diferenciar entre El systema y subsistemas(los unicos que se ven ahora)
                    auxS.push(items[i].dev);
                    auxT.push(items[i].type.substring(items[i].type.lastIndexOf("#")+1));
                    allD++;
                    if(items[i].endp!=undefined){
                      auxE.push(items[i].endp.substring(0,items[i].endp.lastIndexOf("^")-1));
                    }
                    else{
                      auxE.push("NODATA");
                    }

                    if(items[i].qK!=undefined){
                      auxqK.push(items[i].qK.substring(items[i].qK.lastIndexOf("#")+1));
                    }
                    else{
                      auxqK.push("NODATA");
                    }
                    if(items[i].unit!=undefined){
                      auxU.push(items[i].unit.substring(items[i].unit.lastIndexOf("#")+1));
                    }
                    else{
                      auxU.push("NODATA");
                    }             
                    if(items[i+j].lat!=undefined&&items[i+j].long!=undefined){
                      var pos ={
                        "lat":Number(items[i+j].lat.substring(0,items[i+j].lat.lastIndexOf("^")-1)),
                        "long":Number(items[i+j].long.substring(0,items[i+j].long.lastIndexOf("^")-1))
                      }
                      auxP.push(pos);
                    }
                    else{
                      auxP.push("NODATA");
                    }
                    //NUEVO
                    auxM.push("NODATA"); 
                    
                  }
                  
                    subsystems.push(auxS);
                    typeSubs.push(auxT);
                    endSubs.push(auxE);
                    qkSubs.push(auxqK);
                    unitSubs.push(auxU);
                    positionSubs.push(auxP);
                    //NUEVO
                    measureSubs.push(auxM);
                  //}
                  numSys++;
                  
                }
                else{//Device == SYSTEM
                  typeDev.push(items[i].type.substring(items[i].type.lastIndexOf("#")+1));
                  //Todo el enlace
                  devices.push(items[i].dev);
                  allD++;
                  //Solo el número identificativo despues de el ultimo /
                  //devs.push(items[i].dev.substring(items[i].dev.lastIndexOf("/")+1));
                  if(items[i].endp!=undefined){
                      endpoints.push(items[i].endp.substring(0,items[i].endp.lastIndexOf("^")-1));
                    }
                  else{
                    endpoints.push("NODATA");
                  }
                  if(items[i].qK!=undefined){
                    qks.push(items[i].qK.substring(items[i].qK.lastIndexOf("#")+1));
                  }
                  else{
                    qks.push("NODATA");
                  }
                  if(items[i].unit!=undefined){
                    units.push(items[i].unit.substring(items[i].unit.lastIndexOf("#")+1));
                  }
                  else{
                    units.push("NODATA");
                  }
                  if(items[i].lat!=undefined&&items[i].long!=undefined){
                    var pos ={
                      "lat":Number(items[i].lat.substring(0,items[i].lat.lastIndexOf("^")-1)),
                      "long":Number(items[i].long.substring(0,items[i].long.lastIndexOf("^")-1))
                    }
                    positions.push(pos);
                  }
                  else{
                    positions.push("NODATA");
                  }
                  measures.push("NODATA");
                }
                
              //}
            }
          }
        }
      }
      console.log("Devices"+allD);
      console.log("Length of sys"+sys.length);//Misma longitud que el de abajo
      console.log("Length of sys in subsystems"+subsystems.length);
      console.log("Length of sys in Typesubsystems"+subsystems.length);
      //NUEVO para poder asegurar el máximo de dispositivos encontrados se busca tambien por los dispositivos de las obsevations
      for(i=0;i<items.length;i++){
        if(items[i].Dep!=undefined){
          if(items[i].Dep==dep){
            if(items[i].dev!=undefined){
              if(items[i].sys){
                var flagObs = false;//flag para comprobar si hay un systema nuevo
                for(var j=0;j<sys.length;j++){
                  if(items[i].sys==sys[j]){
                    flagObs=true;
                    //console.log("Hay un sistema que coincide");
                    for(var k=0;k<subsystems[j].length;k++){
                      if(subsystems[j][k]==items[i].dev){
                        break;
                      }
                      if((k+1)==subsystems[j].length){//solo lo añade al final cuando ha comprobado que no esta ya
                        console.log("Device Nuevo - Systema existente");
                        allD++;
                        subsystems[j].push(items[i].dev);
                        typeSubs[j].push(items[i].typeS.substring(items[i].typeS.lastIndexOf("#")+1));
                        
                        if(items[i].endp!=undefined){
                          endSubs[j].push(items[i].endp.substring(0,items[i].endp.lastIndexOf("^")-1));
                        }
                        else{
                          endSubs[j].push("NODATA");
                        }
                        if(items[i].qK!=undefined){
                          qkSubs[j].push(items[i].qK.substring(items[i].qK.lastIndexOf("#")+1));
                        }
                        else{
                          qkSubs[j].push("NODATA");
                        }
                        if(items[i].unit!=undefined){
                          unitSubs[j].push(items[i].unit.substring(items[i].unit.lastIndexOf("#")+1));
                        }
                        else{
                          unitSubs[j].push("NODATA");
                        }
                        if(items[i].lat!=undefined&&items[i].long!=undefined){
                          var pos ={
                            "lat":Number(items[i].lat.substring(0,items[i].lat.lastIndexOf("^")-1)),
                            "long":Number(items[i].long.substring(0,items[i].long.lastIndexOf("^")-1))
                          }
                          positionSubs[j].push(pos);
                        }
                        else{
                          positionSubs[j].push("NODATA");
                        }
                        //NUEVO
                        if(items[i].num!=undefined){
                          measureSubs[j].push(items[i].num);
                        }
                        else{
                          measureSubs[j].push("NODATA");
                        }
                      }
                    }
                  }
                }
                if(!flagObs){//Si no ha encontrado ningún sistema entonces tendra que añadir uno nuevo
                  console.log("Sistema nuevo - Device Nuevo");
                  sys.push(items[i].sys);
                  var auxS = [];
                  var auxT = [];
                  var auxE = [];
                  var auxQ = [];
                  var auxU = [];
                  var auxP = [];
                  var auxM = [];
                  allD++;
                  auxS.push(items[i].dev);
                  subsystems.push(auxS);
                  auxT.push(items[i].typeS.substring(items[i].typeS.lastIndexOf("#")+1));
                  typeSubs.push(auxT);

                  if(items[i].endp!=undefined){
                    auxE.push(items[i].endp.substring(0,items[i].endp.lastIndexOf("^")-1));
                    endSubs.push(auxE);
                  }
                  else{
                    auxE.push("NODATA");
                    endSubs.push(auxE);
                  }
                  if(items[i].qK!=undefined){
                    auxQ.push(items[i].qK.substring(items[i].qK.lastIndexOf("#")+1));
                    qkSubs.push(auxQ);
                  }
                  else{
                    auxQ.push("NODATA");
                    qkSubs.push(auxQ);
                  }
                  if(items[i].unit!=undefined){
                    auxU.push(items[i].unit.substring(items[i].unit.lastIndexOf("#")+1));
                    unitSubs.push(auxU);
                  }
                  else{
                    auxU.push("NODATA");
                    unitSubs.push(auxU);
                  }
                  if(items[i].lat!=undefined&&items[i].long!=undefined){
                    var pos ={
                      "lat":Number(items[i].lat.substring(0,items[i].lat.lastIndexOf("^")-1)),
                      "long":Number(items[i].long.substring(0,items[i].long.lastIndexOf("^")-1))
                    }
                    auxP.push(pos);
                    positionSubs.push(auxP);
                  }
                  else{
                    auxP.push("NODATA");
                    positionSubs.push(auxP);
                  }
                  //NUEVO
                  if(items[i].num!=undefined){
                    auxM.push();
                    measureSubs.push(auxM);
                  }
                  else{
                    auxM.push("NODATA");
                    measureSubs.push(auxM);
                  }
                  
                }
              }//No tiene sistema
              else{
                var flagObs=false;
                for(var j=0;j<devices.length;j++){
                  if(items[i].dev==devices[j]){
                    flagObs=true;
                  }
                }
                if(!flagObs){
                  console.log("Device nuevo suelto");
                  allD++;
                  //Aqui poner el sensor directamente en uno libre sin Systemas
                  devices.push(items[i].dev);
                  typeDev.push(items[i].typeS.substring(items[i].typeS.lastIndexOf("#")+1));
                  if(items[i].endp!=undefined){
                     endpoints.push(items[i].endp.substring(0,items[i].endp.lastIndexOf("^")-1));
                  }
                  else{
                    endpoints.push("NODATA");
                  }
                  if(items[i].qK!=undefined){
                    qks.push(items[i].qK.substring(items[i].qK.lastIndexOf("#")+1));
                  }
                  else{
                    qks.push("NODATA");
                  }
                  if(items[i].unit!=undefined){
                    units.push(items[i].unit.substring(items[i].unit.lastIndexOf("#")+1));
                  }
                  else{
                    units.push("NODATA");
                  }
                  if(items[i].lat!=undefined&&items[i].long!=undefined){
                    var pos ={
                      "lat":Number(items[i].lat.substring(0,items[i].lat.lastIndexOf("^")-1)),
                      "long":Number(items[i].long.substring(0,items[i].long.lastIndexOf("^")-1))
                    }
                    positions.push(pos);
                  }
                  else{
                    positions.push("NODATA");
                  }
                  //NUEVO
                  measures.push("NODATA");
                }
              }
            }
          }
        }
      }
      console.log("Devices"+allD);
      console.log("Length of sys"+sys.length);//Misma longitud que el de abajo
      console.log("Length of sys in subsystems"+subsystems.length);
      console.log("Length of sys in Typesubsystems"+subsystems.length);
  
      var token = '';
      var body="";
      var request = https.request(optionsToken, function(response) {
        console.log('STATUS /token: ' + response.statusCode);
        if(response.statusCode === 401){
          console.info("UNAUTORIZADO");
        }
        else{
          console.log('HEADERS /token: ' + JSON.stringify(response.headers));
          response.on('data', function(chunk) {
            body+=chunk;
          }).on('end', function() {
            token = JSON.parse(body).tokenId;
            //Obtener todas las observaciones que coincidan con un device
            var postData =
              "PREFIX ssn: <http://purl.oclc.org/NET/ssnx/ssn#>"+ 
              "PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"+
              "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"+
              "PREFIX iot-lite: <http://purl.oclc.org/NET/UNIS/fiware/iot-lite#>"+
              "PREFIX time: <http://www.w3.org/2006/time#>"+
              "Prefix xsd: <http://www.w3.org/2001/XMLSchema#>"+
              "PREFIX dul: <http://www.loa.istc.cnr.it/ontologies/DUL.owl#>"+
              "SELECT ?obs ?s ?sys ?t ?num ?unit ?qk ?type "+
              "WHERE {"+
                "?obs a ssn:Observation."+
                "?obs ssn:observedBy ?s ."+
                "?s rdf:type ?type ."+
                "optional{"+
                "?s iot-lite:isSubSystemOf ?sys ."+
                "?sys ssn:hasDeployment ?Dep ."+
                "}"+
                "VALUES ?Dep {"+
                  "<"+dep+">"+
                "} ."+
                "?obs ssn:observationSamplingTime ?time ."+
                "?time time:inXSDDateTime ?t ."+
                "?obs ssn:observationResult ?result ."+
                "?result ssn:hasValue ?value ."+
                "?value dul:hasDataValue ?num ."+
                "?s iot-lite:hasQuantityKind ?qKURI ."+
                "?qKURI rdf:type ?qk ."+
                "?s iot-lite:hasUnit ?unitURI ."+
                "?unitURI rdf:type ?unit ."+
              "}ORDER BY ?t";
              console.log(postData);
            var options = {
              host: 'platform.fiesta-iot.eu',
              path: '/iot-registry/api/queries/execute/global',
              method: 'POST',
              headers: {
                    'Content-Type': 'text/plain',
                    'Content-Length': Buffer.byteLength(postData),
                    'Accept': 'application/json',
                    'iPlanetDirectoryPro': token
              },
              timeout: 600000//10 minutos
            };
            //var timeObs = [];//fecha de las observaciones
            //var measures = [];//medidas de las observaciones
            var request = https.request(options, function(response) {
              body="";
              console.log('STATUS /observations: ' + response.statusCode);
              if(response.statusCode === 401){
                //Token no valido unautorizado
                console.log("UNAUTORIZADO");
              }
              else{
                console.log('HEADERS /observations: ' + JSON.stringify(response.headers));
                response.on('data', function(chunk) {
                  //Capturar esto para ver si hay error y transmitir a la pagina un error en el servidor y guardar logs
                  body+=chunk;
                  //console.log("CHUNK "+chunk);
                }).on('end', function() {
                  if(response.statusCode===200){
                    var JsonChunk = JSON.parse(body);
                    var items = JsonChunk.items;
                    //Extraer todas las observaciones que me sirven
                    if(items.length==0){
                      //No hay observaciones de este sensor
                      console.log("VACIOOOOOO");
                    }
                    else{
                      console.log("LLEEEENOO Medidas Observacion");
                      for(i=0;i<items.length;i++){
                        if(items[i].s!=undefined){
                          if(items[i].sys){
                            var flagObs = false;//flag para comprobar si hay un systema nuevo
                            for(var j=0;j<sys.length;j++){
                              if(items[i].sys==sys[j]){
                                flagObs=true;
                                //console.log("Hay un sistema que coincide");
                                for(var k=0;k<subsystems[j].length;k++){
                                  if(subsystems[j][k]==items[i].s){
                                    //console.log("Agregar medida");
                                    if(measureSubs[j][k]=="NODATA"){
                                      console.log("--Medida agregada");
                                      measureSubs[j][k]=Number(items[i].num.substring(0,items[i].num.indexOf("^^")));
                                    }
                                    break;
                                  }
                                  if((k+1)==subsystems[j].length){//solo lo añade al final cuando ha comprobado que no esta ya
                                    allD++;
                                    console.log("Nuevo sensor en Systema existente"+j+"-"+k);
                                    subsystems[j].push(items[i].s);
                                    typeSubs[j].push(items[i].type.substring(items[i].type.lastIndexOf("#")+1));
                                    
                                    if(items[i].endp!=undefined){
                                      endSubs[j].push(items[i].endp.substring(0,items[i].endp.lastIndexOf("^")-1));
                                    }
                                    else{
                                      endSubs[j].push("NODATA");
                                    }
                                    if(items[i].qk!=undefined){
                                      qkSubs[j].push(items[i].qk.substring(items[i].qk.lastIndexOf("#")+1));
                                    }
                                    else{
                                      qkSubs[j].push("NODATA");
                                    }
                                    if(items[i].unit!=undefined){
                                      unitSubs[j].push(items[i].unit.substring(items[i].unit.lastIndexOf("#")+1));
                                    }
                                    else{
                                      unitSubs[j].push("NODATA");
                                    }
                                    if(items[i].lat!=undefined&&items[i].long!=undefined){
                                      var pos ={
                                        "lat":Number(items[i].lat.substring(0,items[i].lat.lastIndexOf("^")-1)),
                                        "long":Number(items[i].long.substring(0,items[i].long.lastIndexOf("^")-1))
                                      }
                                      positionSubs[j].push(pos);
                                    }
                                    else{
                                      positionSubs[j].push("NODATA");
                                    }
                                    measureSubs[j].push(Number(items[i].num.substring(0,items[i].num.indexOf("^^"))));
                                  }
                                }
                              }
                            }
                            if(!flagObs){//Si no ha encontrado ningún sistema entonces tendra que añadir uno nuevo
                              console.log("Sistema nuevo - Sensor nuevo");
                              sys.push(items[i].sys);
                              var auxS = [];
                              var auxT = [];
                              var auxE = [];
                              var auxQ = [];
                              var auxU = [];
                              var auxP = [];
                              var auxM = [];
                              allD++;
                              auxS.push(items[i].s);
                              subsystems.push(auxS);
                              auxT.push(items[i].type.substring(items[i].type.lastIndexOf("#")+1));
                              typeSubs.push(auxT);
                              if(items[i].endp!=undefined){
                                auxE.push(items[i].endp.substring(0,items[i].endp.lastIndexOf("^")-1));
                                endSubs.push(auxE);
                              }
                              else{
                                auxE.push("NODATA");
                                endSubs.push(auxE);
                              }
                              if(items[i].qK!=undefined){
                                auxQ.push(items[i].qK.substring(items[i].qK.lastIndexOf("#")+1));
                                akSubs.push(auxQ);
                              }
                              else{
                                auxQ.push("NODATA");
                                qkSubs.push(auxQ);
                              }
                              if(items[i].unit!=undefined){
                                auxU.push(items[i].unit.substring(items[i].unit.lastIndexOf("#")+1));
                                unitSubs.push(auxU);
                              }
                              else{
                                auxU.push("NODATA");
                                unitSubs.push(auxU);
                              }
                              if(items[i].lat!=undefined&&items[i].long!=undefined){
                                var pos ={
                                  "lat":Number(items[i].lat.substring(0,items[i].lat.lastIndexOf("^")-1)),
                                  "long":Number(items[i].long.substring(0,items[i].long.lastIndexOf("^")-1))
                                }
                                auxP.push(pos);
                                positionSubs.push(auxP);
                              }
                              else{
                                auxP.push("NODATA");
                                positionSubs.push(auxP);
                              }
                              //NUEVO
                              auxM.push(Number(items[i].num.substring(0,items[i].num.indexOf("^^"))));
                              measureSubs.push(auxM);
                            }
                          }//No tiene sistema
                          else{
                            var flagObs=false;
                            for(var j=0;j<devices.length;j++){
                              if(items[i].s==devices[j]){
                                if(measures[j]=="NODATA"){
                                  console.log("--Medida agregada device sin systema");
                                  measures[j]=Number(items[i].num.substring(0,items[i].num.indexOf("^^")));
                                }
                                flagObs=true;
                              }
                            }
                            if(!flagObs){
                              console.log("Hay un device nuevo sin sistema");
                              allD++;
                              //Aqui poner el sensor directamente en uno libre sin Systemas
                              devices.push(items[i].s);
                              typeDev.push(items[i].type.substring(items[i].type.lastIndexOf("#")+1));
                              if(items[i].endp!=undefined){
                                 endpoints.push(items[i].endp.substring(0,items[i].endp.lastIndexOf("^")-1));
                              }
                              else{
                                endpoints.push("NODATA");
                              }
                              if(items[i].qK!=undefined){
                                qks.push(items[i].qK.substring(items[i].qK.lastIndexOf("#")+1));
                              }
                              else{
                                qks.push("NODATA");
                              }
                              if(items[i].unit!=undefined){
                                units.push(items[i].unit.substring(items[i].unit.lastIndexOf("#")+1));
                              }
                              else{
                                units.push("NODATA");
                              }
                              if(items[i].lat!=undefined&&items[i].long!=undefined){
                                var pos ={
                                  "lat":Number(items[i].lat.substring(0,items[i].lat.lastIndexOf("^")-1)),
                                  "long":Number(items[i].long.substring(0,items[i].long.lastIndexOf("^")-1))
                                }
                                positions.push(pos);
                              }
                              else{
                                positions.push("NODATA");
                              }
                              //NUEVO
                              measures.push(Number(items[i].num.substring(0,items[i].num.indexOf("^^"))));
                            }
                          }
                        }
                      }
                    }
                  }
                  console.log("Devices"+allD);
                  console.log("Length of sys"+sys.length);//Misma longitud que el de abajo
                  console.log("Length of sys in subsystems"+subsystems.length);
                  console.log("Length of sys in Typesubsystems"+subsystems.length);
                  res.render('devices', {
                    title: 'Devices of Deployment '+nameDep,
                    nameDep: nameDep,
                    devices: devices,//enlace entero
                    typeDev: typeDev,
                    endpoints: endpoints,
                    qks: qks,
                    units: units,
                    positions,
                    measures,
                    //devs: devs,//id despues de la /
                    sys: sys,
                    subsystems: subsystems,
                    typeSubs: typeSubs,
                    endSubs: endSubs,
                    qkSubs: qkSubs,
                    unitSubs: unitSubs,
                    positionSubs,
                    measureSubs,
                    allD: allD,
                    APIKeyGMJS: APIKeyGMJS,
                    dep:dep
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

      db.close();
    });
  });
};*/
exports.readMongoDevofDep = function(req,res,next){
  /*Para coger los parametros de la url es con req.params.:id
    Para coger los parametros de un formulario con post req.body.id
    Para coger los parametros de un formulario por get(en la url) con req.query.id
  */
  var allD=0;
  var nameDep = req.body.nDep;//para ver que se envia desde el formulario
  var dep = req.body.dep;
  var preUrl = req.body.preUrl;
  console.log("Nombre del deployment seleccionado:"+nameDep);
  console.log("Nombre de la url del deployment:"+dep);
  dep = preUrl + dep;
  
  MongoClient.connect(newurlMongdb, function (err, db) {
  /*db.open(function (err, db) {
          if (err){ 
            console.log("ERROR "+err);
            db.close();
          }*/
          var gfs = Grid(db, mongo);
          //console.log(gfs);
          gfs.collection('fismos');
          gfs.files.find().toArray(function (err, files) {
            if(err){console.log("ERROR "+err);}
            else{
              console.log(files);
              var data = "";

              var readstream = gfs.createReadStream({
                filename: files[0].filename
              });

              readstream.on("data", function(chunk){
                data+=chunk.toString();
              });

              readstream.on("end", function(){
      //LA FIESTA VA AQUI
      var dataJson = JSON.parse(/*fismoArray[0].*/data);
      var items = dataJson.items;
      var devices = [];//dispositivos que son su propio systema
      var typeDev = [];
      var endpoints = [];
      var qks = [];
      var units = [];
      var positions = [];
      var measures = [];
      //var devs = [];
      //Array de systemas
      var sys = [];
      //Array de array donde van los subsistemas
      var subsystems = [];
      var typeSubs = [];
      var endSubs = [];
      var qkSubs = [];
      var unitSubs = [];
      var positionSubs = [];
      var measureSubs =[];
      //Extraer todos los devices que me sirven
      var i = 0;
      var numSys = 0;
      var c=0;
      for(i;i<items.length;i++){
      //if(items[i].dev.substring(0,d.lastIndexOf("/"))!="https://platform.fiesta-iot.eu/iot-registry/api/observations"){
        if(items[i].Dep!=undefined/* || items[i].DepofS!=undefined*/){
        //Si el device no tiene Depl o un systema con Deplo no sirve el device
          if(items[i].Dep==dep/* || items[i].DepofS==dep*/){//Que el deployment sea el que se ha seleccionado
            //Los dev que tienen un sys se añaden en otro momento
            if(items[i].dev!=undefined){//hay subD o no
              //if(items[i].type!="http://purl.oclc.org/NET/ssnx/ssn#Device"){
                //Solo leo los dispositivos que son del tipo Device osea systemas
                var tNew ="";
                if(items[i].type.substring(items[i].type.lastIndexOf("#")+1)=="Device"){
                  //typeDev.push("System");
                  //console.log("Valor de i "+i);
                  sys.push(items[i].dev/*.substring(items[i].dev.lastIndexOf("/")+1)*/);
                  var auxS = [];
                  var auxT = [];
                  var auxE = [];
                  var auxqK = [];
                  var auxU = [];
                  var auxP = [];
                  var auxM = [];
                  //Agregar aqui PLATFORM con localizacion
                  //Hay Subsystemas o no
                  if(items[i].subD!=undefined){
                    var j=0;
                    var sensorN="";
                    var sensorN1="";
                    var flagNuevo = false;
                    //Busca los subsystemas que tiene ese device y los mete en un array
                    for(j;j+i<items.length;j++){
                      if(items[i+j].dev==items[i].dev){
                        var sensorN1=items[i+j].subD;
                        if(sensorN==""){
                          sensorN=items[i+j].subD;
                          flagNuevo=true;
                        }
                        else{
                          if(sensorN!=sensorN1){
                            sensorN=items[i+j].subD;
                            flagNuevo=true;
                          }else{
                            flagNuevo=false;
                          }
                        }
                        if(flagNuevo){
                          auxS.push(items[i+j].subD/*.substring(items[i+j].subD.lastIndexOf("/")+1)*/);
                          auxT.push(items[i+j].typeSubD.substring(items[i+j].typeSubD.lastIndexOf("#")+1));
                          //NUMERO DEVICES
                          allD++;
                          if(items[i+j].endp/*SD*/!=undefined){
                            auxE.push(items[i+j].endp/*SD*/.substring(0,items[i+j].endp/*SD*/.lastIndexOf("^")-1));
                          }
                          else{
                            auxE.push("NODATA");
                          }
                          //Puede que haya que hacer sentencia if else pero en teoria todos los devices tienen un qk y unit
                          if(items[i+j].qK/*SD*/!=undefined){
                            auxqK.push(items[i+j].qK/*SD*/.substring(items[i+j].qK/*SD*/.lastIndexOf("#")+1));
                          }
                          else{
                            auxqK.push("NODATA");
                          }
                          if(items[i+j].unit/*SD*/!=undefined){
                            auxU.push(items[i+j].unit/*SD*/.substring(items[i+j].unit/*SD*/.lastIndexOf("#")+1));
                          }
                          else{
                            auxU.push("NODATA");
                          }
                          if(items[i+j].lat!=undefined&&items[i+j].long!=undefined){
                            var pos ={
                              "lat":Number(items[i+j].lat.substring(0,items[i+j].lat.lastIndexOf("^")-1)),
                              "long":Number(items[i+j].long.substring(0,items[i+j].long.lastIndexOf("^")-1))
                            }
                            auxP.push(pos);
                          }
                          else{
                            auxP.push("NODATA");
                          }
                          //NUEVO
                          if(items[i+j].num!=undefined){
                            auxM.push(Number(items[i+j].num.substring(0,items[i+j].num.indexOf("^^"))));
                          }
                          else{
                            auxM.push("NODATA"); 
                          } 
                        }else{c++;console.log("No se añade "+c);}  
                      }
                      else{
                        //console.log("VALOR DE I"+i);
                        //console.log("VALOR DE I"+j);
                        //console.log("Valor i "+i+" Valor j "+j);
                        i=i+j-1;//Continua el valor de i mas los subsystemas agregados con valor j
                        //Ya que estan ordenados por dev, y aparece el mismo system con diferentes
                        //subsystem en cada siguiente iteracción
                        //console.log("VALOR DE I2"+i);
                        break;
                      }
                    }
                    
                  }
                  //Systemas sin ningun subsystem
                  else{//Deberia diferenciar entre El systema y subsistemas(los unicos que se ven ahora)
                    auxS.push(items[i].dev/*.substring(items[i].dev.lastIndexOf("/")+1)*/);
                    auxT.push(items[i].type.substring(items[i].type.lastIndexOf("#")+1));
                    //allD++;
                    if(items[i].endp!=undefined){
                      auxE.push(items[i].endp.substring(0,items[i].endp.lastIndexOf("^")-1));
                    }
                    else{
                      auxE.push("NODATA");
                    }

                    if(items[i].qK!=undefined){
                      auxqK.push(items[i].qK.substring(items[i].qK.lastIndexOf("#")+1));
                    }
                    else{
                      auxqK.push("NODATA");
                    }
                    if(items[i].unit!=undefined){
                      auxU.push(items[i].unit.substring(items[i].unit.lastIndexOf("#")+1));
                    }
                    else{
                      auxU.push("NODATA");
                    }             
                    if(items[i].lat!=undefined&&items[i].long!=undefined){
                      var pos ={
                        "lat":Number(items[i].lat.substring(0,items[i].lat.lastIndexOf("^")-1)),
                        "long":Number(items[i].long.substring(0,items[i].long.lastIndexOf("^")-1))
                      }
                      auxP.push(pos);
                    }
                    else{
                      auxP.push("NODATA");
                    }
                    //NUEVO
                    if(items[i].num!=undefined){
                      auxM.push(Number(items[i].num.substring(0,items[i].num.indexOf("^^"))));
                    }
                    else{
                      auxM.push("NODATA"); 
                    }
                    
                  }
                  /*if(numSys==0){
                    subsystems[0].push(auxS);
                    typeSubs[0].push(auxT);  
                  }
                  else{*/
                    subsystems.push(auxS);
                    typeSubs.push(auxT);
                    endSubs.push(auxE);
                    qkSubs.push(auxqK);
                    unitSubs.push(auxU);
                    positionSubs.push(auxP);
                    //NUEVO
                    measureSubs.push(auxM);
                  //}
                  numSys++;
                  
                }
                else{//Device == SYSTEM
                  var sensorN="";
                  var sensorN1="";
                  var flagNuevo = false;
                  var sensorN1=items[i].dev;
                  if(sensorN==""){
                    sensorN=items[i].dev;
                    flagNuevo=true;
                  }
                  else{
                    if(sensorN!=sensorN1){
                      flagNuevo=true;
                    }else{
                      flagNuevo=false;
                    }
                  }
                  if(flagNuevo){
                    typeDev.push(items[i].type.substring(items[i].type.lastIndexOf("#")+1));
                    //Todo el enlace
                    devices.push(items[i].dev);
                    allD++;
                    //Solo el número identificativo despues de el ultimo /
                    //devs.push(items[i].dev.substring(items[i].dev.lastIndexOf("/")+1));
                    if(items[i].endp!=undefined){
                        endpoints.push(items[i].endp.substring(0,items[i].endp.lastIndexOf("^")-1));
                      }
                    else{
                      endpoints.push("NODATA");
                    }
                    if(items[i].qK!=undefined){
                      qks.push(items[i].qK.substring(items[i].qK.lastIndexOf("#")+1));
                    }
                    else{
                      qks.push("NODATA");
                    }
                    if(items[i].unit!=undefined){
                      units.push(items[i].unit.substring(items[i].unit.lastIndexOf("#")+1));
                    }
                    else{
                      units.push("NODATA");
                    }
                    if(items[i].lat!=undefined&&items[i].long!=undefined){
                      var pos ={
                        "lat":Number(items[i].lat.substring(0,items[i].lat.lastIndexOf("^")-1)),
                        "long":Number(items[i].long.substring(0,items[i].long.lastIndexOf("^")-1))
                      }
                      positions.push(pos);
                    }
                    else{
                      positions.push("NODATA");
                    }
                    if(items[i].num!=undefined){
                      auxM.push(Number(items[i].num.substring(0,items[i].num.indexOf("^^"))));
                    }
                    else{
                      auxM.push("NODATA"); 
                    }
                  }
                }
                
              //}
            }
            /*else{//sale del for por que ya no hay mas dev
              break;
            }*/
          }
        }
      }
      console.log("Devices "+allD);
      console.log("Length of sys "+sys.length);//Misma longitud que el de abajo
      console.log("Length of sys in subsystems "+subsystems.length);
      console.log("Length of sys in Typesubsystems "+subsystems.length);
      
      //NUEVO para poder asegurar el máximo de dispositivos encontrados se busca tambien por los dispositivos de las obsevations
      /*for(i=0;i<items.length;i++){
        if(items[i].Dep!=undefined){
          if(items[i].Dep==dep){
            if(items[i].dev!=undefined){
              if(items[i].sys){
                var flagObs = false;//flag para comprobar si hay un systema nuevo
                for(var j=0;j<sys.length;j++){
                  if(items[i].sys==sys[j]){
                    flagObs=true;
                    //console.log("Hay un sistema que coincide");
                    for(var k=0;k<subsystems[j].length;k++){
                      if(subsystems[j][k]==items[i].dev){
                        break;
                      }
                      if((k+1)==subsystems[j].length){//solo lo añade al final cuando ha comprobado que no esta ya
                        console.log("Device Nuevo - Systema existente");
                        allD++;
                        subsystems[j].push(items[i].dev);
                        typeSubs[j].push(items[i].typeS.substring(items[i].typeS.lastIndexOf("#")+1));
                        
                        if(items[i].endp!=undefined){
                          endSubs[j].push(items[i].endp.substring(0,items[i].endp.lastIndexOf("^")-1));
                        }
                        else{
                          endSubs[j].push("NODATA");
                        }
                        if(items[i].qK!=undefined){
                          qkSubs[j].push(items[i].qK.substring(items[i].qK.lastIndexOf("#")+1));
                        }
                        else{
                          qkSubs[j].push("NODATA");
                        }
                        if(items[i].unit!=undefined){
                          unitSubs[j].push(items[i].unit.substring(items[i].unit.lastIndexOf("#")+1));
                        }
                        else{
                          unitSubs[j].push("NODATA");
                        }
                        if(items[i].lat!=undefined&&items[i].long!=undefined){
                          var pos ={
                            "lat":Number(items[i].lat.substring(0,items[i].lat.lastIndexOf("^")-1)),
                            "long":Number(items[i].long.substring(0,items[i].long.lastIndexOf("^")-1))
                          }
                          positionSubs[j].push(pos);
                        }
                        else{
                          positionSubs[j].push("NODATA");
                        }
                        //NUEVO
                        if(items[i].num!=undefined){
                          measureSubs[j].push(items[i].num);
                        }
                        else{
                          measureSubs[j].push("NODATA");
                        }
                      }
                    }
                  }
                }
                if(!flagObs){//Si no ha encontrado ningún sistema entonces tendra que añadir uno nuevo
                  console.log("Sistema nuevo - Device Nuevo");
                  sys.push(items[i].sys);
                  var auxS = [];
                  var auxT = [];
                  var auxE = [];
                  var auxQ = [];
                  var auxU = [];
                  var auxP = [];
                  var auxM = [];
                  allD++;
                  auxS.push(items[i].dev);
                  subsystems.push(auxS);
                  auxT.push(items[i].typeS.substring(items[i].typeS.lastIndexOf("#")+1));
                  typeSubs.push(auxT);

                  if(items[i].endp!=undefined){
                    auxE.push(items[i].endp.substring(0,items[i].endp.lastIndexOf("^")-1));
                    endSubs.push(auxE);
                  }
                  else{
                    auxE.push("NODATA");
                    endSubs.push(auxE);
                  }
                  if(items[i].qK!=undefined){
                    auxQ.push(items[i].qK.substring(items[i].qK.lastIndexOf("#")+1));
                    qkSubs.push(auxQ);
                  }
                  else{
                    auxQ.push("NODATA");
                    qkSubs.push(auxQ);
                  }
                  if(items[i].unit!=undefined){
                    auxU.push(items[i].unit.substring(items[i].unit.lastIndexOf("#")+1));
                    unitSubs.push(auxU);
                  }
                  else{
                    auxU.push("NODATA");
                    unitSubs.push(auxU);
                  }
                  if(items[i].lat!=undefined&&items[i].long!=undefined){
                    var pos ={
                      "lat":Number(items[i].lat.substring(0,items[i].lat.lastIndexOf("^")-1)),
                      "long":Number(items[i].long.substring(0,items[i].long.lastIndexOf("^")-1))
                    }
                    auxP.push(pos);
                    positionSubs.push(auxP);
                  }
                  else{
                    auxP.push("NODATA");
                    positionSubs.push(auxP);
                  }
                  //NUEVO
                  if(items[i].num!=undefined){
                    auxM.push();
                    measureSubs.push(auxM);
                  }
                  else{
                    auxM.push("NODATA");
                    measureSubs.push(auxM);
                  }
                  
                }
              }//No tiene sistema
              else{
                var flagObs=false;
                for(var j=0;j<devices.length;j++){
                  if(items[i].dev==devices[j]){
                    flagObs=true;
                  }
                }
                if(!flagObs){
                  console.log("Device nuevo suelto");
                  allD++;
                  //Aqui poner el sensor directamente en uno libre sin Systemas
                  devices.push(items[i].dev);
                  typeDev.push(items[i].typeS.substring(items[i].typeS.lastIndexOf("#")+1));
                  if(items[i].endp!=undefined){
                     endpoints.push(items[i].endp.substring(0,items[i].endp.lastIndexOf("^")-1));
                  }
                  else{
                    endpoints.push("NODATA");
                  }
                  if(items[i].qK!=undefined){
                    qks.push(items[i].qK.substring(items[i].qK.lastIndexOf("#")+1));
                  }
                  else{
                    qks.push("NODATA");
                  }
                  if(items[i].unit!=undefined){
                    units.push(items[i].unit.substring(items[i].unit.lastIndexOf("#")+1));
                  }
                  else{
                    units.push("NODATA");
                  }
                  if(items[i].lat!=undefined&&items[i].long!=undefined){
                    var pos ={
                      "lat":Number(items[i].lat.substring(0,items[i].lat.lastIndexOf("^")-1)),
                      "long":Number(items[i].long.substring(0,items[i].long.lastIndexOf("^")-1))
                    }
                    positions.push(pos);
                  }
                  else{
                    positions.push("NODATA");
                  }
                  //NUEVO
                  measures.push("NODATA");
                }
              }
            }
          }
        }
      }
      console.log("Devices"+allD);
      console.log("Length of sys"+sys.length);//Misma longitud que el de abajo
      console.log("Length of sys in subsystems"+subsystems.length);
      console.log("Length of sys in Typesubsystems"+subsystems.length);*/
  
      var token = '';
      var body="";
      var request = https.request(optionsToken, function(response) {
        console.log('STATUS /token: ' + response.statusCode);
        if(response.statusCode === 401){
          console.info("UNAUTORIZADO TOKEN");
          res.render('devices', {
                    title: 'Devices of Deployment '+nameDep,
                    nameDep: nameDep,
                    devices: devices,//enlace entero
                    typeDev: typeDev,
                    endpoints: endpoints,
                    qks: qks,
                    units: units,
                    positions,
                    measures,
                    //devs: devs,//id despues de la /
                    sys: sys,
                    subsystems: subsystems,
                    typeSubs: typeSubs,
                    endSubs: endSubs,
                    qkSubs: qkSubs,
                    unitSubs: unitSubs,
                    positionSubs,
                    measureSubs,
                    allD: allD,
                    APIKeyGMJS: APIKeyGMJS,
                    dep:dep
                  });
        }
        else{
          console.log('HEADERS /token: ' + JSON.stringify(response.headers));
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
              "SELECT ?obs ?s ?sys ?t ?num ?unit ?lat ?long ?qk ?type "+
              "WHERE {"+
                "?obs a ssn:Observation."+
                "?obs ssn:observedBy ?s ."+
                "?s rdf:type ?type ."+
                "optional{"+
                "?s iot-lite:isSubSystemOf ?sys ."+
                "?sys ssn:hasDeployment ?Dep ."+
                "}"+
                "VALUES ?Dep {"+
                  "<"+dep+">"+
                "} ."+
                "?obs ssn:observationSamplingTime ?time ."+
                "?time time:inXSDDateTime ?t ."+
                "?obs ssn:observationResult ?result ."+
                "?result ssn:hasValue ?value ."+
                "?value dul:hasDataValue ?num ."+
                "?obs geo:location ?point ."+
                "?point geo:lat ?lat ."+
                "?point geo:long ?long ."+
                "?s iot-lite:hasQuantityKind ?qKURI ."+
                "?qKURI rdf:type ?qk ."+
                "?s iot-lite:hasUnit ?unitURI ."+
                "?unitURI rdf:type ?unit ."+
              "}ORDER BY ?t";
              console.log(postData);
            var options = {
              host: 'platform.fiesta-iot.eu',
              path: '/iot-registry/api/queries/execute/global',
              method: 'POST',
              headers: {
                    'Content-Type': 'text/plain',
                    'Content-Length': Buffer.byteLength(postData),
                    'Accept': 'application/json',
                    'iPlanetDirectoryPro': token
              },
              timeout: 660000//10 minutos
            };
            //var timeObs = [];//fecha de las observaciones
            //var measures = [];//medidas de las observaciones
            var request = https.request(options, function(response) {
              body="";
              console.log('STATUS /observations: ' + response.statusCode);
              if(response.statusCode === 401){
                //Token no valido unautorizado
                console.log("UNAUTORIZADO DEVANDOBS");
                res.render('devices', {
                    title: 'Devices of Deployment '+nameDep,
                    nameDep: nameDep,
                    devices: devices,//enlace entero
                    typeDev: typeDev,
                    endpoints: endpoints,
                    qks: qks,
                    units: units,
                    positions,
                    measures,
                    //devs: devs,//id despues de la /
                    sys: sys,
                    subsystems: subsystems,
                    typeSubs: typeSubs,
                    endSubs: endSubs,
                    qkSubs: qkSubs,
                    unitSubs: unitSubs,
                    positionSubs,
                    measureSubs,
                    allD: allD,
                    APIKeyGMJS: APIKeyGMJS,
                    dep:dep
                  });
              }
              else{
                console.log('HEADERS /observations: ' + JSON.stringify(response.headers));
                response.on('data', function(chunk) {
                  //Capturar esto para ver si hay error y transmitir a la pagina un error en el servidor y guardar logs
                  body+=chunk;
                  //console.log("CHUNK "+chunk);
                }).on('end', function() {
                  if(response.statusCode===200){
                    var JsonChunk = JSON.parse(body);//cazar exceptino
                    var items = JsonChunk.items;
                    //Extraer todas las observaciones que me sirven
                    if(items.length==0){
                      //No hay observaciones de este sensor
                      console.log("VACIOOOOOO");
                    }
                    else{
                      console.log("LLEEEENOO Medidas Observacion");
                      for(i=0;i<items.length;i++){
                        if(items[i].s!=undefined){
                          if(items[i].sys){
                            var flagObs = false;//flag para comprobar si hay un systema nuevo
                            for(var j=0;j<sys.length;j++){
                              if(items[i].sys==sys[j]){
                                flagObs=true;
                                //console.log("Hay un sistema que coincide");
                                for(var k=0;k<subsystems[j].length;k++){
                                  if(subsystems[j][k]==items[i].s){
                                    //console.log("Agregar medida");
                                    if(measureSubs[j][k]=="NODATA"){
                                      console.log("--Medida agregada");
                                      measureSubs[j][k]=Number(items[i].num.substring(0,items[i].num.indexOf("^^")));
                                    }
                                    break;
                                  }
                                  if((k+1)==subsystems[j].length){//solo lo añade al final cuando ha comprobado que no esta ya
                                    allD++;
                                    console.log("Nuevo sensor en Systema existente"+j+"-"+k);
                                    subsystems[j].push(items[i].s);
                                    typeSubs[j].push(items[i].type.substring(items[i].type.lastIndexOf("#")+1));
                                    
                                    if(items[i].endp!=undefined){
                                      endSubs[j].push(items[i].endp.substring(0,items[i].endp.lastIndexOf("^")-1));
                                    }
                                    else{
                                      endSubs[j].push("NODATA");
                                    }
                                    if(items[i].qk!=undefined){
                                      qkSubs[j].push(items[i].qk.substring(items[i].qk.lastIndexOf("#")+1));
                                    }
                                    else{
                                      qkSubs[j].push("NODATA");
                                    }
                                    if(items[i].unit!=undefined){
                                      unitSubs[j].push(items[i].unit.substring(items[i].unit.lastIndexOf("#")+1));
                                    }
                                    else{
                                      unitSubs[j].push("NODATA");
                                    }
                                    if(items[i].lat!=undefined&&items[i].long!=undefined){
                                      var pos ={
                                        "lat":Number(items[i].lat.substring(0,items[i].lat.lastIndexOf("^")-1)),
                                        "long":Number(items[i].long.substring(0,items[i].long.lastIndexOf("^")-1))
                                      }
                                      positionSubs[j].push(pos);
                                    }
                                    else{
                                      positionSubs[j].push("NODATA");
                                    }
                                    measureSubs[j].push(Number(items[i].num.substring(0,items[i].num.indexOf("^^"))));
                                  }
                                }
                              }
                            }
                            if(!flagObs){//Si no ha encontrado ningún sistema entonces tendra que añadir uno nuevo
                              console.log("Sistema nuevo - Sensor nuevo");
                              sys.push(items[i].sys);
                              var auxS = [];
                              var auxT = [];
                              var auxE = [];
                              var auxQ = [];
                              var auxU = [];
                              var auxP = [];
                              var auxM = [];
                              allD++;
                              auxS.push(items[i].s);
                              subsystems.push(auxS);
                              auxT.push(items[i].type.substring(items[i].type.lastIndexOf("#")+1));
                              typeSubs.push(auxT);
                              if(items[i].endp!=undefined){
                                auxE.push(items[i].endp.substring(0,items[i].endp.lastIndexOf("^")-1));
                                endSubs.push(auxE);
                              }
                              else{
                                auxE.push("NODATA");
                                endSubs.push(auxE);
                              }
                              if(items[i].qK!=undefined){
                                auxQ.push(items[i].qK.substring(items[i].qK.lastIndexOf("#")+1));
                                akSubs.push(auxQ);
                              }
                              else{
                                auxQ.push("NODATA");
                                qkSubs.push(auxQ);
                              }
                              if(items[i].unit!=undefined){
                                auxU.push(items[i].unit.substring(items[i].unit.lastIndexOf("#")+1));
                                unitSubs.push(auxU);
                              }
                              else{
                                auxU.push("NODATA");
                                unitSubs.push(auxU);
                              }
                              if(items[i].lat!=undefined&&items[i].long!=undefined){
                                var pos ={
                                  "lat":Number(items[i].lat.substring(0,items[i].lat.lastIndexOf("^")-1)),
                                  "long":Number(items[i].long.substring(0,items[i].long.lastIndexOf("^")-1))
                                }
                                auxP.push(pos);
                                positionSubs.push(auxP);
                              }
                              else{
                                auxP.push("NODATA");
                                positionSubs.push(auxP);
                              }
                              //NUEVO
                              auxM.push(Number(items[i].num.substring(0,items[i].num.indexOf("^^"))));
                              measureSubs.push(auxM);
                            }
                          }//No tiene sistema
                          else{
                            var flagObs=false;
                            for(var j=0;j<devices.length;j++){
                              if(items[i].s==devices[j]){
                                if(measures[j]=="NODATA"){
                                  console.log("--Medida agregada device sin systema");
                                  measures[j]=Number(items[i].num.substring(0,items[i].num.indexOf("^^")));
                                }
                                flagObs=true;
                              }
                            }
                            if(!flagObs){
                              console.log("Hay un device nuevo sin sistema");
                              allD++;
                              //Aqui poner el sensor directamente en uno libre sin Systemas
                              devices.push(items[i].s);
                              typeDev.push(items[i].type.substring(items[i].type.lastIndexOf("#")+1));
                              if(items[i].endp!=undefined){
                                 endpoints.push(items[i].endp.substring(0,items[i].endp.lastIndexOf("^")-1));
                              }
                              else{
                                endpoints.push("NODATA");
                              }
                              if(items[i].qK!=undefined){
                                qks.push(items[i].qK.substring(items[i].qK.lastIndexOf("#")+1));
                              }
                              else{
                                qks.push("NODATA");
                              }
                              if(items[i].unit!=undefined){
                                units.push(items[i].unit.substring(items[i].unit.lastIndexOf("#")+1));
                              }
                              else{
                                units.push("NODATA");
                              }
                              if(items[i].lat!=undefined&&items[i].long!=undefined){
                                var pos ={
                                  "lat":Number(items[i].lat.substring(0,items[i].lat.lastIndexOf("^")-1)),
                                  "long":Number(items[i].long.substring(0,items[i].long.lastIndexOf("^")-1))
                                }
                                positions.push(pos);
                              }
                              else{
                                positions.push("NODATA");
                              }
                              //NUEVO
                              measures.push(Number(items[i].num.substring(0,items[i].num.indexOf("^^"))));
                            }
                          }
                        }
                      }
                    }
                  }
                  console.log("Devices"+allD);
                  console.log("Length of sys"+sys.length);//Misma longitud que el de abajo
                  console.log("Length of sys in subsystems"+subsystems.length);
                  console.log("Length of sys in Typesubsystems"+subsystems.length);
                  res.render('devices', {
                    title: 'Devices of Deployment '+nameDep,
                    nameDep: nameDep,
                    devices: devices,//enlace entero
                    typeDev: typeDev,
                    endpoints: endpoints,
                    qks: qks,
                    units: units,
                    positions,
                    measures,
                    //devs: devs,//id despues de la /
                    sys: sys,
                    subsystems: subsystems,
                    typeSubs: typeSubs,
                    endSubs: endSubs,
                    qkSubs: qkSubs,
                    unitSubs: unitSubs,
                    positionSubs,
                    measureSubs,
                    allD: allD,
                    APIKeyGMJS: APIKeyGMJS,
                    dep:dep
                  });
                })
              }
            });
            request.on('error', function(e) {
              console.log("ERROR "+e.message);
              res.render('devices', {
                    title: 'Devices of Deployment '+nameDep,
                    nameDep: nameDep,
                    devices: devices,//enlace entero
                    typeDev: typeDev,
                    endpoints: endpoints,
                    qks: qks,
                    units: units,
                    positions,
                    measures,
                    //devs: devs,//id despues de la /
                    sys: sys,
                    subsystems: subsystems,
                    typeSubs: typeSubs,
                    endSubs: endSubs,
                    qkSubs: qkSubs,
                    unitSubs: unitSubs,
                    positionSubs,
                    measureSubs,
                    allD: allD,
                    APIKeyGMJS: APIKeyGMJS,
                    dep:dep
                  });
            });
            request.write(postData);
            request.end();
          });
        }
      });
      request.on('error', function(e) {
        console.log("ERROR "+e.message);
         res.render('devices', {
          title: 'Devices of Deployment '+nameDep,
          nameDep: nameDep,
          devices: devices,//enlace entero
          typeDev: typeDev,
          endpoints: endpoints,
          qks: qks,
          units: units,
          positions,
          measures,
          //devs: devs,//id despues de la /
          sys: sys,
          subsystems: subsystems,
          typeSubs: typeSubs,
          endSubs: endSubs,
          qkSubs: qkSubs,
          unitSubs: unitSubs,
          positionSubs,
          measureSubs,
          allD: allD,
          APIKeyGMJS: APIKeyGMJS,
          dep:dep
        });
      });  
      request.end();

      db.close();
    });
  }
  });
//});
 
//db.close();
});//MongoClient

};

exports.readMongoDevofDep2 = function(req,res,next){
  /*Para coger los parametros de la url es con req.params.:id
    Para coger los parametros de un formulario con post req.body.:id
    Para coger los parametros de un formulario por get(en la url) con req.query.:id
  */
  var allD=0;
  var nameDep = req.body.nDep;//para ver que se envia desde el formulario
  var dep = req.body.dep;
  var preUrl = req.body.preUrl;
  console.log("Nombre del deployment seleccionado:"+nameDep);
  console.log("Nombre de la url del deployment:"+dep);
  dep = preUrl + dep;
  
  var fismoArray = [];
  MongoClient.connect(newurlMongdb, function(err, db){
    if(err) throw err;
    var cursor = db.collection('fismos').find();
    cursor.forEach(function(doc, error){
      if(error) throw error;
      fismoArray.push(doc);
    }, function(){
      //LA FIESTA VA AQUI
      var dataJson = JSON.parse(fismoArray[0].data);
      var items = dataJson.items;
      var devices = [];//dispositivos que son su propio systema
      var typeDev = [];
      var endpoints = [];
      var qks = [];
      var units = [];
      //var devs = [];
      //Array de systemas
      var sys = [];
      //Array de array donde van los subsistemas
      var subsystems = [];
      var typeSubs = [];
      var endSubs = [];
      var qkSubs = [];
      var unitSubs = [];
      //Extraer todos los devices que me sirven
      var i = 0;
      var numSys = 0;
      for(i;i<items.length;i++){
      //if(items[i].dev.substring(0,d.lastIndexOf("/"))!="https://platform.fiesta-iot.eu/iot-registry/api/observations"){
        if(items[i].Dep!=undefined/* || items[i].DepofS!=undefined*/){
        //Si el device no tiene Depl o un systema con Deplo no sirve el device
          if(items[i].Dep==dep/* || items[i].DepofS==dep*/){//Que el deployment sea el que se ha seleccionado
            //Los dev que tienen un sys se añaden en otro momento
            if(items[i].dev!=undefined){//hay subD o no
              //if(items[i].type!="http://purl.oclc.org/NET/ssnx/ssn#Device"){
                //Solo leo los dispositivos que son del tipo Device osea systemas
                if(items[i].type.substring(items[i].type.lastIndexOf("#")+1)=="Device"){
                  //typeDev.push("System");
                  sys.push(items[i].dev/*.substring(items[i].dev.lastIndexOf("/")+1)*/);
                  var auxS = [];
                  var auxT = [];
                  var auxE = [];
                  var auxqK = [];
                  var auxU = [];
                  //Agregar aqui PLATFORM con localizacion
                  //Hay Subsystemas o no
                  if(items[i].subD!=undefined){
                    var j=0;
                    //Busca los subsystemas que tiene ese device y los mete en un array
                    for(j;j+i<items.length;j++){
                      if(items[i+j].dev==items[i].dev){
                        auxS.push(items[i+j].subD/*.substring(items[i+j].subD.lastIndexOf("/")+1)*/);
                        auxT.push(items[i+j].typeSubD.substring(items[i+j].typeSubD.lastIndexOf("#")+1));
                        //NUMERO DEVICES
                        allD++;
                        if(items[i+j].endp/*SD*/!=undefined){
                          auxE.push(items[i+j].endp/*SD*/.substring(0,items[i+j].endp/*SD*/.lastIndexOf("^")-1));
                        }
                        else{
                          auxE.push("NODATA");
                        }
                        //Puede que haya que hacer sentencia if else pero en teoria todos los devices tienen un qk y unit
                        if(items[i+j].qK/*SD*/!=undefined){
                          auxqK.push(items[i+j].qK/*SD*/.substring(items[i+j].qK/*SD*/.lastIndexOf("#")+1));
                        }
                        else{
                          auxqK.push("NODATA");
                        }
                        if(items[i+j].unit/*SD*/!=undefined){
                          auxU.push(items[i+j].unit/*SD*/.substring(items[i+j].unit/*SD*/.lastIndexOf("#")+1));
                        }
                        else{
                          auxU.push("NODATA");
                        }             
                      }
                      else{
                        //console.log("VALOR DE I"+i);
                        //console.log("VALOR DE I"+j);
                        i=i+j;//Continua el valor de i mas los subsystemas agregados con valor j
                        //Ya que estan ordenados por dev, y aparece el mismo system con diferentes
                        //subsystem en cada siguiente iteracción
                        //console.log("VALOR DE I2"+i);
                        break;
                      }
                    }
                    
                  }
                  //Systemas sin ningun subsystem
                  else{//Deberia diferenciar entre El systema y subsistemas(los unicos que se ven ahora)
                    auxS.push(items[i].dev/*.substring(items[i].dev.lastIndexOf("/")+1)*/);
                    auxT.push(items[i].type.substring(items[i].type.lastIndexOf("#")+1));
                    allD++;
                    if(items[i].endp!=undefined){
                      auxE.push(items[i].endp.substring(0,items[i].endp.lastIndexOf("^")-1));
                    }
                    else{
                      auxE.push("NODATA");
                    }

                    if(items[i].qK!=undefined){
                      auxqK.push(items[i].qK.substring(items[i].qK.lastIndexOf("#")+1));
                    }
                    else{
                      auxqK.push("NODATA");
                    }
                    if(items[i].unit!=undefined){
                      auxU.push(items[i].unit.substring(items[i].unit.lastIndexOf("#")+1));
                    }
                    else{
                      auxU.push("NODATA");
                    }             
                    
                    
                  }
                  /*if(numSys==0){
                    subsystems[0].push(auxS);
                    typeSubs[0].push(auxT);  
                  }
                  else{*/
                    subsystems.push(auxS);
                    typeSubs.push(auxT);
                    endSubs.push(auxE);
                    qkSubs.push(auxqK);
                    unitSubs.push(auxU);
                  //}
                  numSys++;
                  
                }
                else{//Device == SYSTEM
                  typeDev.push(items[i].type.substring(items[i].type.lastIndexOf("#")+1));
                  //Todo el enlace
                  devices.push(items[i].dev);
                  allD++;
                  //Solo el número identificativo despues de el ultimo /
                  //devs.push(items[i].dev.substring(items[i].dev.lastIndexOf("/")+1));
                  if(items[i].endp!=undefined){
                      endpoints.push(items[i].endp.substring(0,items[i].endp.lastIndexOf("^")-1));
                    }
                  else{
                    endpoints.push("NODATA");
                  }
                  if(items[i].qK!=undefined){
                    qks.push(items[i].qK.substring(items[i].qK.lastIndexOf("#")+1));
                  }
                  else{
                    qks.push("NODATA");
                  }
                  if(items[i].unit!=undefined){
                    units.push(items[i].unit.substring(items[i].unit.lastIndexOf("#")+1));
                  }
                  else{
                    units.push("NODATA");
                  }
                  //Agregar aqui PLATFORM con localizacion
                }
                
              //}
            }
            /*else{//sale del for por que ya no hay mas dev
              break;
            }*/
          }
        }
      }

      console.log("Length of sys"+sys.length);//Misma longitud que el de abajo
      console.log("Length of sys in subsystems"+subsystems.length);
      console.log("Length of sys in Typesubsystems"+subsystems.length);
      res.render('devices', {
        title: 'Devices of Deployment '+nameDep,
        nameDep: nameDep,
        devices: devices,//enlace entero
        typeDev: typeDev,
        endpoints: endpoints,
        qks: qks,
        units: units,
        //devs: devs,//id despues de la /
        sys: sys,
        subsystems: subsystems,
        typeSubs: typeSubs,
        endSubs: endSubs,
        qkSubs: qkSubs,
        unitSubs: unitSubs,
        allD: allD
      });

      db.close();
    });
  });

 
};


exports.readMongoSensorsOld = function(req,res,next){
  /*Para coger los parametros de la url es con req.params.:id
    Para coger los parametros de un formulario con post req.body.:id
    Para coger los parametros de un formulario por get(en la url) con req.query.:id
  */
  var allD=0;
  var nameDep = req.body.nDep;//para ver que se envia desde el formulario
  var dep = req.body.dep;
  var preUrl = req.body.preUrl;
  console.log("Nombre del deployment seleccionado:"+nameDep);
  console.log("Nombre de la url del deployment:"+dep);
  dep = preUrl + dep;
  
  var fismoArray = [];
  MongoClient.connect(newurlMongdb, function(err, db){
    if(err) throw err;
    var cursor = db.collection('fismos').find();
    cursor.forEach(function(doc, err){
      fismoArray.push(doc);
    }, function(){
      //LA FIESTA VA AQUI
      var dataJson = JSON.parse(fismoArray[1].data);
      var items = dataJson.items;
      var devices = [];//dispositivos que son su propio systema
      var typeDev = [];
      var endpoints = [];
      var qks = [];
      var units = [];
      //var devs = [];
      //Array de systemas
      var sys = [];
      //Array de array donde van los subsistemas
      var subsystems = [];
      var typeSubs = [];
      var endSubs = [];
      var qkSubs = [];
      var unitSubs = [];
      //Extraer todos los devices que me sirven
      var i = 0;
      var numSys = 0;
      for(i;i<items.length;i++){
      //if(items[i].dev.substring(0,d.lastIndexOf("/"))!="https://platform.fiesta-iot.eu/iot-registry/api/observations"){
        if(items[i].Dep!=undefined/* || items[i].DepofS!=undefined*/){
        //Si el device no tiene Depl o un systema con Deplo no sirve el device
          if(items[i].Dep==dep/* || items[i].DepofS==dep*/){//Que el deployment sea el que se ha seleccionado
            //Los dev que tienen un sys se añaden en otro momento
            if(items[i].dev!=undefined){//hay subD o no
                //Solo leo los dispositivos que son del tipo Device osea systemas
              if(items[i].sys!=undefined){
                //typeDev.push("System");
                sys.push(items[i].sys.substring(items[i].sys.lastIndexOf("/")+1));
                var auxS = [];
                var auxT = [];
                var auxE = [];
                var auxqK = [];
                var auxU = [];
                //Agregar aqui PLATFORM con localizacion
                var j=0;
                //Busca los subsystemas que tiene ese device y los mete en un array
                for(j;j+i<items.length;j++){
                  if(items[i+j].sys!=undefined){
                    if(items[i+j].sys==items[i].sys){
                      allD++;
                      auxS.push(items[i+j].dev.substring(items[i+j].dev.lastIndexOf("/")+1));
                      auxT.push(items[i+j].typeSubD.substring(items[i+j].typeSubD.lastIndexOf("#")+1));
                      if(items[i+j].endp/*SD*/!=undefined){
                        auxE.push(items[i+j].endp/*SD*/.substring(0,items[i+j].endp/*SD*/.lastIndexOf("^")-1));
                      }
                      else{
                        auxE.push("NODATA");
                      }
                      //Puede que haya que hacer sentencia if else pero en teoria todos los devices tienen un qk y unit
                      if(items[i+j].qK/*SD*/!=undefined){
                        auxqK.push(items[i+j].qK/*SD*/.substring(items[i+j].qK/*SD*/.lastIndexOf("#")+1));
                      }
                      else{
                        auxqK.push("NODATA");
                      }
                      if(items[i+j].unit/*SD*/!=undefined){
                        auxU.push(items[i+j].unit/*SD*/.substring(items[i+j].unit/*SD*/.lastIndexOf("#")+1));
                      }
                      else{
                        auxU.push("NODATA");
                      }             
                    }
                    else{
                      i=i+j;//Continua el valor de i mas los subsystemas agregados con valor j
                      break;
                     }
                  }
                  
                }
                 
                subsystems.push(auxS);
                typeSubs.push(auxT);
                endSubs.push(auxE);
                qkSubs.push(auxqK);
                unitSubs.push(auxU);
                numSys++;
                  
              }
              else{//Device == SYSTEM
                typeDev.push(items[i].typeSubD.substring(items[i].typeSubD.lastIndexOf("#")+1));
                //Todo el enlace
                devices.push(items[i].dev);
                allD++;
                //Solo el número identificativo despues de el ultimo /
                //devs.push(items[i].dev.substring(items[i].dev.lastIndexOf("/")+1));
                if(items[i].endp!=undefined){
                    endpoints.push(items[i].endp.substring(0,items[i].endp.lastIndexOf("^")-1));
                  }
                else{
                  endpoints.push("NODATA");
                }
                if(items[i].qK!=undefined){
                    qks.push(items[i].qK.substring(items[i].qK.lastIndexOf("#")+1));
                  }
                  else{
                    qks.push("NODATA");
                  }
                  if(items[i].unit!=undefined){
                    units.push(items[i].unit.substring(items[i].unit.lastIndexOf("#")+1));
                  }
                  else{
                    units.push("NODATA");
                  }
                //Agregar aqui PLATFORM con localizacion
              }
            }
          }
        }
      }
      console.log("Length of sys"+sys.length);//Misma longitud que el de abajo
      console.log("Length of sys in subsystems"+subsystems.length);
      console.log("Length of sys in Typesubsystems"+subsystems.length);
      res.render('devices', {
        title: 'Devices of Deployment '+nameDep,
        nameDep: nameDep,
        devices: devices,//enlace entero
        typeDev: typeDev,
        endpoints: endpoints,
        qks: qks,
        units: units,
        //devs: devs,//id despues de la /
        sys: sys,
        subsystems: subsystems,
        typeSubs: typeSubs,
        endSubs: endSubs,
        qkSubs: qkSubs,
        unitSubs: unitSubs,
        allD: allD
      });

      db.close();
    });
  });
};
/*
Guarda la peticion 
*/
exports.scheduledAction = function(req, res, next){
  var nameDep = req.params.nDep;//para ver que se envia desde el formulario
  var tDev = req.params.tDev;
  var endp = req.body.endp;
  var min = Number(req.body.min);
  var max = Number(req.body.max);
  var action = req.body.action;
  var email = req.body.email;
  var dev = req.body.dev;

  var newScheduledAction = {
    tDev : tDev,
    endp : endp,
    dev : dev,
    min : min,
    max : max,
    action : action,
    email : email
  };
  MongoClient.connect(newurlMongdb, function(err, db){
    if(err) throw err;
    db.collection('scheduledActions').insertOne(newScheduledAction, function(err, records){
      if(err){
        console.warn(err.message);
      }
      else{
        console.log("Scheduled Action added");

      }
      res.render('scheduledAdded', {
        title: 'Scheduled Added',
        tDev : tDev,
        endp : endp,
        min : min,
        max : max,
        action : action,
        email : email
      });
      db.close();
    });
  });
};
/*
Guarda lista de Devices

*/
exports.saveDevicesList = function(req,res,next){
  var listName = req.body.title;
  var devices = req.body.devices;
  var types = req.body.types;
  var units = req.body.units;
  var qks = req.body.qks;
  var values = req.body.values;
  var nameDep = req.params.nameDep;
  var dep = req.body.dep;
  var ulrDep = dep.substring(dep.lastIndexOf('/') + 1);
  var preUrl = dep.substring(0,dep.lastIndexOf('/')+1);
  /*var newDevicesListed = {
      listName : listName,
      devices : devices
  };*/
  console.log("Devices "+devices);
  console.log("Types "+types);
  MongoClient.connect(newurlMongdb, function(err, db){
    if(err) throw err;
    db.collection('devicesList').findAndModify(
      {listName:listName},
      [['_id','asc']],
      {$set: {"devices":devices, "types":types, "units":units, "qks":qks, "values":values}},
      //Crea uno nuevo si no encuentra ningun fismo(si esta vacio)
      //https://stackoverflow.com/questions/16358857/mongodb-atomic-findorcreate-findone-insert-if-nonexistent-but-do-not-update
      {upsert: true},
      function(err, result){
        if(err){
          console.warn(err.message);
          /*db.collection('fismos').insertOne(newfismo, function(err, records){
            console.log("Record added as "+records[0]._id);
          });*/
        }
        else{
        console.log("Devices List added");
        }
        res.render('devicesListAdded', {
          title: 'Created Devices List',
          nameDep : nameDep,
          ulrDep : ulrDep,
          preUrl : preUrl,
          listName : listName,
          devices : devices,
          types: types
        });

        db.close();
    });
  });

  /*mongo.connect(urlMongdb, function(err, db){
    if(err) throw err;
    db.collection('devicesList').insertOne(newDevicesListed, function(err, records){
      if(err){
        console.warn(err.message);
      }
      else{
        console.log("Devices List added");
      }
      res.render('devicesListAdded', {
        title: 'Devices List Added',
        listName : listName,
        devices : devices,
        types: types
      });
      db.close();
    });
  });*/


};


exports.readFileDevofDep = function(req,res,next){
  /*Para coger los parametros de la url es con req.params.:id
    Para coger los parametros de un formulario con post req.body.:id
    Para coger los parametros de un formulario por get(en la url) con req.query.:id
  */
  var nameDep = req.body.nDep;//para ver que se envia desde el formulario
  var dep = req.body.dep;
  var preUrl = req.body.preUrl;
  console.log("Nombre del deployment seleccionado:"+nameDep);
  console.log("Nombre de la url del deployment:"+dep);
  dep = preUrl + dep;
  // var files = fs.readdirSync('files/');
  const dirents = fs.readdirSync('files/', { withFileTypes: true });
  const files = dirents.filter(dirent => dirent.isFile()).map(dirent => dirent.name);
  var data = "";
  var max = 0;
  var n="";
  files.forEach(file => {
    console.log("Nombre del archivo: "+file);
    // console.log("Tipo del archivo: "+typeof(file));
    var maxf = Number(file.substring(file.lastIndexOf('T')+1,file.lastIndexOf('N')));
    if(maxf>max){
      n=file;
      console.log("AHORA: "+n);
    }
  });

  data = fs.readFileSync('files/' + n, 'utf8');
  //console.log("DATA "+data);
  var dataJson = JSON.parse(data);
  var items = dataJson.items;
  var devices = [];//dispositivos que son su propio systema
  var allD = 0;
  var typeDev = [];
  var endpoints = [];
  var qks = [];
  var units = [];
  var positions = [];
  var measures = [];
  //var devs = [];
  //Array de systemas
  var sys = [];
  //Array de array donde van los subsistemas
  var subsystems = [];
  var typeSubs = [];
  var endSubs = [];
  var qkSubs = [];
  var unitSubs = [];
  var positionSubs = [];
  var measureSubs =[];
  //Extraer todos los devices que me sirven
  var i = 0;
  var numSys = 0;
  var c=0;
  for(i;i<items.length;i++){
  //if(items[i].dev.substring(0,d.lastIndexOf("/"))!="https://platform.fiesta-iot.eu/iot-registry/api/observations"){
    if(items[i].Dep!=undefined/* || items[i].DepofS!=undefined*/){
    //Si el device no tiene Depl o un systema con Deplo no sirve el device
      if(items[i].Dep==dep/* || items[i].DepofS==dep*/){//Que el deployment sea el que se ha seleccionado
        //Los dev que tienen un sys se añaden en otro momento
        if(items[i].dev!=undefined){//hay subD o no
          //if(items[i].type!="http://purl.oclc.org/NET/ssnx/ssn#Device"){
            //Solo leo los dispositivos que son del tipo Device osea systemas
            var tNew ="";
            if(items[i].type.substring(items[i].type.lastIndexOf("#")+1)=="Device"){
              //typeDev.push("System");
              //console.log("Valor de i "+i);
              sys.push(items[i].dev/*.substring(items[i].dev.lastIndexOf("/")+1)*/);
              var auxS = [];
              var auxT = [];
              var auxE = [];
              var auxqK = [];
              var auxU = [];
              var auxP = [];
              var auxM = [];
              //Agregar aqui PLATFORM con localizacion
              //Hay Subsystemas o no
              if(items[i].subD!=undefined){
                var j=0;
                var sensorN="";
                var sensorN1="";
                var flagNuevo = false;
                //Busca los subsystemas que tiene ese device y los mete en un array
                for(j;j+i<items.length;j++){
                  if(items[i+j].dev==items[i].dev){
                    var sensorN1=items[i+j].subD;
                    if(sensorN==""){
                      sensorN=items[i+j].subD;
                      flagNuevo=true;
                    }
                    else{
                      if(sensorN!=sensorN1){
                        sensorN=items[i+j].subD;
                        flagNuevo=true;
                      }else{
                        flagNuevo=false;
                      }
                    }
                    if(flagNuevo){
                      auxS.push(items[i+j].subD/*.substring(items[i+j].subD.lastIndexOf("/")+1)*/);
                      auxT.push(items[i+j].typeSubD.substring(items[i+j].typeSubD.lastIndexOf("#")+1));
                      //NUMERO DEVICES
                      allD++;
                      if(items[i+j].endp/*SD*/!=undefined){
                        auxE.push(items[i+j].endp/*SD*/.substring(0,items[i+j].endp/*SD*/.lastIndexOf("^")-1));
                      }
                      else{
                        auxE.push("NODATA");
                      }
                      //Puede que haya que hacer sentencia if else pero en teoria todos los devices tienen un qk y unit
                      if(items[i+j].qK/*SD*/!=undefined){
                        auxqK.push(items[i+j].qK/*SD*/.substring(items[i+j].qK/*SD*/.lastIndexOf("#")+1));
                      }
                      else{
                        auxqK.push("NODATA");
                      }
                      if(items[i+j].unit/*SD*/!=undefined){
                        auxU.push(items[i+j].unit/*SD*/.substring(items[i+j].unit/*SD*/.lastIndexOf("#")+1));
                      }
                      else{
                        auxU.push("NODATA");
                      }
                      if(items[i+j].lat!=undefined&&items[i+j].long!=undefined){
                        var pos ={
                          "lat":Number(items[i+j].lat.substring(0,items[i+j].lat.lastIndexOf("^")-1)),
                          "long":Number(items[i+j].long.substring(0,items[i+j].long.lastIndexOf("^")-1))
                        }
                        auxP.push(pos);
                      }
                      else{
                        auxP.push("NODATA");
                      }
                      //NUEVO
                      if(items[i+j].num!=undefined){
                        auxM.push(Number(items[i+j].num.substring(0,items[i+j].num.indexOf("^^"))));
                      }
                      else{
                        auxM.push("NODATA"); 
                      } 
                    }else{c++;console.log("No se añade "+c);}  
                  }
                  else{
                    //console.log("VALOR DE I"+i);
                    //console.log("VALOR DE I"+j);
                    //console.log("Valor i "+i+" Valor j "+j);
                    i=i+j-1;//Continua el valor de i mas los subsystemas agregados con valor j
                    //Ya que estan ordenados por dev, y aparece el mismo system con diferentes
                    //subsystem en cada siguiente iteracción
                    //console.log("VALOR DE I2"+i);
                    break;
                  }
                }
                
              }
              //Systemas sin ningun subsystem
              else{//Deberia diferenciar entre El systema y subsistemas(los unicos que se ven ahora)
                auxS.push(items[i].dev/*.substring(items[i].dev.lastIndexOf("/")+1)*/);
                auxT.push(items[i].type.substring(items[i].type.lastIndexOf("#")+1));
                //allD++;
                if(items[i].endp!=undefined){
                  auxE.push(items[i].endp.substring(0,items[i].endp.lastIndexOf("^")-1));
                }
                else{
                  auxE.push("NODATA");
                }

                if(items[i].qK!=undefined){
                  auxqK.push(items[i].qK.substring(items[i].qK.lastIndexOf("#")+1));
                }
                else{
                  auxqK.push("NODATA");
                }
                if(items[i].unit!=undefined){
                  auxU.push(items[i].unit.substring(items[i].unit.lastIndexOf("#")+1));
                }
                else{
                  auxU.push("NODATA");
                }             
                if(items[i].lat!=undefined&&items[i].long!=undefined){
                  var pos ={
                    "lat":Number(items[i].lat.substring(0,items[i].lat.lastIndexOf("^")-1)),
                    "long":Number(items[i].long.substring(0,items[i].long.lastIndexOf("^")-1))
                  }
                  auxP.push(pos);
                }
                else{
                  auxP.push("NODATA");
                }
                //NUEVO
                if(items[i].num!=undefined){
                  auxM.push(Number(items[i].num.substring(0,items[i].num.indexOf("^^"))));
                }
                else{
                  auxM.push("NODATA"); 
                }
                
              }
              /*if(numSys==0){
                subsystems[0].push(auxS);
                typeSubs[0].push(auxT);  
              }
              else{*/
                subsystems.push(auxS);
                typeSubs.push(auxT);
                endSubs.push(auxE);
                qkSubs.push(auxqK);
                unitSubs.push(auxU);
                positionSubs.push(auxP);
                //NUEVO
                measureSubs.push(auxM);
              //}
              numSys++;
              
            }
            else{//Device == SYSTEM
              var sensorN="";
              var sensorN1="";
              var flagNuevo = false;
              var sensorN1=items[i].dev;
              if(sensorN==""){
                sensorN=items[i].dev;
                flagNuevo=true;
              }
              else{
                if(sensorN!=sensorN1){
                  flagNuevo=true;
                }else{
                  flagNuevo=false;
                }
              }
              if(flagNuevo){
                typeDev.push(items[i].type.substring(items[i].type.lastIndexOf("#")+1));
                //Todo el enlace
                devices.push(items[i].dev);
                allD++;
                //Solo el número identificativo despues de el ultimo /
                //devs.push(items[i].dev.substring(items[i].dev.lastIndexOf("/")+1));
                if(items[i].endp!=undefined){
                    endpoints.push(items[i].endp.substring(0,items[i].endp.lastIndexOf("^")-1));
                  }
                else{
                  endpoints.push("NODATA");
                }
                if(items[i].qK!=undefined){
                  qks.push(items[i].qK.substring(items[i].qK.lastIndexOf("#")+1));
                }
                else{
                  qks.push("NODATA");
                }
                if(items[i].unit!=undefined){
                  units.push(items[i].unit.substring(items[i].unit.lastIndexOf("#")+1));
                }
                else{
                  units.push("NODATA");
                }
                if(items[i].lat!=undefined&&items[i].long!=undefined){
                  var pos ={
                    "lat":Number(items[i].lat.substring(0,items[i].lat.lastIndexOf("^")-1)),
                    "long":Number(items[i].long.substring(0,items[i].long.lastIndexOf("^")-1))
                  }
                  positions.push(pos);
                }
                else{
                  positions.push("NODATA");
                }
                if(items[i].num!=undefined){
                  auxM.push(Number(items[i].num.substring(0,items[i].num.indexOf("^^"))));
                }
                else{
                  auxM.push("NODATA"); 
                }
              }
            }
            
          //}
        }
        /*else{//sale del for por que ya no hay mas dev
          break;
        }*/
      }
    }
  }
  console.log("Devices "+allD);
  console.log("Length of sys "+sys.length);//Misma longitud que el de abajo
  console.log("Length of sys in subsystems "+subsystems.length);
  console.log("Length of sys in Typesubsystems "+subsystems.length);

  var token = '';
  var body="";
  var request = https.request(optionsToken, function(response) {
    console.log('STATUS /token: ' + response.statusCode);
    if(response.statusCode === 401){
      console.info("UNAUTORIZADO TOKEN");
      res.render('devices', {
        title: 'Devices of Deployment '+nameDep,
        nameDep: nameDep,
        devices: devices,//enlace entero
        typeDev: typeDev,
        endpoints: endpoints,
        qks: qks,
        units: units,
        positions,
        measures,
        //devs: devs,//id despues de la /
        sys: sys,
        subsystems: subsystems,
        typeSubs: typeSubs,
        endSubs: endSubs,
        qkSubs: qkSubs,
        unitSubs: unitSubs,
        positionSubs,
        measureSubs,
        allD: allD,
        APIKeyGMJS: APIKeyGMJS,
        dep:dep
      });
    }
    else{
      console.log('HEADERS /token: ' + JSON.stringify(response.headers));
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
          "SELECT ?obs ?s ?sys ?t ?num ?unit ?lat ?long ?qk ?type "+
          "WHERE {"+
            "?obs a ssn:Observation."+
            "?obs ssn:observedBy ?s ."+
            "?s rdf:type ?type ."+
            "optional{"+
            "?s iot-lite:isSubSystemOf ?sys ."+
            "?sys ssn:hasDeployment ?Dep ."+
            "}"+
            "VALUES ?Dep {"+
              "<"+dep+">"+
            "} ."+
            "?obs ssn:observationSamplingTime ?time ."+
            "?time time:inXSDDateTime ?t ."+
            "?obs ssn:observationResult ?result ."+
            "?result ssn:hasValue ?value ."+
            "?value dul:hasDataValue ?num ."+
            "?obs geo:location ?point ."+
            "?point geo:lat ?lat ."+
            "?point geo:long ?long ."+
            "?s iot-lite:hasQuantityKind ?qKURI ."+
            "?qKURI rdf:type ?qk ."+
            "?s iot-lite:hasUnit ?unitURI ."+
            "?unitURI rdf:type ?unit ."+
          "}ORDER BY ?t";
          console.log(postData);
        var options = {
          host: 'platform.fiesta-iot.eu',
          path: '/iot-registry/api/queries/execute/global',
          method: 'POST',
          headers: {
                'Content-Type': 'text/plain',
                'Content-Length': Buffer.byteLength(postData),
                'Accept': 'application/json',
                'iPlanetDirectoryPro': token
          },
          timeout: 660000//10 minutos
        };
        //var timeObs = [];//fecha de las observaciones
        //var measures = [];//medidas de las observaciones
        var request = https.request(options, function(response) {
          body="";
          console.log('STATUS /observations: ' + response.statusCode);
          if(response.statusCode === 401){
            //Token no valido unautorizado
            console.log("UNAUTORIZADO DEVANDOBS");
            res.render('devices', {
              title: 'Devices of Deployment '+nameDep,
              nameDep: nameDep,
              devices: devices,//enlace entero
              typeDev: typeDev,
              endpoints: endpoints,
              qks: qks,
              units: units,
              positions,
              measures,
              //devs: devs,//id despues de la /
              sys: sys,
              subsystems: subsystems,
              typeSubs: typeSubs,
              endSubs: endSubs,
              qkSubs: qkSubs,
              unitSubs: unitSubs,
              positionSubs,
              measureSubs,
              allD: allD,
              APIKeyGMJS: APIKeyGMJS,
              dep:dep
            });
          }
          else{
            console.log('HEADERS /observations: ' + JSON.stringify(response.headers));
            response.on('data', function(chunk) {
              //Capturar esto para ver si hay error y transmitir a la pagina un error en el servidor y guardar logs
              body+=chunk;
              //console.log("CHUNK "+chunk);
            }).on('end', function() {
              if(response.statusCode===200){
                var JsonChunk = JSON.parse(body);//cazar exceptino
                var items = JsonChunk.items;
                //Extraer todas las observaciones que me sirven
                if(items.length==0){
                  //No hay observaciones de este sensor
                  console.log("VACIOOOOOO");
                }
                else{
                  console.log("LLEEEENOO Medidas Observacion");
                  for(i=0;i<items.length;i++){
                    if(items[i].s!=undefined){
                      if(items[i].sys){
                        var flagObs = false;//flag para comprobar si hay un systema nuevo
                        for(var j=0;j<sys.length;j++){
                          if(items[i].sys==sys[j]){
                            flagObs=true;
                            //console.log("Hay un sistema que coincide");
                            for(var k=0;k<subsystems[j].length;k++){
                              if(subsystems[j][k]==items[i].s){
                                //console.log("Agregar medida");
                                if(measureSubs[j][k]=="NODATA"){
                                  console.log("--Medida agregada");
                                  measureSubs[j][k]=Number(items[i].num.substring(0,items[i].num.indexOf("^^")));
                                }
                                break;
                              }
                              if((k+1)==subsystems[j].length){//solo lo añade al final cuando ha comprobado que no esta ya
                                allD++;
                                console.log("Nuevo sensor en Systema existente"+j+"-"+k);
                                subsystems[j].push(items[i].s);
                                typeSubs[j].push(items[i].type.substring(items[i].type.lastIndexOf("#")+1));
                                
                                if(items[i].endp!=undefined){
                                  endSubs[j].push(items[i].endp.substring(0,items[i].endp.lastIndexOf("^")-1));
                                }
                                else{
                                  endSubs[j].push("NODATA");
                                }
                                if(items[i].qk!=undefined){
                                  qkSubs[j].push(items[i].qk.substring(items[i].qk.lastIndexOf("#")+1));
                                }
                                else{
                                  qkSubs[j].push("NODATA");
                                }
                                if(items[i].unit!=undefined){
                                  unitSubs[j].push(items[i].unit.substring(items[i].unit.lastIndexOf("#")+1));
                                }
                                else{
                                  unitSubs[j].push("NODATA");
                                }
                                if(items[i].lat!=undefined&&items[i].long!=undefined){
                                  var pos ={
                                    "lat":Number(items[i].lat.substring(0,items[i].lat.lastIndexOf("^")-1)),
                                    "long":Number(items[i].long.substring(0,items[i].long.lastIndexOf("^")-1))
                                  }
                                  positionSubs[j].push(pos);
                                }
                                else{
                                  positionSubs[j].push("NODATA");
                                }
                                measureSubs[j].push(Number(items[i].num.substring(0,items[i].num.indexOf("^^"))));
                              }
                            }
                          }
                        }
                        if(!flagObs){//Si no ha encontrado ningún sistema entonces tendra que añadir uno nuevo
                          console.log("Sistema nuevo - Sensor nuevo");
                          sys.push(items[i].sys);
                          var auxS = [];
                          var auxT = [];
                          var auxE = [];
                          var auxQ = [];
                          var auxU = [];
                          var auxP = [];
                          var auxM = [];
                          allD++;
                          auxS.push(items[i].s);
                          subsystems.push(auxS);
                          auxT.push(items[i].type.substring(items[i].type.lastIndexOf("#")+1));
                          typeSubs.push(auxT);
                          if(items[i].endp!=undefined){
                            auxE.push(items[i].endp.substring(0,items[i].endp.lastIndexOf("^")-1));
                            endSubs.push(auxE);
                          }
                          else{
                            auxE.push("NODATA");
                            endSubs.push(auxE);
                          }
                          if(items[i].qK!=undefined){
                            auxQ.push(items[i].qK.substring(items[i].qK.lastIndexOf("#")+1));
                            akSubs.push(auxQ);
                          }
                          else{
                            auxQ.push("NODATA");
                            qkSubs.push(auxQ);
                          }
                          if(items[i].unit!=undefined){
                            auxU.push(items[i].unit.substring(items[i].unit.lastIndexOf("#")+1));
                            unitSubs.push(auxU);
                          }
                          else{
                            auxU.push("NODATA");
                            unitSubs.push(auxU);
                          }
                          if(items[i].lat!=undefined&&items[i].long!=undefined){
                            var pos ={
                              "lat":Number(items[i].lat.substring(0,items[i].lat.lastIndexOf("^")-1)),
                              "long":Number(items[i].long.substring(0,items[i].long.lastIndexOf("^")-1))
                            }
                            auxP.push(pos);
                            positionSubs.push(auxP);
                          }
                          else{
                            auxP.push("NODATA");
                            positionSubs.push(auxP);
                          }
                          //NUEVO
                          auxM.push(Number(items[i].num.substring(0,items[i].num.indexOf("^^"))));
                          measureSubs.push(auxM);
                        }
                      }//No tiene sistema
                      else{
                        var flagObs=false;
                        for(var j=0;j<devices.length;j++){
                          if(items[i].s==devices[j]){
                            if(measures[j]=="NODATA"){
                              console.log("--Medida agregada device sin systema");
                              measures[j]=Number(items[i].num.substring(0,items[i].num.indexOf("^^")));
                            }
                            flagObs=true;
                          }
                        }
                        if(!flagObs){
                          console.log("Hay un device nuevo sin sistema");
                          allD++;
                          //Aqui poner el sensor directamente en uno libre sin Systemas
                          devices.push(items[i].s);
                          typeDev.push(items[i].type.substring(items[i].type.lastIndexOf("#")+1));
                          if(items[i].endp!=undefined){
                             endpoints.push(items[i].endp.substring(0,items[i].endp.lastIndexOf("^")-1));
                          }
                          else{
                            endpoints.push("NODATA");
                          }
                          if(items[i].qK!=undefined){
                            qks.push(items[i].qK.substring(items[i].qK.lastIndexOf("#")+1));
                          }
                          else{
                            qks.push("NODATA");
                          }
                          if(items[i].unit!=undefined){
                            units.push(items[i].unit.substring(items[i].unit.lastIndexOf("#")+1));
                          }
                          else{
                            units.push("NODATA");
                          }
                          if(items[i].lat!=undefined&&items[i].long!=undefined){
                            var pos ={
                              "lat":Number(items[i].lat.substring(0,items[i].lat.lastIndexOf("^")-1)),
                              "long":Number(items[i].long.substring(0,items[i].long.lastIndexOf("^")-1))
                            }
                            positions.push(pos);
                          }
                          else{
                            positions.push("NODATA");
                          }
                          //NUEVO
                          measures.push(Number(items[i].num.substring(0,items[i].num.indexOf("^^"))));
                        }
                      }
                    }
                  }
                }
              }
              console.log("Devices"+allD);
              console.log("Length of sys"+sys.length);//Misma longitud que el de abajo
              console.log("Length of sys in subsystems"+subsystems.length);
              console.log("Length of sys in Typesubsystems"+subsystems.length);
              res.render('devices', {
                title: 'Devices of Deployment '+nameDep,
                nameDep: nameDep,
                devices: devices,//enlace entero
                typeDev: typeDev,
                endpoints: endpoints,
                qks: qks,
                units: units,
                positions,
                measures,
                //devs: devs,//id despues de la /
                sys: sys,
                subsystems: subsystems,
                typeSubs: typeSubs,
                endSubs: endSubs,
                qkSubs: qkSubs,
                unitSubs: unitSubs,
                positionSubs,
                measureSubs,
                allD: allD,
                APIKeyGMJS: APIKeyGMJS,
                dep:dep
              });
            })
          }
        });
        request.on('error', function(e) {
          console.log("ERROR "+e.message);
          res.render('devices', {
            title: 'Devices of Deployment '+nameDep,
            nameDep: nameDep,
            devices: devices,//enlace entero
            typeDev: typeDev,
            endpoints: endpoints,
            qks: qks,
            units: units,
            positions,
            measures,
            //devs: devs,//id despues de la /
            sys: sys,
            subsystems: subsystems,
            typeSubs: typeSubs,
            endSubs: endSubs,
            qkSubs: qkSubs,
            unitSubs: unitSubs,
            positionSubs,
            measureSubs,
            allD: allD,
            APIKeyGMJS: APIKeyGMJS,
            dep:dep
          });
        });
        request.write(postData);
        request.end();
      });
    }
  });
  request.on('error', function(e) {
    console.log("ERROR "+e.message);
     res.render('devices', {
      title: 'Devices of Deployment '+nameDep,
      nameDep: nameDep,
      devices: devices,//enlace entero
      typeDev: typeDev,
      endpoints: endpoints,
      qks: qks,
      units: units,
      positions,
      measures,
      //devs: devs,//id despues de la /
      sys: sys,
      subsystems: subsystems,
      typeSubs: typeSubs,
      endSubs: endSubs,
      qkSubs: qkSubs,
      unitSubs: unitSubs,
      positionSubs,
      measureSubs,
      allD: allD,
      APIKeyGMJS: APIKeyGMJS,
      dep:dep
    });
  });  
  request.end();
};

//---------------------------------------------------------------------------------------
