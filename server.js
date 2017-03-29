var express = require('express');
var app = express();
var mime = require('mime');

mime.define({
    'text/xml': ['mpd'],
});

app.use('/', express.static(__dirname));

app.listen(8080, function () {
  console.log('Example app listening on port 8080. http://localhost:8080');
})
