if(!app)
    throw new Error('Express no existe en este contexto. RuntimeException.')

var request = require('request')
//La api de newapi.org para hacer peticiones externas
apinewsapi = '47cd6e317d8e42a4908d909b4e119d6d'
var endpointApiNewsApi = '/'+versionapi+'/newsapi'
app.get(endpointApiNewsApi, function(req, res, next) {
    request('https://newsapi.org/v1/sources', function (error, response, body) {
        if (!error && response.statusCode == 200) {
        res.status(200)
        }else{
        res.status(400)
        }
        var JSONSources = JSON.parse(body);
        res.send(JSONSources);
    })
});
  
app.get(endpointApiNewsApi+'/:id', function(req, res, next) {
    request('https://newsapi.org/v1/articles?source='+req.params.id+'&apiKey='+apinewsapi, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.status(200)
        }else{
            res.status(400)
        }
        var JSONObjectLatest = JSON.parse(body);
        res.send(JSONObjectLatest);
    })
});