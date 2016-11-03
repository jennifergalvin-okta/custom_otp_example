var radius = require('radius');
var dgram = require("dgram");

var secret = 'PeterPiperPickedAPeckOfPickledPeppers';
var server = dgram.createSocket("udp4");

server.on("message", function (msg, rinfo) {
  var code, username, password, packet;
  packet = radius.decode({packet: msg, secret: secret});

  console.log("packet.code = " + packet.code);

  if (packet.code != 'Access-Request') {
    console.log('unknown packet type: ', packet.code);
    return;
  }

  username = packet.attributes['User-Name'];
  password = packet.attributes['User-Password'];

  console.log('Access-Request for ' + username);

/*
  if (username == 'demouser@galvin.ninja' && password == 'beverly123') {
    code = 'Access-Accept';
  } else {
    code = 'Access-Reject';
  }

*/

  // Here we would input logic to check the username, pass and OTP, but for now let's output success if it's in our itemList

  itemList = ["Bulbasaur", "Ivysaur", "Venasaur", "Charmander", "Charmeleon", "Charizard", "Squirtle", "Wartortle", "Blastoise", 
  "Caterpie", "Metapod", "Butterfree", "Weedle", "Kakuna", "Beedrill", "Pidgey", "Pidgeotto", "Pidgeot", 
  "Nidoran", "Nidoqueen", "Nidoking", "Clefairy", "Clefable", "Vulpix", "Ninetales", "Jigglypuff", "Wigglytuff", "Zubat", 
  "Golbat", "Oddish", "Gloom", "Vileplume", "Paras", "Parasect", "Venonat", "Venomoth", "Diglett", "Dugtrio", "Meowth"];

  console.log("username = " + username);
  console.log("password = " + password);

  code = 'Access-Reject';
  for (i = 0; i < itemList.length; i++)
  {
    if (password.toLowerCase() == itemList[i].toLowerCase())
    { 
      code = 'Access-Accept'; 
      break;
    }
  }
  

  var response = radius.encode_response({
    packet: packet,
    code: code,
    secret: secret
  });

  console.log('Sending ' + code + ' for user ' + username);
  server.send(response, 0, response.length, rinfo.port, rinfo.address, function(err, bytes) {
    if (err) {
      console.log('Error sending response to ', rinfo);
    }
  });
});

server.on("listening", function () {
  var address = server.address();
  console.log("radius server listening " +
      address.address + ":" + address.port);
});

server.bind(1812);
