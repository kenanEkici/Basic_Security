var model = require('./../schemas');
var hash = require('./../encryption');
var User = model.user;

module.exports = 
{

createUser: function(usr, hash, symm, public, private)
{
	var hashed = hash.hashCode();
	var user = new User({
	username: usr,
	password: hashed,
	symmetricKeys: symm,
	publicKey: public,
	privateKey: private
	});

	console.log('User created with name ' + user.username);
	user.save();
},

getAllUsers: function(callback)
{
	User.find({},function(err,users)
	{
		if (err) throw err
		return callback(users);
	});	 
},

getUserByUserName: function(usr,callback)
{
	User.where('username', usr).findOne(function(err,user)
	{						
		return callback(user);			
	});	
},

updateUserByUserName: function(usr, newUsr, newHash)
{
	User.findOneAndUpdate({username : usr}, {username: newUsr}, {password : newHash}, function(err,user){
		if (err) throw err;

		if (user) console.log(user);
	});
},

deleteUserByUserName: function(usr)
{
	User.findOneAndRemove({username: usr}, function(err)
	{
		if(err) throw err;

		if (usr) console.log('User deleted');
	});
},

pushSymmetricKeyToUser : function(usern, newkey, callback)
{
	User.findOneAndUpdate({ username: usern }, { $push: { symmetricKeys : newkey }}, callback);
},

emptySymmetricKeys : function(usern,callback)
{
	User.update({username:usern}, { $set: { symmetricKeys: [] }}, callback);
},

setPublicAndPrivateKey: function(usr, public, private, callback)
{
	User.findOneAndUpdate({username : usr}, {publicKey: public, privateKey: private}, function(err,user){
		if (err) throw err;

		return callback(user);
	});
}, 

emptyPublicAndPrivateKey: function(usr, callback)
{
	User.update({username:usr}, {$set: {publicKey : "", privateKey : ""}}, callback);
}


};


