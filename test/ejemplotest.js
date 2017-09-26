var hola_express = require('../hola_express');
var supertest = require('supertest');


describe('prueba de la app web', function(){
    it('/ devuelve el contenido adecuado', function(done){
        //Al objeto supertest le pasamos la app de Express
        supertest(hola_express)
            //Hacemos una petición HTTP
            .get('/')
            //Supertest incluye sus propias aserciones con 'expect'
            //Cuando ponemos un entero estamos verificando el status HTTP
            .expect(200)
            //Cuando ponemos dos String estamos verificando una cabecera HTTP
            .expect('X-Mi-Cabecera', 'Hola')
            //Si ponemos un string  estamos verificando el cuerpo de la respuesta
            //Como esta ya es la última expectativa, pasamos el 'done'. Supertest lo llamará
            //Cualquier 'expect' admite el 'done' como último parámetro
            .expect('Hola soy Express', done);
    });
    it('La ruta /hola no existe', function(done){
        supertest(hola_express)
            .get('/hola')
            .expect(404, done);
    });
});