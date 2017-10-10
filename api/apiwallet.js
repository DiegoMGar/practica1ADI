if(!app)
    throw new Error("Express no existe en este contexto. RuntimeException.")

//CRUD WALLET
//Wallet tiene: titulo, descripción, fechaCreada, saldo, moneda_symbol y usuario_oid
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
	try{
		wallet = req.body
		modelWallet.postWallet(wallet,function(wallets){
			if(wallets.err){
				resp.status(wallets.err)
				resp.end()
			}else{
                resp.status(201)
				resp.send(wallets.data)
			}
		})
	}catch(err){
		resp.status(500)
		resp.send(err.message)
	}
})
app.put(endpointCrudWallet,function(req,resp){
	try{
		wallet = req.body
		modelWallet.putWallet(wallet,function(wallets){
			if(wallets.err){
				resp.status(wallets.err)
				resp.end()
			}else{
                resp.status(204)
				resp.send(wallets.data)
			}
		})
	}catch(err){
		resp.status(500)
		resp.send(err.message)
	}
})
app.patch(endpointCrudWallet,function(req,resp){
	try{
		wallet = req.body
		modelWallet.patchWallet(wallet,function(wallets){
			if(wallets.err){
				resp.status(wallets.err)
				resp.end()
			}else{
                resp.status(204)
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
                resp.status(204)
				resp.send(wallets.data)
			}
		})
	}catch(err){
		resp.status(500)
		resp.send(err.message)
	}
})