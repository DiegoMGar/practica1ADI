//Cargamos el módulo express
var express = require('express')
var bp = require('body-parser')
var MongoClient = require('mongodb').MongoClient
ObjectId = require('mongodb').ObjectID;
modelUser = require('./models/modeluser')
modelWallet = require('./models/modelwallet')
versionapi = require('./version')
app = express()
app.use(bp.json())

var endpointServer = "http://localhost:3000"
var urlmongoprod = "mongodb://localhost:27017/prodadi1718"
mongo = null

app.get('/', function(req,resp) {
   resp.send('Versión más reciente de la API: '+versionapi) 
})

//API de USUARIO
require('./api/apiuser')

MongoClient.connect(urlmongoprod, function(err, db) {
	if (err) throw err;
	mongo = db
	launchServer()
})
function launchServer() {
	app.listen(3000, function () {
		console.log("El servidor express está en el puerto 3000")
	})
}
module.exports = app