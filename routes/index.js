var express = require('express');
var router = express.Router();
var database = require('../database/mongooseclient.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

router.post('/api/friends', function(req, res, next) {
  res.send('stub friends data\n');
});

router.post('/api/feed', function(req, res, next) {
  res.send('stub feed\n');
});

router.post('/api/nearby', function(req, res, next) {
  res.send('stub nearby eventslist\n');
});

router.post('/api/daddies/tojson', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.send(req.body);
});

router.post('/api/createaccount', async function(req, res, next) {
  var status = await database.createUser(req.body);
  res.send(status);
  //if success, send true
  //if failed, send error
});

router.post('/api/login', function(req, res, next) {
  database.findUserForLogin(req.body, function(user) {
    res.send(user);
  });
});

router.post('/api/createEvent', async function(req, res, next) {
  if (req.body.event && req.body.user) {
    res.send(await database.createEvent(req.body.event, req.body.user));
  } else {
    res.send(400);
  }
});

router.post('/api/getEvents', async function(req, res, next) {
  var status = await database.getEvents(req.body, req.body);
  res.send(status);
});
