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
var controller_fesmo = require('../controllers/controller_fesmo');
var controller_rest = require('../controllers/controller_rest');
var controller_wf = require('../controllers/controller_wf');

/* GET home page. */
router.get('/', controller.home);

//Controller Fesmo
router.post('/', upload.any(), controller_fesmo.fesmo);
router.post('/fesmo', upload2.any(), controller_fesmo.fesmo2);
router.get('/readMongo', controller_fesmo.readMongo);
router.get('/readFiles', controller_fesmo.readFiles);
router.get('/deployments', controller_fesmo.deploymentsReadMongo);
router.post('/:nameDep/readFileDevices', controller_fesmo.readFileDevofDep);
router.post('/:nameDep/readMongoDevices', controller_fesmo.readMongoDevofDep);


//Controller Mongo y Rest
router.get('/deploymentsRest', controller_rest.deployments);
router.post('/:nameDep/devices', controller_rest.DevOfDep);
router.post('/:nameDep/:tDev/observations', controller_rest.ObsOfDev);

//Controller Water Fall
router.get('/deploymentsWF', controller_wf.deploymentsWF);

module.exports = router;
