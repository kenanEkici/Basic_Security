//packages
var express = require('express');
var app = express();
var router = express.Router()
var path = require('path');
var NodeRSA = require('node-rsa');

//NAMESPACES
var repo = require('./../repos');
var model = require('./../schemas');
var encryption = require('./../encryption');
app.set('views', path.join(__dirname, 'views'));


//app settings

//globals
var allClients;
var publicKeys = new Array();
var usernames = new Array();


repo.user.getAllUsers(function(users)
{
	allClients = users;
	for(var i = 0; i < allClients.length; i++)
	{
		usernames.push(allClients[i].username);
        publicKeys.push(allClients[i].publicKey);	
	}
	//everytime someone registers, this should be refreshed
});



// var keyBob = new NodeRSA({b: 512}); 
// var publicBob = keyBob.exportKey('public');
// var privateBob = keyBob.exportKey('private');

// var keyAlice = new NodeRSA({b: 512}); 
// var publicAlice = keyAlice.exportKey('public');
// var privateAlice = keyAlice.exportKey('private');

// var key = new NodeRSA();
// key.importKey(publicAlice,'public');
// key.importKey(privateBob, 'private');

// var message = "hi alice";
// var encrypted = key.encrypt(message);

// var key2 = new NodeRSA();
// key2.importKey(privateAlice,'private');



// repo.user.setPublicAndPrivateKey('Bob', publicBob, privateBob, function(c)
// {
// 	console.log('done');
// })

// repo.user.pushSymmetricKeyToUser('Bob', 'Alice,secretKey', function(key)
// {
// 	console.log('done');
// })

// repo.user.emptySymmetricKeys('Alice', function(done)
// {
// 	console.log('done');
// })




//_____________________________________________________


//users requests the index 
router.get('/', function(req,res)
{
	res.render('welcomeScreen.pug');
	console.log("Request from:  " + req.ip + " : " + req.method );
});

//User wants to reach the login screen
router.post('/', function(req,res)
{
	res.redirect('/login');
});


//client specific

router.get('/login', function(req,res)
{
	if (req.cookies['enigmacode'] == "" || req.cookies['enigmacode'] == null )
	{
		res.render('inlog.pug', {message : ""}
		);
	}
	else
	{
		res.redirect('chat');
	}
	
});

router.post('/login', function(req,res)
{
	
	repo.user.getUserByUserName(req.body.username, function(user)
	{		
		if (user != null)
		{
			if (req.body.hash.hashCode() == user.password) //successful login
			{		
					res.cookie('enigmacode', user.username , {httpOnly: true});
					res.writeHead(301,	{Location: '/chat'});					
					res.end();											
			}
			else
			{
				res.render('inlog.pug', {message : "invalid password or user"}
				);
			}
		}
		else
		{
			res.render('inlog.pug', {message : "invalid password or user"}
			);	
		}						
	});			
});

router.get('/chat', function(req,res) //click on send
{	
	var userTryingToLogin; 
	var andHisCookie = req.cookies['enigmacode'];
	var giveItAccess = false;

	for (i = 0; i < allClients.length; i++) 
	{     	
		if (andHisCookie == allClients[i].username)
    	{
    		userTryingToLogin = allClients[i];
    		giveItAccess = true;
    		break;
    	}
	}
	if (giveItAccess)
	{
		repo.message.synchAllMessages(userTryingToLogin, function(messages)
		{
			res.render('chatinterface.pug', {received : [userTryingToLogin,messages, allClients] })
		})		
	}
	else
	{
		res.send("You have to login first!");
	}		
});


router.post('/logout', function(req,res)
{
	res.cookie('enigmacode', "");
	res.redirect('/login');
});

router.post('/delete', function(req,res)
{
	repo.message.deleteMessage(req.body.toBeDeleted,function(pass)
	{
		res.redirect('/chat');
	});
	
});

module.exports = router;

