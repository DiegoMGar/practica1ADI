var wallet = {
    getAll:
    function(callback){
        mongo.collection('wallet').find({}).toArray(function(err,result){
            if(err){
                callback({err:500})
            }else{
                callback({data:result})
            }
        })
    },
    getDNI:
    function(oid,callback){
        mongo.collection('wallet').find({dni:oid},{}).toArray(function(err,result){
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
        mongo.collection('wallet').find({_id:o_id},{}).toArray(function(err,result){
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
    function(usuario, callback){
        //Usuario tiene: nombre,apellidos,dni,cuentabancaria,wallet,fecharegistro
        if(usuario.nombre && usuario.apellidos && usuario.dni){
            mongo.collection('wallet').insert({nombre:usuario.nombre,apellidos:usuario.apellidos,dni:usuario.dni},
                function(err, result) {
                if(err){
                    callback({err:500})
                }else{
                    usuario._id=result.insertedIds[0]
                    callback({data:usuario})
                }
            })
        }else{
            callback({err:400})
        }
    },
    putWallet:
    function(usuario, callback){
        //Usuario tiene: nombre,apellidos,dni,cuentabancaria,wallet,fecharegistro
        if(usuario.nombre && usuario.apellidos && usuario.dni && usuario._id){
            var o_id = ObjectId(usuario._id)
            var query = { _id: o_id }
            var newValues = {nombre: usuario.nombre,apellidos: usuario.apellidos,dni: usuario.dni}
            mongo.collection('wallet').updateOne(query,newValues,
                function(err, result) {
                if(err){
                    callback({err:500})
                }else if(result.n==0){
                    callback({err:404})
                }else{
                    console.log('putUser: '+result)
                    callback({data:usuario})
                }
            })
        }else{
            callback({err:400})
        }
    },
    patchWallet:
    function(usuario, callback){
        //Usuario tiene: nombre,apellidos,dni,cuentabancaria,wallet,fecharegistro
        if(usuario._id){
            user.getOID(usuario._id,function(data){
                console.log(data)
                if(data.err || data.length<1 || data.data.length<1){callback({err:((data.err)? data.err : 404)}); return}
                if(usuario.nombre) data.data[0]['nombre']=usuario.nombre
                if(usuario.apellidos) data.data[0]['apellidos']=usuario.apellidos
                if(usuario.dni) data.data[0]['dni']=usuario.dni
                user.putUser(data.data[0],function(result){
                    callback(result)
                })
            })
        }else{
            callback({err:400})
        }
    },
    deleteWallet:
    function(oid, callback){
        mongo.collection('wallet').deleteOne({dni:oid},function(err,result){
            if(err){
                callback({err:500})
            }else if(result.n==0){
                callback({err:404})
            }else{
                console.log('deleteUser: '+result)
                callback({data:{status:OK}})
            }
        })
    }
}
module.exports = wallet