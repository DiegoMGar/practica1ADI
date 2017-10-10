var walletCollection = 'wallets'
var walletObj = {
    getAll:
    function(callback){
        mongo.collection(walletCollection).find({}).toArray(function(err,result){
            if(err){
                callback({err:500})
            }else{
                callback({data:result})
            }
        })
    },
    getDNI:
    function(oid,callback){
        mongo.collection(walletCollection).find({usuario_dni:oid},{}).toArray(function(err,result){
            if(err){
                callback({err:500})
            }else if(result.length<1){
                callback({err:404})
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
        //Wallet tiene: titulo, descripción, fechaCreada, saldo, moneda_symbol y usuario_dni
        if(wallet.titulo && (wallet.descripcion || wallet.descripcion == '') && 
            wallet.saldo && wallet.moneda_symbol && wallet.usuario_dni){
            mongo.collection(walletCollection).insert({titulo: wallet.titulo,
            descripcion: wallet.descripcion,
            saldo: wallet.saldo,
            moneda_symbol: wallet.moneda_symbol,
            usuario_dni: wallet.usuario_dni},
                function(err, result) {
                if(err){
                    callback({err:500})
                }else{
                    wallet._id=result.insertedIds[0]
                    callback({data:wallet})
                }
            })
        }else{
            callback({err:400})
        }
    },
    putWallet:
    function(wallet, callback){
        //Wallet tiene: titulo, descripción, fechaCreada, saldo, moneda_symbol y usuario_dni
        if(wallet.titulo && (wallet.descripcion || wallet.descripcion == '') && 
            wallet.saldo && wallet.moneda_symbol && wallet.usuario_dni){
            walletObj.getOID(wallet._id,function(data){
                if(data.err || data.length<1 || data.data.length<1){callback({err:((data.err)? data.err : 404)}); return}
                walletObj.updateWallet(wallet,function(result){
                    callback(result)
                })
            })
            
        }else{
            callback({err:400})
        }
    },
    patchWallet:
    function(wallet, callback){
        //Wallet tiene: titulo, descripción, fechaCreada, saldo, moneda_symbol y usuario_dni
        if(wallet._id){
            walletObj.getOID(wallet._id,function(data){
                if(data.err || data.length<1 || data.data.length<1){callback({err:((data.err)? data.err : 404)}); return}
                if(wallet.titulo) data.data[0]['titulo']=wallet.titulo
                if(wallet.descripcion) data.data[0]['descripcion']=wallet.descripcion
                if(wallet.moneda_symbol) data.data[0]['moneda_symbol']=wallet.moneda_symbol
                if(wallet.saldo) data.data[0]['saldo']=wallet.saldo
                if(wallet.usuario_dni) data.data[0]['usuario_dni']=wallet.usuario_dni
                walletObj.updateWallet(data.data[0],function(result){
                    callback(result)
                })
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
                console.log('deleteWallet: '+result)
                callback({data:{status:'OK'}})
            }
        })
    },
    updateWallet: //FUNCION AUXILIAR, NO USAR SUELTA, SE DEBEN HACER LAS COMPROBACIONES PERTINENTES EN DATOS
    function(wallet, callback){
        var o_id = ObjectId(wallet._id)
        var query = { _id: o_id }
        var newValues = {titulo: wallet.titulo,
            descripcion: wallet.descripcion,
            saldo: wallet.saldo,
            moneda_symbol: wallet.moneda_symbol,
            usuario_dni: wallet.usuario_dni}
        mongo.collection(walletCollection).updateOne(query,newValues,
            function(err, result) {
            if(err){
                callback({err:500})
            }else if(result.n==0){
                callback({err:404})
            }else{
                console.log('putWallet: '+result)
                callback({data:wallet})
            }
        })
    }
}
module.exports = walletObj