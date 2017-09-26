var user = {
    readAll:
    function(callback){
        mongo.collection('users').find({}).toArray(function(err,result){
            if(err){
                callback({err:500})
            }else{
                callback({data:result})
            }
        })
    }
}
module.exports = user