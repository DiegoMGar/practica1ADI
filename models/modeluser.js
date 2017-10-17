var userCollection = 'users'
var user = {
    getAll:
    function(callback){
        mongo.collection(userCollection).find({}).toArray(function(err,result){
            if(err){
                callback({err:500})
            }else{
                callback({data:result})
            }
        })
    },
    getDNI:
    function(oid,callback){
        mongo.collection(userCollection).find({dni:oid},{}).toArray(function(err,result){
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
        mongo.collection(userCollection).find({_id:o_id},{}).toArray(function(err,result){
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
            user.getDNI(usuario.dni,function(data){
                if(data.data){
                    callback({err:403});
                    return
                }
                newdata = {nombre:usuario.nombre,apellidos:usuario.apellidos,dni:usuario.dni}
                mongo.collection(userCollection).insert(newdata,
                    function(err, result) {
                    if(err){
                        callback({err:500})
                    }else{
                        usuario._id=result.insertedIds[0]
                        callback({data:usuario})
                    }
                })
            })
        }else{
            callback({err:400})
        }
    },
    putUser:
    function(usuario, callback){
        //Usuario tiene: nombre,apellidos,dni,cuentabancaria,wallet,fecharegistro
        if(usuario.nombre && usuario.apellidos && usuario.dni && usuario._id){
            user.getOID(usuario._id,function(data){
                if(data.err || data.length<1 || data.data.length<1){callback({err:((data.err)? data.err : 404)}); return}
                user.updateUser(usuario,function(result){
                    callback(result)
                })
            })
            
        }else{
            callback({err:400})
        }
    },
    patchUser:
    function(usuario, callback){
        console.log("patch user")
        console.log(usuario)
        //Usuario tiene: nombre,apellidos,dni,cuentabancaria,wallet,fecharegistro
        if(!usuario._id){
            callback({err:400})
            return
        }
        var query = {_id:ObjectId(usuario._id)}
        delete usuario._id
        newValues = {$set:usuario}
        mongo.collection(userCollection).updateOne(query,newValues,function(err,result){
            callback({data:result})
        })
        /*
        return
        callback({data:usuario})
        return
        var o_id = ObjectId(usuario._id)
        var query = { _id: o_id }
        var newValues = {_id: o_id, nombre: usuario.nombre,apellidos: usuario.apellidos,dni: usuario.dni}
        mongo.collection(userCollection).updateOne(query,newValues,
            function(err, result) {
            if(err){
                callback({err:500})
            }else if(result.nModified==0){
                callback({err:404})
            }else{
                callback({data:usuario})
            }
        })
        return

        if(usuario._id){
            user.getOID(usuario._id,function(data){
                if(data.err || data.length<1 || data.data.length<1){callback({err:((data.err)? data.err : 404)}); return}
                if(usuario.nombre) data.data[0]['nombre']=usuario.nombre
                if(usuario.apellidos) data.data[0]['apellidos']=usuario.apellidos
                if(usuario.dni) data.data[0]['dni']=usuario.dni
                user.updateUser(data.data[0],function(result){
                    callback(result)
                })
            })
        }else{
            callback({err:400})
        }
        */
    },
    deleteUser:
    function(oid, callback){
        mongo.collection(userCollection).deleteOne({dni:oid},function(err,result){
            if(err){
                callback({err:500})
            }else if(result.result.n==0){
                callback({err:404})
            }else{
                callback({data:{status:'OK'}})
            }
        })
    },
    updateUser: //FUNCION AUXILIAR, NO USAR SUELTA, SE DEBEN HACER LAS COMPROBACIONES PERTINENTES EN DATOS
    function(usuario, callback){
        var o_id = ObjectId(usuario._id)
        var query = { _id: o_id }
        var newValues = {_id: o_id, nombre: usuario.nombre,apellidos: usuario.apellidos,dni: usuario.dni}
        mongo.collection(userCollection).updateOne(query,newValues,
            function(err, result) {
            if(err){
                callback({err:500})
            }else if(result.nModified==0){
                callback({err:404})
            }else{
                callback({data:usuario})
            }
        })
    }
}
module.exports = user