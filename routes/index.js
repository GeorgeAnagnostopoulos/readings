var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Reading = mongoose.model('Reading');

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

router.post('/api/readings', function(req, res, next) {

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

router.put('/api/readings/:reading', function(req, res) {

    req.reading.save(function(err, data) {

	if (err) return next(err);
	res.json(data);
    });
});
	   
router.get('/api/readings/:reading', function(req, res) {

    res.json(req.reading);
});

module.exports = router;
