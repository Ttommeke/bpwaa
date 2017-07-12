var express = require('express');
var app = express();
var mime = require('mime');

var port = process.env.PORT || 5000;

mime.define({
    'text/xml': ['mpd'],
});

app.use('/', express.static(__dirname));

app.listen(port, function () {
  console.log('Example app listening on port ' + port + '. http://localhost:' + port);
})
