var user = {
    getAll:
    function(callback){
        mongo.collection('users').find({}).toArray(function(err,result){
            if(err){
                callback({err:500})
            }else{
                callback({data:result})
            }
        })
    },
    getDNI:
    function(oid,callback){
        mongo.collection('users').find({dni:oid},{}).toArray(function(err,result){
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
        mongo.collection('users').find({_id:o_id},{}).toArray(function(err,result){
            if(err){
                callback({err:500})
            }else if(result.length<1){
                callback({err:404})
            }else{
                callback({data:result})
            }
        })
    },
    postUser:
    function(usuario, callback){
        //Usuario tiene: nombre,apellidos,dni,cuentabancaria,wallet,fecharegistro
        if(usuario.nombre && usuario.apellidos && usuario.dni){
            mongo.collection('users').insert({nombre:usuario.nombre,apellidos:usuario.apellidos,dni:usuario.dni},
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
    putUser:
    function(usuario, callback){
        //Usuario tiene: nombre,apellidos,dni,cuentabancaria,wallet,fecharegistro
        if(usuario.nombre && usuario.apellidos && usuario.dni && usuario._id){
            var o_id = ObjectId(usuario._id)
            var query = { _id: o_id }
            var newValues = {nombre: usuario.nombre,apellidos: usuario.apellidos,dni: usuario.dni}
            mongo.collection('users').updateOne(query,newValues,
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
    patchUser:
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
    deleteUser:
    function(oid, callback){
        mongo.collection('users').deleteOne({dni:oid},function(err,result){
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
module.exports = user