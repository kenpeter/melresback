const jwt = require('jsonwebtoken');
const router = require('express').Router();
const app = require('../../melresback');

router.get('/', (req, res) => {
  res.json("boring api page");
});

//
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.post('/auth', (req, res) => {
  if(req.body.username === 'kenpeter') {
    let token = jwt.sign({ kenpeter: 'kenpeter' }, app.get('superSecret'), {
      expiresIn : 60*60*24 // 24 hours
    });

    // send token out.
    res.json({
      success: true,
      message: 'Your token',
      token: token
    });
    return;
  } else {
    res.json({
      success: false,
      message: 'Please provide username',
      token: ''
    });
  }
}); // end post


router.use((req, res, next) => {
  // Look it wants to have a token in url.
  var token = req.query.token;

  // NOTE, it seems there is a preflight test here. First time, token is null
  // next time token is here.
  // if we have token
  if (token) {
    // jwt verify
    // token, with app.get.var
    // callback
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      // err
      if (err) {
        // res
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        // save it and use for next route
        req.decoded = decoded;
        // move to next route
        next();
      }
    });
  } else {
    // so I cannot send 403 or other error here.
    // as this will block react to connect.
    // so 200 is kind of miss leading here.
    return res.status(200).send({
      success: false,
      message: 'No token provided.'
    });
  }

});

router.get('/defaultUser', (req, res) => {

});

module.exports = router;