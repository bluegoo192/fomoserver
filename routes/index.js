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

router.post('/api/createaccount', function(req, res, next) {
  res.send(database.createUser(req.body));
  //if success, send true
  //if failed, send error
});

router.post('/api/login', function(req, res, next) {
  database.findUserForLogin(req.body, function(user) {
    res.send(user);
  });
});

router.post('/api/createEvent', function(req, res, next) {
  database.createEvent(req.body, function(data) {
    res.send(data);
  });
});

router.post('/api/getEvents', function(req, res, next) {
  database.getEvents(req.body, req.body, function(data) {
    res.send(data);
  })
});
