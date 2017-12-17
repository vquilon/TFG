var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');

var number;
number = fs.readdirSync('files/');
number = number.length;
console.log("Numero de ficheros "+number);

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'files/')
    },
    filename: function (req, file, cb) {
        cb(null, "devDepT"+ Date.now() + "N" + number + ".json");
  }
});
//Guardando en carpetas
var upload = multer({ storage: storage });
//Sin guardar en las carpetas
var upload2 = multer();

var controller = require('../controllers/controller');
var controller_mongoDBFile = require('../controllers/controller_mongoDBFile');
var controller_rest = require('../controllers/controller_rest');
var controller_wf = require('../controllers/controller_wf');

/* GET home page. */
router.get('/', controller.home);

//Controller fismo
router.post('/', upload.any(), controller_mongoDBFile.fismo);
router.post('/fismo', upload2.any(), controller_mongoDBFile.fismo2);
router.get('/readMongo', controller_mongoDBFile.readMongo);
router.get('/readFiles', controller_mongoDBFile.readFiles);
router.get('/deployments', controller_mongoDBFile.deploymentsReadMongo);
router.post('/:nameDep/readFileDevices', controller_mongoDBFile.readFileDevofDep);
router.post('/:nameDep/readMongoDevices', controller_mongoDBFile.readMongoDevofDep);//devices 0
router.post('/:nameDep/readMongoDevices2', controller_mongoDBFile.readMongoDevofDep2);//sensing 1
router.post('/:nameDep/readMongoCrossOver', controller_mongoDBFile.readMongoCrossOver);

//Controller Mongo y Rest
router.get('/deploymentsRest', controller_rest.deployments);
router.post('/:nameDep/devices', controller_rest.DevOfDep);
router.post('/:nameDep/:tDev/observations', controller_rest.ObsOfDev);
//NUEVO por endpoints
router.post('/:nameDep/:tDev/endpoint', controller_rest.EndpOfDev);

//NUEVO controler para llevar el scheduled time y guardado en MongoDB
router.post('/:nameDep/:tDev/scheduled', controller_mongoDBFile.scheduledAction);

//Controller Water Fall
router.get('/deploymentsWF', controller_wf.deploymentsWF);

module.exports = router;
//Contraseña vpsadmin@vps165.cesvima.upm.es: 25e097aea662