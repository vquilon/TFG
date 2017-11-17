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
var controller_fismo = require('../controllers/controller_fismo');
var controller_rest = require('../controllers/controller_rest');
var controller_wf = require('../controllers/controller_wf');

/* GET home page. */
router.get('/', controller.home);

//Controller fismo
router.post('/', upload.any(), controller_fismo.fismo);
router.post('/fismo', upload2.any(), controller_fismo.fismo2);
router.get('/readMongo', controller_fismo.readMongo);
router.get('/readFiles', controller_fismo.readFiles);
router.get('/deployments', controller_fismo.deploymentsReadMongo);
router.post('/:nameDep/readFileDevices', controller_fismo.readFileDevofDep);
router.post('/:nameDep/readMongoDevices', controller_fismo.readMongoDevofDep);
router.post('/:nameDep/readMongoDevices2', controller_fismo.readMongoDevofDep2);
router.post('/:nameDep/readMongoCrossOver', controller_fismo.readMongoCrossOver);
//Controller Mongo y Rest
router.get('/deploymentsRest', controller_rest.deployments);
router.post('/:nameDep/devices', controller_rest.DevOfDep);
router.post('/:nameDep/:tDev/observations', controller_rest.ObsOfDev);
//NUEVO por endpoints
router.post('/:nameDep/:tDev/endpoint', controller_rest.EndpOfDev);

//Controller Water Fall
router.get('/deploymentsWF', controller_wf.deploymentsWF);

module.exports = router;
