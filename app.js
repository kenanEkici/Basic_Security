var express = require('express')
var app = express();

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var router = require('./router/router');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('view engine', 'jade');

app.use('/', router)

app.listen(80, function () {
  console.log('Enigma is listening')
})


// var https = require('https');
// var http = require('http');
// var fs = require('fs');

// var options = {
//   key: fs.readFileSync('./key.pem'),
//   cert: fs.readFileSync('./cert.pem'),
//   passphrase: 'basic'
// };

// http.createServer(app).listen(80);
// https.createServer(options, app).listen(443);