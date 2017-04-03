var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var messagesSchema = new Schema(
{
	id: Number,
	content: {type: String},
	sender: {type: String},
	receiver: {type: String},
	encryptedWith: {type: String}
});

var Message = mongoose.model('Message', messagesSchema);

module.exports = Message;
