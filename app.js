//Cargamos el módulo express
var express = require('express')
var bp = require('body-parser')
var MongoClient = require('mongodb').MongoClient
ObjectId = require('mongodb').ObjectID;
var modelUser = require('./models/modeluser')
var modelUserIco = require('./models/modeluserico')
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
app.get(endpointCrudUsuario+'/:dni',function(req,resp){
	try{
		dni = req.params.dni
		modelUser.getDNI(dni,function(users){
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
app.post(endpointCrudUsuario,function(req,resp){
	//Usuario tiene: id,nombre,apellidos,dni,cuentabancaria,wallet,fecharegistro
	try{
		usuario = req.body
		modelUser.postUser(usuario,function(users){
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
app.put(endpointCrudUsuario,function(req,resp){
	//Usuario tiene: id,nombre,apellidos,dni,cuentabancaria,wallet,fecharegistro
	try{
		usuario = req.body
		modelUser.putUser(usuario,function(users){
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
app.patch(endpointCrudUsuario,function(req,resp){
	//Usuario tiene: id,nombre,apellidos,dni,cuentabancaria,wallet,fecharegistro
	try{
		usuario = req.body
		modelUser.patchUser(usuario,function(users){
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
app.delete(endpointCrudUsuario+'/:dni',function(req,resp){
	try{
		dni = req.params.dni
		modelUser.deleteUser(dni,function(users){
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