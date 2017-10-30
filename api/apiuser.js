if(!app)
    throw new Error('Express no existe en este contexto. RuntimeException.')

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
	var responseObj = {count:0,page:0,perpage:0,data:null}
	try{
		if(req.query.page && !isNaN(req.query.page)) responseObj.page = req.query.page
		else responseObj.page = 0
		responseObj.perpage = 10
		modelUser.getAll(responseObj.page,responseObj.perpage,function(users){
			if(users.err){
				resp.status(users.err)
				resp.end()
			}else{
				responseObj.data = users.data
				responseObj.totalElements = users.totalElements
				responseObj.totalPages = Math.floor(users.totalElements/responseObj.perpage)+1
				if(responseObj.totalPages-1 > responseObj.page)
					responseObj.nextPage = endpointServer+'/'+versionapi+'/users/?page='+(parseInt(responseObj.page)+1)
				if(responseObj.page > 0)
					responseObj.previousPage = endpointServer+'/'+versionapi+'/users/?page='+(parseInt(responseObj.page)-1)
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
	var responseObj = {}
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
	var responseObj = {}
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
	var responseObj = {}
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
	var responseObj = {}
	var override500 = false
	try{
		usuario = req.body
		token = req.body.token
		password = req.body.password
		try{
			login = jwt.decode(token,password) //throws exception on bad jwt decode
		}catch(errToken){
			override500=403
			throw errToken
		}
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
		var status = (override500 ? override500 : 500)
		resp.status(status)
		resp.send({error:err.message})
	}
})
app.patch(endpointCrudUsuario,function(req,resp){
	var responseObj = {}
	var override500 = false
	try{
		usuario = req.body
		token = req.body.token
		password = req.body.password
		try{
			login = jwt.decode(token,password) //throws exception on bad jwt decode
		}catch(err){
			override500=403
			throw err
		}
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
		var status = (override500 ? override500 : 500)
		resp.status(status)
		resp.send({error:err.message})
	}
})
app.delete(endpointCrudUsuario+'/:dni',function(req,resp){
	var override500 = false
	try{
		dni = req.params.dni
		token = req.body.token
		password = req.body.password
		try{
			login = jwt.decode(token,password) //throws exception on bad jwt decode
		}catch(err){
			override500=403
			throw err
		}
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
		var status = (override500 ? override500 : 500)
		resp.status(status)
		resp.send({error:err.message})
	}
})