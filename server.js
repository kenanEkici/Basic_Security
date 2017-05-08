var express = require('express');
var app = express();
var http = require("http").createServer(app);
var io = require( "socket.io" )(http);
var path = require('path');
const fs = require('fs');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var router = require('./router/router');
var repo = require('./repos');

io.on('connection', function(socket){
    socket.on('messageBob', function(msg){
        repo.message.sendMessage(msg.f1,  msg.f2, msg.f3, msg.rawData, msg.receiver ,msg.sender, function(message)
        {
            console.log(msg.rawData);
            io.sockets.emit('responseBob', message);
        });
    });
    socket.on('messageAlice', function(msg){
        repo.message.sendMessage(msg.f1,  msg.f2, msg.f3, msg.rawData, msg.receiver ,msg.sender, function(message)
        {
            io.sockets.emit('responseAlice', message);
        });
    });
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('view engine', 'pug');

app.use('/public',express.static(path.join(__dirname,'public')))
app.use('/', router);

app.set('port', (process.env.PORT || 5000));

http.listen(app.get('port'),function()
{
    console.log("listening");
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