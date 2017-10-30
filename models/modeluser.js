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
                callback({data:result[0]})
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
                callback({data:result[0]})
            }
        })
    },
    login:
    function(login,callback){
        if(login.dni && login.password){
            mongo.collection(userCollection).find({dni:login.dni,password:login.password},{_id:true,dni:true}).toArray(function(err,result){
                if(err){
                    callback({err:500})
                }else if(result.length<1){
                    callback({err:404})
                }else{
                    callback({data:result[0]})
                }
            })
        }else{
            callback({err:400})
        }
    },
    postUser:
    function(usuario, callback){
        if(usuario.nombre && usuario.apellidos && usuario.dni && usuario.password){
            user.getDNI(usuario.dni,function(data){
                if(data.data){
                    callback({err:403});
                    return
                }
                newdata = {nombre:usuario.nombre,apellidos:usuario.apellidos,dni:usuario.dni,password:usuario.password}
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
    function(usuario,oid,password,callback){
        if(usuario.nombre && usuario.apellidos && usuario.dni && usuario._id && usuario.password){
            user.updateUser(usuario,oid,password,function(result){
                callback(result)
            })   
        }else{
            callback({err:400})
        }
    },
    patchUser:
    function(usuario,oid,password,callback){
        if(usuario._id){
            user.updateUser(usuario,oid,password,function(result){
                callback(result)
            })
        }else{
            callback({err:400})
        }
    },
    deleteUser:
    function(dni,oid,password,callback){
        var o_id = ObjectId(oid)
        mongo.collection(userCollection).deleteOne({dni:dni,password:password,_id:o_id},function(err,result){
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
    function(usuario,oid,password,callback){
        if(oid != usuario._id){
            callback({err:403})
        }else{
            var o_id = ObjectId(oid)
            var query = {_id: ObjectId(usuario._id),password:password}
            secureUsuario = {}
            if(usuario.nombre) secureUsuario.nombre = usuario.nombre
            if(usuario.apellidos) secureUsuario.apellidos = usuario.apellidos
            if(usuario.dni) secureUsuario.dni = usuario.dni
            if(usuario.password) secureUsuario.password = usuario.password
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
}
module.exports = user