var crypto = require('crypto'),
    algorithm = 'aes-256-ctr';    


module.exports =
{

encryptWithAes: function(text, key){
    
  var cipher = crypto.createCipher(algorithm,key);
  var crypted = cipher.update(text,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
},

decryptWithAes: function(text, key){
  var decipher = crypto.createDecipher(algorithm, key);
  var dec = decipher.update(text,'hex','utf8');
  dec += decipher.final('utf8');
  return dec;
},
decryptFileWithAes: function(buffer, key){
    var decipher = crypto.createDecipher(algorithm, key);
    var dec = Buffer.concat([decipher.update(buffer) , decipher.final()]);
    return dec;
},
encryptFileWithAes:function(buffer, key){
    var cipher = crypto.createCipher(algorithm,key);
    var crypted = Buffer.concat([cipher.update(buffer),cipher.final()]);
    return crypted;
}

};