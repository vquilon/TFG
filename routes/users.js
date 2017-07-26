var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/*Poner rutas de la forma
router.get('/photos', photoController.list);

router.get('/photos/new', photoController.new);*/

module.exports = router;
