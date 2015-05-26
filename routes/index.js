var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');

var passport = require('passport');
var mongoose = require('mongoose');

var Reading = mongoose.model('Reading');
var User = mongoose.model('User');

var auth = jwt({secret:'SECRET', userProperty:'payload'});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/readings', function(req, res, next) {

    Reading.find(function(err, readings) {

	if (err) return next(err);
	
	res.json(readings);
    });
});

router.post('/api/readings', auth, function(req, res, next) {

    var reading = new Reading(req.body);

    reading.save(function(err, reading) {

	if (err) return next(err);
	res.json(reading);
    });
});

router.param('reading', function(req, res, next, id) {

    var query = Reading.findById(id);
    query.exec(function(err, r) {

	if (err) {

	    console.log(err);
	    return next(err);
	}
	if (!r) {

	    console.log('Nothing foudn');
	    return next(new Error('Nothing Found!'));
	}
	req.reading = r;
	return next();
    });
});

router.put('/api/readings/:reading', auth, function(req, res) {

    req.reading.save(function(err, data) {

	if (err) return next(err);
	res.json(data);
    });
});
	   
router.get('/api/readings/:reading', function(req, res) {

    res.json(req.reading);
});

router.post('/register', function(req, res, next) {

    if (!req.body.username || !req.body.password)
	return res.status(400).json({message:'Please fill out all fields'});

    var user = new User();
    user.username = req.body.username;
    user.setPassword(req.body.password);
    
    user.save(function(err) {

	if (err) return next(err);
	return res.json({token: user.generateJWT()});
    });
});

router.post('/login', function(req, res, next) {

    if (!req.body.username || !req.body.password)
	return res.status(400).json({message:'Please fill out all fields'});

    passport.authenticate('local', function(err, user, info) {

	if (err) return next(err);

	if (user)
	    return res.json({token: user.generateJWT()});
	else
	    return res.status(401).json(info);
    })(req, res,next);
});

module.exports = router;
