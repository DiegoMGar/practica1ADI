var app = require('../app');
var supertest = require('supertest');
var versionapi = require('../version');
var MongoClient = require('mongodb').MongoClient

var urlmongotest = 'mongodb://localhost:27017/testadi1718'
MongoClient.connect(urlmongotest, function(err, db) {
	if (err) throw err;
    mongo = db
    console.log('Conectado a mongo de test')
})

describe('Test de la raiz', function(){
    it('/ devuelve la versión más reciente', function(done){
        //Al objeto supertest le pasamos la app de Express
        supertest(app)
            //Hacemos una petición HTTP
            .get('/')
            //Supertest incluye sus propias aserciones con 'expect'
            //Cuando ponemos un entero estamos verificando el status HTTP
            .expect(200)
            //Cuando ponemos dos String estamos verificando una cabecera HTTP
            //.expect('X-Mi-Cabecera', 'Hola')
            //Si ponemos un string  estamos verificando el cuerpo de la respuesta
            //Como esta ya es la última expectativa, pasamos el 'done'. Supertest lo llamará
            //Cualquier 'expect' admite el 'done' como último parámetro
            .expect('Versión más reciente de la API: '+versionapi, done);
    });
    it('La ruta /hola no existe', function(done){
        supertest(app)
            .get('/hola')
            .expect(404, done);
    });
});
describe('Test del CRUD Usuario', function(){
    it('GET /users devuelve un listado vacío', function(done){
        supertest(app)
            .get('/'+versionapi+'/users')
            .expect(200)
            .expect('[]', done);
    });
    it('POST /users devuelve un listado vacío #TODO', function(done){
        supertest(app)
            .get('/'+versionapi+'/users')
            .expect(200)
            .expect('[]', done);
    });
    it('PUT /users devuelve un listado vacío #TODO', function(done){
        supertest(app)
            .get('/'+versionapi+'/users')
            .expect(200)
            .expect('[]', done);
    });
    it('PATC /users devuelve un listado vacío #TODO', function(done){
        supertest(app)
            .get('/'+versionapi+'/users')
            .expect(200)
            .expect('[]', done);
    });
    it('DELETE /users devuelve un listado vacío #TODO', function(done){
        supertest(app)
            .get('/'+versionapi+'/users')
            .expect(200)
            .expect('[]', done);
    });
});