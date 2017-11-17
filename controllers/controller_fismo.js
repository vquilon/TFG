var fs = require('fs');
var https = require('https');
var http = require('http');

var mongoose = require('mongoose'),
  //Deployments = mongoose.model('Deployments'),
  fismo = mongoose.model('fismo');//Poner modelo que guarda de los fismos
var urlMongdb = "mongodb://localhost:27017/prosumerFiot";
var mongo = require('mongodb').MongoClient;
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
  
  var newfismo = {
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

  res.send(data);
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
  console.log(req);
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

  //GUARDAR EN LA BASE DE DATOS
  var newfismo = {
    name : name,
    info : info,
    data : data
  };
  mongo.connect(urlMongdb, function(err, db){
    if(err) throw err;
    db.collection('fismos').findAndModify(
      {name:"DevicesDeployments"},
      [['_id','asc']],
      {$set: {"info":info, "data":data}},
      //Crea uno nuevo si no encuentra ningun fismo(si esta vacio)
      //https://stackoverflow.com/questions/16358857/mongodb-atomic-findorcreate-findone-insert-if-nonexistent-but-do-not-update
      {upsert: true},
      function(err, result){
        if(err){
          console.warn(err.message);
          /*db.collection('fismos').insertOne(newfismo, function(err, records){
            console.log("Record added as "+records[0]._id);
          });*/
        }else{
            //console.dir(result);
            console.log("Update fismo");
        }

        db.close();
    });
  });

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
  
  res.send(data);
};

//Mostrar los deployments por mongo o files, y de un deployment mostrar los devices


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

  var fismoArray = [];
  mongo.connect(urlMongdb, function(err, db){
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

 };
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

exports.readFiles = function (req, res, next){
  var files = fs.readdirSync('files/');
  var data = [];
  files.forEach(file => {
    data.push(fs.readFileSync('files/' + file, 'utf8')); 
  });

  res.render('files',
          { title:'Read Files',
            files:files,
            data:data});
};

exports.deploymentsReadMongo = function(req,res,next){
  
  var fismoArray = [];
  mongo.connect(urlMongdb, function(err, db){
    if(err) throw err;
    var cursor = db.collection('fismos').find();
    cursor.forEach(function(doc, err){
      fismoArray.push(doc);
    }, function(){
      //LA FIESTA VA AQUI
      var deps = [];
      var nameDeps = [];
      var preUrlDeps = [];
      //Completar añadiendo lectura de mongodb------------------------------
      //console.log("CHUNK "+chunk);
      //var JsonChunk = JSON.parse(chunk);
      var dataJson = JSON.parse(fismoArray[0].data);
      var items = dataJson.items;
      console.log(items.length);
      console.log(items[2].Deps)
      for(var i=0;i<items.length;i++){
        if(items[i].DepOne){
          var d = items[i].DepOne;
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
               nameDeps.push("DeploymentUNKNOWN");
               break;
           }
          /*Coge el enlace antes de el numero*/
            preUrlDep = d.substring(0,d.lastIndexOf('/')+1);
            preUrlDeps.push(preUrlDep);
        }
      }
      console.log("DEPLOYMENTS Json "+ deps);
              
      res.render('deployments', {
         title: 'Get Deployments',
         deps: deps, 
          nameDeps: nameDeps,
          preUrlDeps: preUrlDeps
      });

      db.close();
    });
  });

  
            
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
exports.readMongoDevofDep = function(req,res,next){
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
  mongo.connect(urlMongdb, function(err, db){
    if(err) throw err;
    var cursor = db.collection('fismos').find();
    cursor.forEach(function(doc, err){
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
                  sys.push(items[i].dev.substring(items[i].dev.lastIndexOf("/")+1));
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
                        auxS.push(items[i+j].subD.substring(items[i+j].subD.lastIndexOf("/")+1));
                        auxT.push(items[i+j].typeSubD.substring(items[i+j].typeSubD.lastIndexOf("#")+1));
                        //NUMERO DEVICES
                        allD++;
                        if(items[i+j].endp/*SD*/!=undefined){
                          auxE.push(items[i+j].endp/*SD*/.substring(0,items[i+j].endp/*SD*/.lastIndexOf("^")-1));
                        }
                        else{
                          auxE.push("No endp");
                        }
                        //Puede que haya que hacer sentencia if else pero en teoria todos los devices tienen un qk y unit
                        if(items[i+j].qK/*SD*/!=undefined){
                          auxqK.push(items[i+j].qK/*SD*/.substring(items[i+j].qK/*SD*/.lastIndexOf("#")+1));
                        }
                        else{
                          auxqK.push("No QK");
                        }
                        if(items[i+j].unit/*SD*/!=undefined){
                          auxU.push(items[i+j].unit/*SD*/.substring(items[i+j].unit/*SD*/.lastIndexOf("#")+1));
                        }
                        else{
                          auxU.push("No UNIT");
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
                    auxS.push(items[i].dev.substring(items[i].dev.lastIndexOf("/")+1));
                    auxT.push(items[i].type.substring(items[i].type.lastIndexOf("#")+1));
                    allD++;
                    if(items[i].endp!=undefined){
                      auxE.push(items[i].endp.substring(0,items[i].endp.lastIndexOf("^")-1));
                    }
                    else{
                      auxE.push("No endp");
                    }

                    if(items[i].qK!=undefined){
                      auxqK.push(items[i].qK.substring(items[i].qK.lastIndexOf("#")+1));
                    }
                    else{
                      auxqK.push("No QK");
                    }
                    if(items[i].unit!=undefined){
                      auxU.push(items[i].unit.substring(items[i].unit.lastIndexOf("#")+1));
                    }
                    else{
                      auxU.push("No UNIT");
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
                    endpoints.push("No endp");
                  }
                  if(items[i].qK!=undefined){
                      qks.push(items[i].qK.substring(items[i].qK.lastIndexOf("#")+1));
                    }
                    else{
                      qks.push("No QK");
                    }
                    if(items[i].unit!=undefined){
                      units.push(items[i].unit.substring(items[i].unit.lastIndexOf("#")+1));
                    }
                    else{
                      units.push("No UNIT");
                    }
                  //Agregar aqui PLATFORM con localizacion
                }
                
              //}
            }
          }
        }
      }
      console.log("Length of sys"+sys.length);//Misma longitud que el de abajo
      console.log("Length of sys in subsystems"+subsystems.length);
      console.log("Length of sys in Typesubsystems"+subsystems.length);
      res.render('devices', {
        title: 'Get Devices of Deployment '+nameDep,
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
  mongo.connect(urlMongdb, function(err, db){
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
                      auxT.push(items[i+j].typeS.substring(items[i+j].typeS.lastIndexOf("#")+1));
                      if(items[i+j].endp/*SD*/!=undefined){
                        auxE.push(items[i+j].endp/*SD*/.substring(0,items[i+j].endp/*SD*/.lastIndexOf("^")-1));
                      }
                      else{
                        auxE.push("No endp");
                      }
                      //Puede que haya que hacer sentencia if else pero en teoria todos los devices tienen un qk y unit
                      if(items[i+j].qK/*SD*/!=undefined){
                        auxqK.push(items[i+j].qK/*SD*/.substring(items[i+j].qK/*SD*/.lastIndexOf("#")+1));
                      }
                      else{
                        auxqK.push("No QK");
                      }
                      if(items[i+j].unit/*SD*/!=undefined){
                        auxU.push(items[i+j].unit/*SD*/.substring(items[i+j].unit/*SD*/.lastIndexOf("#")+1));
                      }
                      else{
                        auxU.push("No UNIT");
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
                typeDev.push(items[i].typeS.substring(items[i].typeS.lastIndexOf("#")+1));
                //Todo el enlace
                devices.push(items[i].dev);
                allD++;
                //Solo el número identificativo despues de el ultimo /
                //devs.push(items[i].dev.substring(items[i].dev.lastIndexOf("/")+1));
                if(items[i].endp!=undefined){
                    endpoints.push(items[i].endp.substring(0,items[i].endp.lastIndexOf("^")-1));
                  }
                else{
                  endpoints.push("No endp");
                }
                if(items[i].qK!=undefined){
                    qks.push(items[i].qK.substring(items[i].qK.lastIndexOf("#")+1));
                  }
                  else{
                    qks.push("No QK");
                  }
                  if(items[i].unit!=undefined){
                    units.push(items[i].unit.substring(items[i].unit.lastIndexOf("#")+1));
                  }
                  else{
                    units.push("No UNIT");
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
        title: 'Get Devices of Deployment '+nameDep,
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


exports.readMongoCrossOver = function(req,res,next){
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
  
  var fismoArray = [];
  mongo.connect(urlMongdb, function(err, db){
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
              //if(items[i].type!="http://purl.oclc.org/NET/ssnx/ssn#Device"){
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
                  //Hay Subsystemas o no
                  if(items[i].sys!=undefined){
                    var j=0;
                    //Busca los subsystemas que tiene ese device y los mete en un array
                    for(j;j<items.length;j++){
                      if(items[i+j].sys==items[i].sys){
                        auxS.push(items[i+j].dev.substring(items[i+j].dev.lastIndexOf("/")+1));
                        auxT.push(items[i+j].typeS.substring(items[i+j].typeS.lastIndexOf("#")+1));
                        if(items[i+j].endp/*SD*/!=undefined){
                          auxE.push(items[i+j].endp/*SD*/.substring(0,items[i+j].endp/*SD*/.lastIndexOf("^")-1));
                        }
                        else{
                          auxE.push("No endp");
                        }
                        //Puede que haya que hacer sentencia if else pero en teoria todos los devices tienen un qk y unit
                        if(items[i+j].qK/*SD*/!=undefined){
                          auxqK.push(items[i+j].qK/*SD*/.substring(items[i+j].qK/*SD*/.lastIndexOf("#")+1));
                        }
                        else{
                          auxqK.push("No QK");
                        }
                        if(items[i+j].unit/*SD*/!=undefined){
                          auxU.push(items[i+j].unit/*SD*/.substring(items[i+j].unit/*SD*/.lastIndexOf("#")+1));
                        }
                        else{
                          auxU.push("No UNIT");
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
                    auxS.push(items[i].dev.substring(items[i].dev.lastIndexOf("/")+1));
                    auxT.push(items[i].typeS.substring(items[i].typeS.lastIndexOf("#")+1));
                    if(items[i].endp!=undefined){
                      auxE.push(items[i].endp.substring(0,items[i].endp.lastIndexOf("^")-1));
                    }
                    else{
                      auxE.push("No endp");
                    }

                    if(items[i].qK!=undefined){
                      auxqK.push(items[i].qK.substring(items[i].qK.lastIndexOf("#")+1));
                    }
                    else{
                      auxqK.push("No QK");
                    }
                    if(items[i].unit!=undefined){
                      auxU.push(items[i].unit.substring(items[i].unit.lastIndexOf("#")+1));
                    }
                    else{
                      auxU.push("No UNIT");
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
                  typeDev.push(items[i].typeS.substring(items[i].typeS.lastIndexOf("#")+1));
                  //Todo el enlace
                  devices.push(items[i].dev);
                  //Solo el número identificativo despues de el ultimo /
                  //devs.push(items[i].dev.substring(items[i].dev.lastIndexOf("/")+1));
                  if(items[i].endp!=undefined){
                      endpoints.push(items[i].endp.substring(0,items[i].endp.lastIndexOf("^")-1));
                    }
                  else{
                    endpoints.push("No endp");
                  }
                  if(items[i].qK!=undefined){
                      qks.push(items[i].qK.substring(items[i].qK.lastIndexOf("#")+1));
                    }
                    else{
                      qks.push("No QK");
                    }
                    if(items[i].unit!=undefined){
                      units.push(items[i].unit.substring(items[i].unit.lastIndexOf("#")+1));
                    }
                    else{
                      units.push("No UNIT");
                    }
                  //Agregar aqui PLATFORM con localizacion
                }
                
              //}
            }
          }
        }
      }
      console.log("Length of sys"+sys.length);//Misma longitud que el de abajo
      console.log("Length of sys in subsystems"+subsystems.length);
      console.log("Length of sys in Typesubsystems"+subsystems.length);
      res.render('devices', {
        title: 'Get Devices of Deployment '+nameDep,
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
        unitSubs: unitSubs
      });

      db.close();
    });
  });

 
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
  var files = fs.readdirSync('files/');
  var data = "";
  var max = 0;
  var n="";
  files.forEach(file => {
    console.log("Nombre del archivo: "+file);
    console.log("Nombre del archivo: "+typeof(file));
    var maxf = Number(file.substring(file.lastIndexOf('T')+1,file.lastIndexOf('N')));
    if(maxf>max){
      n=file;
      console.log("AHORA"+n);
    }
  });
  /*files.forEach(file => {
    if(file==n){
      data = fs.readFileSync('files/' + file, 'utf8');
    }
  });*/
  data = fs.readFileSync('files/' + n, 'utf8');
  //console.log("DATA "+data);
  var jsonData = JSON.parse(data);
  var items = dataJson.items;
  var devices = [];
  var typeDev = [];
  var devs = [];
  //Array de systemas
  var sys = [];
  //Array de array donde van los subsistemas
  var subsystems = [[]];
  var typeSubs = [[]];
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
            //Tipo de dispositivo
            if(items[i].type.substring(items[i].type.lastIndexOf("#")+1)=="Device"){
              //typeDev.push("System");
              sys.push(items[i].dev.substring(items[i].dev.lastIndexOf("/")+1));
              var auxS = [];
              var auxT = [];
              //Hay Subsystemas o no
              if(items[i].subD!=undefined){
                var j=0;
                //Busca los subsystemas que tiene ese device y los mete en un array
                for(j;j<items.length;j++){
                  if(items[i+j].dev==items[i].dev){
                    auxS.push(items[i+j].subD.substring(items[i+j].subD.lastIndexOf("/")+1));
                    auxT.push(items[i+j].typeSubD.substring(items[i+j].typeSubD.lastIndexOf("#")+1));
                  }
                  else{
                    //console.log("VALOR DE I"+i);
                    //console.log("VALOR DE I"+j);
                    i=i+j;
                    //console.log("VALOR DE I2"+i);
                    break;
                  }
                }
                
              }
              //Device==System
              else{//Deberia diferenciar entre El systema y subsistemas(los unicos que se ven ahora)
                auxS.push(items[i].dev.substring(items[i].dev.lastIndexOf("/")+1));
                auxT.push(items[i].type.substring(items[i].type.lastIndexOf("#")+1));
              }
              /*if(numSys==0){
                subsystems[0].push(auxS);
                typeSubs[0].push(auxT);  
              }
              else{*///Empiezan en el valor 1 no en el 0
                subsystems.push(auxS);
                typeSubs.push(auxT);  
              //}
              numSys++;
              
            }
            else{
              typeDev.push(items[i].type.substring(items[i].type.lastIndexOf("#")+1));
              //Todo el enlace
              devices.push(items[i].dev);
              //Solo el número identificativo despues de el ultimo /
              devs.push(items[i].dev.substring(items[i].dev.lastIndexOf("/")+1));
              
            }
            
          //}
        }
      }
    }
  }
  console.log("Length of sys"+sys.length);//Siempre hay uno menos porque??TIENE UNA MENOS PERO ES LA REAL SUBSYSTEMS EMPIEZA EN EL INDICE 1 el 0 esta vacio
  console.log("Length of sys in subsystems"+subsystems.length);
  console.log("Length of sys in Typesubsystems"+subsystems.length);
  res.render('devices', {
    title: 'Get Devices of Deployment '+nameDep,
    devices: devices,//enlace entero
    //devs: devs,//id despues de la /
    sys: sys,
    subsystems: subsystems,
    typeSubs: typeSubs,
    typeDev: typeDev,
    nameDep: nameDep
  });
};

//---------------------------------------------------------------------------------------