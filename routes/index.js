var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');

var number = 1;
number = fs.readdirSync('files/') + 1;
console.log("Numero de ficheros "+number);
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'files/')
    },
    filename: function (req, file, cb) {
        cb(null, "devDep" + number + ".json");
  }
});
var upload = multer({ storage: storage });


var controller = require('../controllers/controller');//Separar en dos controller:
//Uno que recibe los datos del fesmo
//Otro que con esos datos los carga y obtiene con el REST las observaciones limitadas en tiempo max y min

router.post('/', upload.any(), controller.homeP);

router.get('/comprobacion', controller.readMongo);
router.get('/comprobacionArchivo/:id', controller.readFiles);

/* GET home page. */
router.get('/', controller.home);

router.get('/deployments', controller.deployments);

router.get('/:nameDep/devices', controller.DevOfDep);

router.get('/:nameDep/:nDev/observations', controller.ObsOfDev);


router.get('/deploymentsWF', controller.deploymentsWF);

////////////////////////////


module.exports = router;
