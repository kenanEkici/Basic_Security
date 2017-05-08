var socket = io('https://basicsecurity.herokuapp.com',{secure: true});
var file;
var fileSelected = false;
// var socket = io('http://localhost:5000');
var i;
var user;
var unencryptedBinary;
var encryptedBinary;

$("html").mouseover(function()
{
    document.title = "Chat Enigma"
});

$("body").ready(function()
{
    user = $("#loggedInUsername").text();
    i = $('#messagesList').children().length;

    socket.on('response'+user, function(msg)
    {
        document.title = 'new message from '+msg.sender;
        receivedMessage(msg);
    });

    $("#fileLoad").change(function() {
        var reader = new FileReader();
        reader.onload = function() {
            var arrayBuffer = this.result;
            unencryptedBinary = new Uint8Array(arrayBuffer);
            fileSelected = true;
        };
        reader.readAsArrayBuffer(this.files[0]);
    });
});

function receivedMessage(message)
{
    var sender = message.sender;
    var part1 = message.part1;
    var part2 = message.part2;
    var part3 = message.part3;
    var part4 = JSON.stringify(message.rawData);
    var idMessage = message._id;

    $('#messagesList').append($("<li> <span id="+i+"s>"+sender+"</span> <div id='content'><p id="+i+"f1>"+part1+"</p> <p id="+i+"f2>"+part2+"</p>"
    + "<p id="+i+"f3>"+part3+"</p> <input id="+i+"f4 value="+part4+"><input type='submit' name='toBeDeleted' value="+idMessage+">"
        + "<input type='button' id="+i+" value='decrypt' onclick='decryptContent(this.id)'>"
    + "<p class='verified' id="+i+"v></p> <p class='notverified' id="+i+"nv></p></div>"));
    i++;
}

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
            var firstProcedure;
            if (fileSelected)
            {
                firstProcedure = encryptWithAes(document.getElementById('text').value, keyToBeUsed);
                encryptedBinary = encryptFileWithAes(unencryptedBinary, keyToBeUsed);
            }
            else {
                encryptedBinary = {};
                firstProcedure = encryptWithAes(document.getElementById('text').value, keyToBeUsed);
            }

            document.getElementById('file_1').value = firstProcedure;

            var secondProcedure =  encryptWithRsa(receiverPublicKey, keyToBeUsed);
            document.getElementById('file_2').value = secondProcedure;

            var thirdProcedure = encryptWithRsaPrivate(privateKeyOfUserLoggedIn, document.getElementById('text').value.hashCode());
            document.getElementById('file_3').value = thirdProcedure;

            alert("message encrypted");

            var username = $("#loggedInUsername").text();

            socket.emit('message'+receiver, {f1: firstProcedure, f2:secondProcedure, f3:thirdProcedure, rawData: encryptedBinary, sender: username, receiver: receiver});
      }
    }

    function decryptContent(id)
    {
    	var f1 = document.getElementById(id+'f1').innerHTML;
    	var f2 = document.getElementById(id+'f2').innerHTML;
    	var f3 = document.getElementById(id+'f3').innerHTML;
        var f4 = document.getElementById(id+'f4').value;
        f4 = JSON.parse(f4);


    	var publicKeyOfSender = document.getElementById('receiver').options[document.getElementById('receiver').selectedIndex].value;
    	var privateKeyOfReceiver = document.getElementById('loggedInUserPrivate').value;


    	var keyRetrieved = decryptWithRsa(privateKeyOfReceiver, f2);
        var originalMessage = decryptWithAes(f1, keyRetrieved);

        if(f4.data.length > 0)
        {
            var originalFile = decryptFileWithAes(f4.data, keyRetrieved);

            var parsed = originalFile;
            var arr2 = [];
            for(var x in parsed){
                arr2.push(parsed[x]);
            }

            var arr = originalFile;
            var byteArray = new Uint8Array(arr);
            var a = window.document.createElement('a');

            a.href = window.URL.createObjectURL(new Blob([byteArray], { type: 'application/octet-stream' }));
            a.download = "decryptedFile";

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }

      if (originalMessage.hashCode() == decryptWithRsaPublic(publicKeyOfSender,f3)) // --> debug
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







