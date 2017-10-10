//variables locales
var express = require('express')
var bp = require('body-parser')
var MongoClient = require('mongodb').MongoClient
var urlmongoprod = ''
if(typeof urlmongotest == 'undefined')
	urlmongoprod = 'mongodb://localhost:27017/prodadi1718'
else
	urlmongoprod = urlmongotest

//variables globales
ObjectId = require('mongodb').ObjectID;
modelUser = require('./models/modeluser')
modelWallet = require('./models/modelwallet')
versionapi = require('./version')
app = express()
app.use(bp.json())
endpointServer = 'http://localhost:3000'
mongo = null

//FUNCIONAMIENTO DE LA API
app.get('/', function(req,resp) {
   resp.send('Versión más reciente de la API: '+versionapi) 
})

//API: USUARIO
require('./api/apiuser')

//API: WALLETS
require('./api/apiwallet')

//INICIANDO EL SERVICIO WEB EN EL PUERTO 3000
MongoClient.connect(urlmongoprod, function(err, db) {
	if (err) throw err;
	mongo = db
	if(typeof urlmongotest != 'undefined'){
		mongo.collection("users").drop(function(err, delOK) {
			mongo.collection("wallets").drop(function(err, delOK) {
				launchServer()
			});
		});
	}else
		launchServer()
})
function launchServer() {
	app.listen(3000, function () {
		console.log('El servidor express está en el puerto 3000')
	})
}

//EXPORTO APP PARA PODER USARLA EN TEST CON MOCHA
module.exports = app