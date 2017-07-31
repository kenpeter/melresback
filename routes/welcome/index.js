var router = require('express').Router();

router.get('/', function(req, res){
  res.json('home page');
});

module.exports = router;
