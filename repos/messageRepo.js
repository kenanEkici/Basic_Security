var model = require('./../schemas');
var encryption = require('./../encryption');
var Message = model.message;

module.exports = 
{

sendMessage: function(ctt, sen, rec, ecrypt,callback)
{
	
	var message = new Message({
		content: ctt,
		sender: sen,
		receiver: rec,
		encryptedWith: ecrypt	
	});

	message.save()
	return callback();
	console.log('Message from ' + sen + ' to ' + rec + ' has been send');
},

synchAllMessages: function(rec, callback)
{
	Message.find({receiver: rec.username}, function(err,messages)
	{
		if (err) throw err
		return callback(messages);
	})
},

deleteMessage: function(idMessage, pass)
{
	Message.remove({_id: idMessage }, function(err,messages)
	{
		if (err) throw err

		// for (var i = 0; i< messages.length; i++) 
		// 	messages[i].remove();
		// })
		return pass();
	})
}

};
