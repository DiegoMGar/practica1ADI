//Cargamos el módulo express
var express = require('express')
var bp = require('body-parser')
var MongoClient = require('mongodb').MongoClient
var modelUser = require('./models/modeluser')
var versionapi = require('./version')
var app = express()
app.use(bp.json())

var endpointServer = "http://localhost:3000"
var urlmongoprod = "mongodb://localhost:27017/prodadi1718"
mongo = null

app.get('/', function(req,resp) {
   resp.send('Versión más reciente de la API: '+versionapi) 
})
//CRUD USUARIO
var endpointCrudUsuario = '/'+versionapi+'/users'
app.get(endpointCrudUsuario,function(req,resp){
	try{
		modelUser.readAll(function(users){
			if(users.err){
				resp.status(users.err)
				resp.end()
			}else{
				resp.send(users.data)
			}
		})
	}catch(err){
		resp.status(500)
		resp.send(err.message)
	}	
})
app.get(endpointCrudUsuario+'/:uid',function(req,resp){
	uid = req.params.uid
	mongo.collection('users').findOne({dni:uid}, function(err,result){
		if(err){
			resp.status(500)
		}else{
			if(result)
				resp.send(result)
			else{
				resp.status(404)
				resp.end()
			}
		}
	})
})
app.post(endpointCrudUsuario,function(req,resp){
	//Usuario tiene: id,nombre,apellidos,dni,cuentabancaria,wallet,fecharegistro
	if(req.body.nombre && req.body.apellidos && req.body.dni){
		mongo.collection("users").insertOne({nombre:req.body.nombre,apellidos:req.body.apellidos,dni:req.body.dni},
			function(err, result) {
			if(err){
				resp.status(500)
				resp.end()
			}else{
				resp.send(result)
			}
		})
	}else{
		resp.status(400)
		resp.end()
	}
})
app.put(endpointCrudUsuario,function(req,resp){})
app.patch(endpointCrudUsuario,function(req,resp){})
app.delete(endpointCrudUsuario,function(req,resp){})

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