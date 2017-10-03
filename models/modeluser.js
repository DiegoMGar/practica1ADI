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
            }else{
                callback({data:result})
            }
        })
    },
    postUser:
    function(usuario, callback){
        //Usuario tiene: nombre,apellidos,dni,cuentabancaria,wallet,fecharegistro
        if(usuario.nombre && usuario.apellidos && usuario.dni){
            mongo.collection("users").insertOne({nombre:usuario.nombre,apellidos:usuario.apellidos,dni:usuario.dni},
                function(err, result) {
                if(err){
                    callback({err:500})
                }else{
                    callback({data:result})
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
            mongo.collection("users").updateOne(query,newValues,
                function(err, result) {
                if(err){
                    callback({err:500})
                }else{
                    callback({data:result})
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
            var o_id = ObjectId(usuario._id)
            var query = { _id: o_id }
            var newSet = {}
            if(usuario.nombre) newSet['nombre']=usuario.nombre
            if(usuario.apellidos) newSet['apellidos']=usuario.apellidos
            if(usuario.dni) newSet['dni']=usuario.dni
            var newValues = {$set: {newSet}}
            mongo.collection("users").updateOne(query,newValues,
                function(err, result) {
                if(err){
                    callback({err:500})
                }else{
                    callback({data:result})
                }
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
            }else{
                callback({data:result})
            }
        })
    }
}
module.exports = user