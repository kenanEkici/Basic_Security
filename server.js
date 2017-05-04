var express = require('express');
var app = express();
var http = require("http").createServer(app);
var io = require( "socket.io" )(http);

var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var router = require('./router/router');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('view engine', 'pug');

app.use('/public',express.static(path.join(__dirname,'public')))
app.use('/', router);

io.on('connection', function(socket){
    console.log("User Connected");
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
        console.log("Message");
    });
    socket.on('disconnect', function(msg){
        console.log("User DisConnected");
    });
});

app.set('port', (process.env.PORT || 5000));

http.listen(app.get('port'),function()
{
    console.log("kek");
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