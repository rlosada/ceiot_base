var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.put('/empezar', function(req, res, next) {
    res.send({turno : 'Juan'})
});

module.exports = router;
