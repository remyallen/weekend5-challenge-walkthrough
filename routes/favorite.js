var express = require('express');
var router = express.Router();
var pg = require('pg');
var connect = require('../modules/connection');

router.get('/', function(req, res) {
    var results = [];

    pg.connect(connect, function(err, client, done) {
        var query = client.query('SELECT * FROM favorites');

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // close connection
        query.on('end', function() {
            done();
            return res.json(results);
        });

        if(err) {
            console.log(err);
        }
    });
});

router.post('/', function(req, res) {
    console.log('Request Body: ', req.body);

    pg.connect(connect, function(err, client, done) {
        client.query(
            'INSERT INTO favorites ' +
            '(petfinder_id, pet_name, pet_image_URL, pet_description) ' +
            'VALUES ($1, $2, $3, $4)',
            [req.body.petfinderID, req.body.petName, req.body.petImageURL, req.body.description],
            function(err, result) {
                done();
                if(err) {
                    res.send(result);
                } else {
                    res.send(result);
                }
            }
        )
    });
});


module.exports = router;