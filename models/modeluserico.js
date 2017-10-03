var userico = {
    readAll:
    function(callback){
        mongo.collection('usersico').find({}).toArray(function(err,result){
            if(err){
                callback({err:500})
            }else{
                callback({data:result})
            }
        })
    }
}
module.exports = userico