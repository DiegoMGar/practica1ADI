if(!app)
    throw new Error("Express no existe en este contexto. RuntimeException.")

	
//CRUD WALLET
//Wallet tiene: titulo, descripción, fechaCreada, saldo, moneda_symbol y usuario_oid
var endpointCrudWallet = '/'+versionapi+'/wallets'
app.get(endpointCrudWallet,function(req,resp){
	resp.setHeader('Access-Control-Allow-Origin','*')
	var responseObj = {count:0,page:0,perpage:0,data:null}
	try{
		if(req.query.page && !isNaN(req.query.page)) responseObj.page = req.query.page
		else responseObj.page = 0
		responseObj.perpage = 10
		modelWallet.getAll(responseObj.page,responseObj.perpage,function(wallets){
			if(wallets.err){
				resp.status(wallets.err)
				resp.end()
			}else{
				responseObj.data = wallets.data
				responseObj.totalElements = wallets.totalElements
				responseObj.totalPages = Math.floor(wallets.totalElements/responseObj.perpage)+1
				if(responseObj.totalPages-1 > responseObj.page)
					responseObj.nextPage = endpointServer+'/'+versionapi+'/wallets/?page='+(parseInt(responseObj.page)+1)
				if(responseObj.page > 0)
					responseObj.previousPage = endpointServer+'/'+versionapi+'/wallets/?page='+(parseInt(responseObj.page)-1)
				responseObj.count = wallets.data.length
				responseObj.links = {}
				responseObj.links.getUsers = {endpoint:endpointServer+'/'+versionapi+'/users',method:'GET'}				
				resp.send(responseObj)
			}
		})
	}catch(err){
		resp.status(500)
		resp.send({error:err.message})
	}	
})
app.get(endpointCrudWallet+'/:dni',function(req,resp){
	resp.setHeader('Access-Control-Allow-Origin','*')
	var responseObj = {}
	try{
		dni = req.params.dni
		modelWallet.getDNI(dni,function(wallets){
			if(wallets.err){
				resp.status(wallets.err)
				resp.end()
			}else{
				responseObj.data = wallets.data
				responseObj.count = wallets.data.length
				responseObj.links = {}
				responseObj.links.getUsers = {endpoint:endpointServer+'/'+versionapi+'/users',method:'GET'}
				responseObj.links.getUser = {endpoint:endpointServer+'/'+versionapi+'/users/'+dni,method:'GET'}		
				responseObj.links.getWallets = {endpoint:endpointServer+'/'+versionapi+'/wallets',method:'GET'}
				resp.send(responseObj)
			}
		})
	}catch(err){
		resp.status(500)
		resp.send({error:err.message})
	}
})
app.post(endpointCrudWallet,function(req,resp){
	resp.setHeader('Access-Control-Allow-Origin','*')
	var responseObj = {}
	try{
		wallet = req.body
		modelWallet.postWallet(wallet,function(wallets){
			if(wallets.err){
				resp.status(wallets.err)
				resp.end()
			}else{
                resp.status(201)
				responseObj.data = wallets.data
				responseObj.count = wallets.data.length
				responseObj.links = {}
				responseObj.links.getUsers = {endpoint:endpointServer+'/'+versionapi+'/users',method:'GET'}				
				responseObj.links.getWallets = {endpoint:endpointServer+'/'+versionapi+'/wallets',method:'GET'}
				responseObj.links.getUserWallets = {endpoint:endpointServer+'/'+versionapi+'/wallets/'+wallet.usuario_oid,method:'GET'}
				resp.send(responseObj)
			}
		})
	}catch(err){
		resp.status(500)
		resp.send({error:err.message})
	}
})
app.put(endpointCrudWallet,function(req,resp){
	resp.setHeader('Access-Control-Allow-Origin','*')
	var responseObj = {}
	try{
		wallet = req.body
		modelWallet.putWallet(wallet,function(wallets){
			if(wallets.err){
				resp.status(wallets.err)
				resp.end()
			}else{
                resp.status(200)
				responseObj.data = wallets.data
				responseObj.count = wallets.data.length
				responseObj.links = {}
				responseObj.links.getUsers = {endpoint:endpointServer+'/'+versionapi+'/users',method:'GET'}				
				responseObj.links.getWallets = {endpoint:endpointServer+'/'+versionapi+'/wallets',method:'GET'}
				responseObj.links.getUserWallets = {endpoint:endpointServer+'/'+versionapi+'/wallets/'+wallet.usuario_oid,method:'GET'}
				resp.send(responseObj)
			}
		})
	}catch(err){
		resp.status(500)
		resp.send({error:err.message})
	}
})
app.patch(endpointCrudWallet,function(req,resp){
	resp.setHeader('Access-Control-Allow-Origin','*')
	var responseObj = {}
	try{
		wallet = req.body
		modelWallet.patchWallet(wallet,function(wallets){
			if(wallets.err){
				resp.status(wallets.err)
				resp.end()
			}else{
                resp.status(200)
				responseObj.data = wallets.data
				responseObj.count = wallets.data.length
				responseObj.links = {}
				responseObj.links.getUsers = {endpoint:endpointServer+'/'+versionapi+'/users',method:'GET'}				
				responseObj.links.getWallets = {endpoint:endpointServer+'/'+versionapi+'/wallets',method:'GET'}
				if(wallet.usuario_oid)
					responseObj.links.getUserWallets = {endpoint:endpointServer+'/'+versionapi+'/wallets/'+wallet.usuario_oid,method:'GET'}
				resp.send(responseObj)
			}
		})
	}catch(err){
		resp.status(500)
		resp.send({error:err.message})
	}
})
app.delete(endpointCrudWallet+'/:dni',function(req,resp){
	resp.setHeader('Access-Control-Allow-Origin','*')
	try{
		dni = req.params.dni
		modelWallet.deleteWallet(dni,function(wallets){
			if(wallets.err){
				resp.status(wallets.err)
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
app.options(endpointCrudWallet,function(req,resp){
	resp.setHeader('Access-Control-Allow-Origin','*')
	resp.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, PATCH, DELETE')
	resp.setHeader('Access-Control-Allow-Headers','Content-Type')
	resp.status(200)
	resp.end()
})