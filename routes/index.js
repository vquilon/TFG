var express = require('express');
var router = express.Router();
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'files/')
    },
    filename: function (req, file, cb) {
        cb(null, "file" + number + ".json");
  }
});
var upload = multer({ storage: storage });


var controller = require('../controllers/controller');


router.post('/', upload.any(), controller.homeP);

router.get('/comprobacion', controller.readMongo);
router.get('/comprobacionArchivo/:id', controller.readFiles);

/* GET home page. */
router.get('/', controller.home);

router.get('/deployments', controller.deployments);

router.get('/:nameDep/devices', controller.DevOfDep);

router.get('/deploymentsWF', controller.deploymentsWF);

////////////////////////////


module.exports = router;
