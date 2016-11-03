// Dependencies
var http = require('http');
var https = require('https');
var fs = require('fs');
var express = require('express');
var app = express();

app.use(express.static(__dirname));

// Require the config file
var config = require('./okta_config.json');

// Route for / - default page
app.get('/', function (req, res) 
{
   res.sendFile( __dirname + "/" + "index.html" );
})

// Run the Server
if (config.listenOnHTTP != "true")
	{ console.log("Not configured to listen on http in config file."); }
else
{ 
	http.createServer(app).listen(config.httpPort); 
	console.log("Server listening on port " + config.httpPort);
}

// Set SSL options here
if (config.listenOnHTTPS != "true")
	{ console.log("Not configured to listen on https in config file."); }
else
{
	var serverOptions = {
  		key: fs.readFileSync(config.sslKey),
  		cert: fs.readFileSync(config.sslCert)
	};
	https.createServer(serverOptions, app).listen(config.httpsPort); 
	console.log("SSL Server listening on port " + config.httpsPort);
}


