if(!app)
    throw new Error("Express no existe en este contexto. RuntimeException.")

//CRUD USUARIO
var endpointCrudWallet = '/'+versionapi+'/wallets'
app.get(endpointCrudWallet,function(req,resp){
	try{
		modelWallet.getAll(function(wallets){
			if(wallets.err){
				resp.status(wallets.err)
				resp.end()
			}else{
				resp.send(wallets.data)
			}
		})
	}catch(err){
		resp.status(500)
		resp.send(err.message)
	}	
})
app.get(endpointCrudWallet+'/:dni',function(req,resp){
	try{
		dni = req.params.dni
		modelWallet.getDNI(dni,function(wallets){
			if(wallets.err){
				resp.status(wallets.err)
				resp.end()
			}else{
				resp.send(wallets.data)
			}
		})
	}catch(err){
		resp.status(500)
		resp.send(err.message)
	}
})
app.post(endpointCrudWallet,function(req,resp){
	//Usuario tiene: id,nombre,apellidos,dni,cuentabancaria,wallet,fecharegistro
	try{
		usuario = req.body
		modelWallet.postWallet(usuario,function(wallets){
			if(wallets.err){
				resp.status(wallets.err)
				resp.end()
			}else{
				resp.send(wallets.data)
			}
		})
	}catch(err){
		resp.status(500)
		resp.send(err.message)
	}
})
app.put(endpointCrudWallet,function(req,resp){
	//Usuario tiene: id,nombre,apellidos,dni,cuentabancaria,wallet,fecharegistro
	try{
		usuario = req.body
		modelWallet.putWallet(usuario,function(wallets){
			if(wallets.err){
				resp.status(wallets.err)
				resp.end()
			}else{
				resp.send(wallets.data)
			}
		})
	}catch(err){
		resp.status(500)
		resp.send(err.message)
	}
})
app.patch(endpointCrudWallet,function(req,resp){
	//Usuario tiene: id,nombre,apellidos,dni,cuentabancaria,wallet,fecharegistro
	try{
		usuario = req.body
		modelWallet.patchWallet(usuario,function(wallets){
			if(wallets.err){
				resp.status(wallets.err)
				resp.end()
			}else{
				resp.send(wallets.data)
			}
		})
	}catch(err){
		resp.status(500)
		resp.send(err.message)
	}
})
app.delete(endpointCrudWallet+'/:dni',function(req,resp){
	try{
		dni = req.params.dni
		modelWallet.deleteWallet(dni,function(wallets){
			if(wallets.err){
				resp.status(wallets.err)
				resp.end()
			}else{
				resp.send(wallets.data)
			}
		})
	}catch(err){
		resp.status(500)
		resp.send(err.message)
	}
})