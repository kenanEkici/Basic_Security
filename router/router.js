//packages//___________________________
var express = require('express');
var app = express();
var router = express.Router()
var path = require('path');

//NAMESPACES
var repo = require('./../repos');
var model = require('./../schemas');
var encryption = require('./../encryption');
app.set('views', path.join(__dirname, 'views'));

//app settings

//globals
var allClients;

repo.user.getAllUsers(function(users)
{
	allClients = users; 
	//everytime someone registers, this should be refreshed
});


//_____________________________________________________


//users requests the index 
router.get('/', function(req,res)
{
	res.render('welcomeScreen.jade'	);
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
		res.render('inlog.jade', {message : ""}
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
				res.render('inlog.jade', {message : "invalid password or user"}
				);
			}
		}
		else
		{
			res.render('inlog.jade', {message : "invalid password or user"}
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
			res.render('chatinterface.jade', {received : [allClients,userTryingToLogin,messages, encryption]})		
		})		
	}
	else
	{
		res.send("You have to login first!");
	}		
});

router.post('/send', function(req,res) //click on send
{	 
	repo.message.sendMessage(req.body.encryptedMessage, req.cookies['enigmacode'], req.body.selectedUser, req.body.selectedMethod, function()
	{
		res.redirect('/chat');
	});	
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

