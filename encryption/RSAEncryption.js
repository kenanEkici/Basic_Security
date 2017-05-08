var NodeRSA = require('node-rsa');

module.exports =
{

//give recipients publicKey and the text message
//returns a buffer
encryptWithRsa : function(publicKey, message)
{
    var key = new NodeRSA();
    key.importKey(publicKey,'public');
    return key.encrypt(message,'base64');
},

//give own private key and encrypted data
//return text
decryptWithRsa :  function(privateKey, message){
    var key = new NodeRSA();
    key.importKey(privateKey,'private');
    return key.decrypt(message,'utf-8');
},

encryptWithRsaPrivate :  function(privateKey, message)
{
    var key = new NodeRSA();
    key.importKey(privateKey,'private');
    return key.encryptPrivate(message,'base64');
},

decryptWithRsaPublic : function(publicKey, message)
{
    var key = new NodeRSA();
    key.importKey(publicKey, 'public');
    return key.decryptPublic(message,'utf-8');
}

}