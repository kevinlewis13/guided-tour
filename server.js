'use strict';

var mongoose = require('mongoose');
var express = require('express');

var app = express();

var toursRouter = express.Router();

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/tours_development');

app.use(express.static(__dirname + '/build'));

require('./backend/routes/tours_routes')(toursRouter);

app.use('/api', toursRouter);

app.listen(process.env.PORT || 3000, function() {
  console.log('server running on port ' + (process.env.PORT || 3000));
});
