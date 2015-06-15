'use strict';

var port = process.env.PORT || 3000;

var express = require('express');
var app = express();

app.use(express.static('./build'));

var server = app.listen( port , function() {
  console.log('Server started on port ' + port );
});
