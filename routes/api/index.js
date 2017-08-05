const jwt = require('jsonwebtoken');
const router = require('express').Router();
const app = require('../../melresback');
const Restaurant = require('../../models/Restaurant');
const RestaurantVote = require('../../models/RestaurantVote');
const objectAssign = require('object-assign');

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

// Guard
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

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZW5wZXRlciI6ImtlbnBldGVyIiwiaWF0IjoxNTAxNDY3NzAzLCJleHAiOjE1MDE1NTQxMDN9.j8L0s-LyFhOkfsS3h6TdCwQ_Tpv0hE9xc6XVBFLRqK0
router.get('/restaurants', (req, res) => {
  Restaurant
    .find({ })
    .exec(function (err, restaurants) {
      if (err) {
        console.log('-- get default restaurants error --');
        console.log(err);
        res.json({ error: true });
      } else {
        console.log('-- api get restaurants --');
        //console.log(user);
        res.json({ restaurants });
      }
    }); // end exec
});

//
router.get('/restaurant', (req, res) => {
  Restaurant.count().exec((err, count) => {
    // Get a random entry
    const random = Math.floor(Math.random() * count);

    // Again query all restaurants but only fetch one offset by our random #
    Restaurant.findOne().skip(random).exec(
      (err, restaurants) => {
        if (err) {
          console.log('-- get single restaurant error --');
          console.log(err);
          res.json({ error: true });
        } else {
          console.log('-- api get restaurant good --');
          RestaurantVote.findOne({ restaurant: restaurants._id }, (err, result) => {
            // Most stupid method, but it works only this way.
            const myRes = {
              _id: restaurants._id,
              resId: restaurants.resId,
              name: restaurants.name,
              url: restaurants.url,
              address: restaurants.address,
              averageCostForTwo: restaurants.averageCostForTwo,
              thumbUrl: restaurants.thumbUrl,
              photoUrl: restaurants.photoUrl,
              menuUrl: restaurants.menuUrl,
              __v: restaurants.__v,
              updatedAt: restaurants.updatedAt,
              createdAt: restaurants.createdAt,
              voteDownCount: result.voteDownCount,
              voteUpCount: result.voteUpCount
            }

            //console.log(myRes);
            res.json({ restaurants: myRes });
          });
        }
      });
  });
});


router.post('/voteUp', (req, res) => {
  const resId = req.body.resId;
  const countNum = parseInt(req.body.countNum);

  //console.log('-- test --');
  //console.log(resId + " | " + countNum);
  const query = { restaurant: resId };
  RestaurantVote.findOne(query, (err, result) => {
    const newCount = result.voteUpCount + countNum;
    //console.log('-- newCount --');
    //console.log(resId);
    //console.log(newCount);
    RestaurantVote.findOneAndUpdate(query, { voteUpCount: newCount }, {}, (err1, result1) => {
      if (err1) {
        //console.log('-- voteUp error --');
        //console.log(err);
        res.json({ error: true });
        return;
      } else {
        //console.log('-- voteUp good --');
        //console.log(user);
        res.json({ newCount });
        return;
      }
    });
  });
});

module.exports = router;
