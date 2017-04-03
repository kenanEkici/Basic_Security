var crypto = require('crypto'),
    algorithm = 'aes-256-ctr';    


module.exports =
{

encrypt: function(text, key){
    
  var cipher = crypto.createCipher(algorithm,key)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
},

decrypt: function(text, key){
  var decipher = crypto.createDecipher(algorithm, key)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

}