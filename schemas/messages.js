var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var messagesSchema = new Schema(
{
	id: Number,
	part1: {type: String},
	part2: {type: String},
	part3: {type: String},
	rawData: {type: Buffer, default: ""},
	receiver: {type: String},
	sender: {type: String}
});

var Message = mongoose.model('Message', messagesSchema);

module.exports = Message;
