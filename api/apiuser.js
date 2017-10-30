if(!app)
    throw new Error('Express no existe en este contexto. RuntimeException.')

var responseObj = {count:0,page:0,perpage:0,data:null}

/*
 * TODO: count -> cuando se le asigna un undefined no aparece, si count no existe no debería existir page ni perpage
 * TODO: count -> sólo debe existir en respuestas de listado, hay que revisar qué peticiones devuelven listas u objetos.
 * TODO: count, page y perpage -> hay que hacer paginación para los readAll
 * TODO: links -> nextPage y previousPage en la paginación
 */

//CRUD USUARIO
///Usuario tiene: id,nombre,apellidos,dni,password,cuentabancaria,wallet,fecharegistro
var endpointCrudUsuario = '/'+versionapi+'/users'
app.get(endpointCrudUsuario,function(req,resp){
	delete(responseObj)
	try{
		modelUser.getAll(function(users){
			if(users.err){
				resp.status(users.err)
				resp.end()
			}else{
				responseObj.data = users.data
				responseObj.count = users.data.length
				responseObj.links = {}
				responseObj.links.getWallets = {endpoint:endpointServer+'/'+versionapi+'/wallets',method:'GET'}
				resp.send(responseObj)
			}
		})
	}catch(err){
		resp.status(500)
		resp.send({error:err.message})
	}	
})
app.get(endpointCrudUsuario+'/:dni',function(req,resp){
	delete(responseObj)
	try{
		dni = req.params.dni
		modelUser.getDNI(dni,function(users){
			if(users.err){
				resp.status(users.err)
				resp.end()
			}else{
				responseObj.data = users.data
				responseObj.count = users.data.length
				responseObj.links = {}
				responseObj.links.getWallets = {endpoint:endpointServer+'/'+versionapi+'/wallets',method:'GET'}
				responseObj.links.getUserWallets = {endpoint:endpointServer+'/'+versionapi+'/wallets/'+dni,method:'GET'}
				resp.send(responseObj)
			}
		})
	}catch(err){
		resp.status(500)
		resp.send({error:err.message})
	}
})
app.post(endpointCrudUsuario,function(req,resp){
	delete(responseObj)
	try{
		usuario = req.body
		modelUser.postUser(usuario,function(users){
			if(users.err){
				resp.status(users.err)
				resp.end()
			}else{
				resp.status(201)
				responseObj.data = users.data
				responseObj.count = users.data.length
				responseObj.links = {}
				responseObj.links.getWallets = {endpoint:endpointServer+'/'+versionapi+'/wallets',method:'GET'}
				responseObj.links.getUserWallets = {endpoint:endpointServer+'/'+versionapi+'/wallets/'+usuario.dni,method:'GET'}
				resp.send(responseObj)
			}
		})
	}catch(err){
		resp.status(500)
		resp.send({error:err.message})
	}
})
app.post(endpointCrudUsuario+'/login',function(req,resp){
	delete(responseObj)
	try{
		login = req.body
		//login debe tener, al menos, dni y password
		modelUser.login(login,function(user){
			if(user.err){
				resp.status(user.err)
				resp.end()
			}else{
				responseObj.data = user.data
				responseObj.token = jwt.encode(user.data,login.password)
				responseObj.links = {}
				responseObj.links.getWallets = {endpoint:endpointServer+'/'+versionapi+'/wallets',method:'GET'}
				responseObj.links.getUserWallets = {endpoint:endpointServer+'/'+versionapi+'/wallets/'+login.dni,method:'GET'}
				resp.send(responseObj)
			}
		})
	}catch(err){
		resp.status(500)
		resp.send({error:err.message})
	}
})
app.put(endpointCrudUsuario,function(req,resp){
	delete(responseObj)
	try{
		usuario = req.body
		token = req.body.token
		password = req.body.password
		login = jwt.decode(token,password) //throws exception on bad jwt decode
		modelUser.putUser(usuario,login._id,password,function(users){
			if(users.err){
				resp.status(users.err)
				resp.end()
			}else{
				resp.status(200)
				responseObj.data = users.data
				responseObj.count = users.data.length
				responseObj.links = {}
				responseObj.links.getWallets = {endpoint:endpointServer+'/'+versionapi+'/wallets',method:'GET'}
				responseObj.links.getUserWallets = {endpoint:endpointServer+'/'+versionapi+'/wallets/'+usuario.dni,method:'GET'}
				resp.send(responseObj)
			}
		})
	}catch(err){
		resp.status(500)
		resp.send({error:err.message})
	}
})
app.patch(endpointCrudUsuario,function(req,resp){
	delete(responseObj)
	try{
		usuario = req.body
		token = req.body.token
		password = req.body.password
		login = jwt.decode(token,password) //throws exception on bad jwt decode
		modelUser.patchUser(usuario,login._id,password,function(users){
			if(users.err){
				resp.status(users.err)
				resp.end()
			}else{
				resp.status(200)
				responseObj.data = users.data
				responseObj.count = users.data.length
				responseObj.links = {}
				responseObj.links.getWallets = {endpoint:endpointServer+'/'+versionapi+'/wallets',method:'GET'}
				resp.send(responseObj)
			}
		})
	}catch(err){
		resp.status(500)
		resp.send({error:err.message})
	}
})
app.delete(endpointCrudUsuario+'/:dni',function(req,resp){
	delete(responseObj)
	try{
		dni = req.params.dni
		token = req.body.token
		password = req.body.password
		login = jwt.decode(token,password) //throws exception on bad jwt decode
		modelUser.deleteUser(dni,login._id,password,function(users){
			if(users.err){
				resp.status(users.err)
				resp.end()
			}else{
				resp.status(204)
				resp.end()
			}
		})
	}catch(err){
		resp.status(500)
		resp.send({error:err.message})
	}
})