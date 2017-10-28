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
                        callback({data:result.ops[0]})
                    }
                })
            })
        }else{
            callback({err:400})
        }
    },
    putUser:
    function(usuario, callback){
        if(usuario.nombre && usuario.apellidos && usuario.dni && usuario._id){
            user.updateUser(usuario,function(result){
                callback(result)
            })   
        }else{
            callback({err:400})
        }
    },
    patchUser:
    function(usuario, callback){
        if(usuario._id){
            user.updateUser(usuario,function(result){
                callback(result)
            })
        }else{
            callback({err:400})
        }
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
        var query = {_id: ObjectId(usuario._id)}
        secureUsuario = {}
        if(usuario.nombre) secureUsuario.nombre = usuario.nombre
        if(usuario.apellidos) secureUsuario.apellidos = usuario.apellidos
        if(usuario.dni) secureUsuario.dni = usuario.dni
        var newValues = {$set:secureUsuario}
        mongo.collection(userCollection).updateOne(query,newValues,
            function(err, result) {
            if(err){
                callback({err:500})
            }else if(result.result.n==0){
                callback({err:404})
            }else{
                secureUsuario._id = usuario._id
                callback({data:secureUsuario})
            }
        })
    }
}
module.exports = user