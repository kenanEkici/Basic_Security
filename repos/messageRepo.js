var model = require('./../schemas');
var encryption = require('./../encryption');
var Message = model.message;

module.exports = 
{

sendMessage: function(pt1, pt2, pt3, receiver, sender,callback)
{	
	var message = new Message({
		part1: pt1,
		part2: pt2,
		part3: pt3,
		receiver: receiver,
		sender: sender	
	});

	message.save()
	console.log('Message from ' + sender + ' to ' + receiver + ' has been send');
	return callback(message);
	
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
