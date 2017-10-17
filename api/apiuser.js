if(!app)
    throw new Error('Express no existe en este contexto. RuntimeException.')

//CRUD USUARIO
var endpointCrudUsuario = '/'+versionapi+'/users'
app.get(endpointCrudUsuario,function(req,resp){
	try{
		modelUser.getAll(function(users){
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
				resp.status(201)
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
				resp.status(204)
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
				resp.status(200)
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
				resp.status(204)
				resp.send(users.data)
			}
		})
	}catch(err){
		resp.status(500)
		resp.send(err.message)
	}
})