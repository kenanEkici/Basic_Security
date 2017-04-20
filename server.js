var express = require('express')
var app = express();
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var router = require('./router/router');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('view engine', 'jade');

app.use('/public',express.static(path.join(__dirname,'public')))
app.use('/', router)

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});



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