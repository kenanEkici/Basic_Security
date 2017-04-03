var mongoose = require('mongoose');

mongoose.connect('mongodb://root:root@basicsecurity-shard-00-00-627yy.mongodb.net:27017,basicsecurity-shard-00-01-627yy.mongodb.net:27017,basicsecurity-shard-00-02-627yy.mongodb.net:27017/BasicSecurity?ssl=true&replicaSet=BasicSecurity-shard-0&authSource=admin');

var Schema = mongoose.Schema;

var userSchema = new Schema(
{
	id: Number,
	username: {type: String, unique: true},
	password: {type: String, required: true},
	symmetricKeys : {type: Array, default:[]}, 
	publicKey : {type: String},
	privateKey : {type: String}
});

userSchema.pre('save', function (next) {
  next();
});


var User = mongoose.model('User', userSchema);

module.exports = User;
