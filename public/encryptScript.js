function encryptingProc()
    {      
    	var privateKeyOfUserLoggedIn = document.getElementById('loggedInUserPrivate').value;
        var receiver = document.getElementById('receiver').options[document.getElementById('receiver').selectedIndex].text;
        var receiverPublicKey = document.getElementById('receiver').options[document.getElementById('receiver').selectedIndex].value;
        document.getElementById('rec').value = receiver;    

    	var keyToBeUsed;
      var cont = false;

    	for(var i = 0; i < amountOfKeys; i++)
    	{
    		if (receiver == [symmetricKeysOfUser][i].split(',')[0])
    		{
    			keyToBeUsed = [symmetricKeysOfUser][i].split(',')[1];  
          cont = true;          			
    		}
    		else
    		{    			
    			alert("no symmetric key for this user");   	          	
    		}
    	}

      if (cont)
      {
        var firstProcedure = encryptWithAes(document.getElementById('text').value, keyToBeUsed);
        document.getElementById('file_1').value = firstProcedure;

        var secondProcedure =  encryptWithRsa(receiverPublicKey, keyToBeUsed);
        document.getElementById('file_2').value = secondProcedure;

        var thirdProcedure = encryptWithRsaPrivate(privateKeyOfUserLoggedIn, document.getElementById('text').value.hashCode());
        document.getElementById('file_3').value = thirdProcedure;

        alert("message encrypted"); 
      }
    }
    function decryptContent(id)
    {
    	var f1 = document.getElementById(id+'f1').innerHTML;
    	var f2 = document.getElementById(id+'f2').innerHTML;
    	var f3 = document.getElementById(id+'f3').innerHTML;
    	var publicKeyOfSender = document.getElementById('receiver').options[document.getElementById('receiver').selectedIndex].value; 
    	var privateKeyOfReceiver = document.getElementById('loggedInUserPrivate').value;

    	var keyRetrieved = decryptWithRsa(privateKeyOfReceiver, f2);
      var originalMessage = decryptWithAes(f1, keyRetrieved);

      if (originalMessage.hashCode() == decryptWithRsaPublic(publicKeyOfSender,f3))
      {
          document.getElementById(id+'v').innerHTML = "verified";
      }
      else 
      {
          document.getElementById(id+'nv').innerHTML = "not verified";
      }

      document.getElementById(id+'f1').innerHTML = originalMessage;
      document.getElementById(id+'f2').innerHTML = "";
      document.getElementById(id+'f3').innerHTML = "";
    } 
    function chooseFromFile()
    {
      var file = document.getElementById('file').files[0]
      if (file) {
      var reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function (evt) {        
        var str = evt.target.result
        document.getElementById("text").value = str;
         
      }
      reader.onerror = function (err)
      {
        alert(err);
      }
      }
    }