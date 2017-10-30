var walletCollection = 'wallets'
var walletObj = {
    getAll:
    function(page,perpage,callback){
        mongo.collection(walletCollection).find({}).limit(perpage).skip(page*perpage).toArray(function(err,result){
            if(err){
                callback({err:500})
            }else{
                mongo.collection(walletCollection).count({}, function(err, count) {
                    callback({data:result,totalElements:count})
                })
            }
        })
    },
    getDNI:
    function(oid,callback){
        mongo.collection(walletCollection).find({usuario_dni:oid},{}).toArray(function(err,result){
            if(err){
                callback({err:500})
            }else{
                callback({data:result})
            }
        })
    },
    getOID:
    function(oid,callback){
        var o_id = ObjectId(oid)
        mongo.collection(walletCollection).find({_id:o_id},{}).toArray(function(err,result){
            if(err){
                callback({err:500})
            }else if(result.length<1){
                callback({err:404})
            }else{
                callback({data:result})
            }
        })
    },
    postWallet:
    function(wallet, callback){
        if(wallet.titulo && (wallet.descripcion || wallet.descripcion == '') && 
            (wallet.saldo || wallet.saldo==0) && wallet.moneda_symbol && wallet.usuario_dni){
            var newValues = {titulo: wallet.titulo,
                descripcion: wallet.descripcion,
                saldo: wallet.saldo,
                moneda_symbol: wallet.moneda_symbol,
                usuario_dni: wallet.usuario_dni}
            mongo.collection(walletCollection).insert(newValues,
                function(err, result) {
                if(err){
                    callback({err:500})
                }else{
                    callback({data:result.ops[0]})
                }
            })
        }else{
            callback({err:400})
        }
    },
    putWallet:
    function(wallet, callback){
        if(wallet.titulo && (wallet.descripcion || wallet.descripcion == '') && 
            (wallet.saldo || wallet.saldo==0) && wallet.moneda_symbol && wallet.usuario_dni){
            walletObj.updateWallet(wallet,function(result){
                callback(result)
            })
        }else{
            callback({err:400})
        }
    },
    patchWallet:
    function(wallet, callback){
        if(wallet._id){
            walletObj.updateWallet(wallet,function(result){
                callback(result)
            })
        }else{
            callback({err:400})
        }
    },
    deleteWallet:
    function(oid, callback){
        var o_id = ObjectId(oid)
        mongo.collection(walletCollection).deleteOne({_id:o_id},function(err,result){
            if(err){
                callback({err:500})
            }else if(result.result.n==0){
                callback({err:404})
            }else{
                callback({data:{status:'OK'}})
            }
        })
    },
    updateWallet: //FUNCION AUXILIAR, NO USAR SUELTA, SE DEBEN HACER LAS COMPROBACIONES PERTINENTES EN DATOS
    function(wallet, callback){
        var query = {_id: ObjectId(wallet._id)}
        var secureWallet = {}
        if(wallet.titulo)
            secureWallet.titulo = wallet.titulo
        if(wallet.descripcion || wallet.descripcion == '')
            secureWallet.descripcion = wallet.descripcion
        if(wallet.moneda_symbol)
            secureWallet.moneda_symbol = wallet.moneda_symbol
        if(wallet.saldo || wallet.saldo == 0)
            secureWallet.saldo = wallet.saldo
        if(wallet.usuario_dni)
            secureWallet.usuario_dni = wallet.usuario_dni
        var newValues = {$set:secureWallet}
        mongo.collection(walletCollection).updateOne(query,newValues,
            function(err, result) {
            if(err){
                callback({err:500})
            }else if(result.result.n==0){
                callback({err:404})
            }else{
                secureWallet._id = wallet._id
                callback({data:secureWallet})
            }
        })
    }
}
module.exports = walletObj