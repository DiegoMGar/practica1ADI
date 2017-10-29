urlmongotest = 'mongodb://localhost:27017/testadi1718'
var app = require('../app');
var supertest = require('supertest');
var versionapi = require('../version');

describe('Test de la raiz', function(){
    it('/ devuelve la versión más reciente.', function(done){
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
    it('La ruta /hola no existe.', function(done){
        supertest(app)
            .get('/hola')
            .expect(404, done);
    });
})

describe('Test del CRUD Usuario', function(){
    it('GET /users devuelve un listado vacío.', function(done){
        supertest(app)
            .get('/'+versionapi+'/users')
            .expect(200, done);
    });
    it('POST /users devuelve un 400 porque le falta el dni', function(done){
        supertest(app)
        .post('/'+versionapi+'/users')
        .send({nombre:'Se cambia',apellidos:'Se cambia' })
        .expect(400, done);
    });
    it('POST /users devuelve un 400 porque le falta el nombre', function(done){
        supertest(app)
        .post('/'+versionapi+'/users')
        .send({dni:'Se cambia',apellidos:'Se cambia' })
        .expect(400, done);
    });
    it('POST /users devuelve un 400 porque le faltan los apellidos', function(done){
        supertest(app)
        .post('/'+versionapi+'/users')
        .send({dni:'Se cambia',nombre:'Se cambia' })
        .expect(400, done);
    });
    it('POST /users devuelve un 201, introducido correctamente.', function(done){
        supertest(app)
            .post('/'+versionapi+'/users')
            .send({ dni:'111111111',nombre:'Diego1',apellidos:'Maroto',password:"111111111"})
            .expect(201, done);
    });
    it('POST /users devuelve un 403, el usuario ya existe.', function(done){
        supertest(app)
            .post('/'+versionapi+'/users')
            .send({ dni:'111111111',nombre:'Debe ser error',apellidos:'Debe ser error',password:"111111111"})
            .expect(403, done);
    });
    it('GET /users/111111111 devuelve un 200.', function(done){
        supertest(app)
            .get('/'+versionapi+'/users/111111111')
            .expect(200, done);
    });
    it('GET /users/111111112 devuelve un 404.', function(done){
        supertest(app)
            .get('/'+versionapi+'/users/111111112')
            .expect(404, done);
    });
    it('PUT /users devuelve un 200 editado correctamente.', function(done){
        newdata = {nombre:'Prueba',apellidos:'PruebaApellidos',dni:'111111112'}
        mongo.collection('users').insert(newdata,
            function(err, result) {
            if(err){
                throw new Error('No se ha podido insertar el usuario.')
            }else{
                o_id=result.insertedIds[0]
                supertest(app)
                .put('/'+versionapi+'/users')
                .send({ _id: o_id, dni:'111111112',nombre:'Se cambia',apellidos:'Se cambia',password:'111111111'})
                .expect(200, done);
            }
        })
    });
    it('PUT /users devuelve un 404 usuario no existe. (El tiempo no es problema, es cosa del test, que añade y elimina.)', function(done){
        newdata = {nombre:'Prueba2',apellidos:'PruebaApellidos',dni:'111111112'}
        mongo.collection('users').insert(newdata,
            function(err, result) {
            if(err){
                throw new Error('No se ha podido insertar el usuario.')
            }else{
                o_id=result.insertedIds[0]
                mongo.collection('users').deleteOne({_id:o_id},function(err,result){
                    if(err){
                        throw new Error('No se ha podido borrar el usuario.')
                    }else{
                        supertest(app)
                        .put('/'+versionapi+'/users')
                        .send({ _id: o_id, dni:'111111112',nombre:'Se cambia',apellidos:'Se cambia',password:'111111111'})
                        .expect(404, done);
                    }
                })
            }
        })
    });
    it('PUT /users devuelve un 500 error de servidor por oid mal formado.', function(done){
        supertest(app)
        .put('/'+versionapi+'/users')
        .send({ _id: '12223456456', dni:'111111112',nombre:'Se cambia',apellidos:'Se cambia',password:'111111111'})
        .expect(500, done);
    });
    it('PUT /users devuelve un 400 porque le falta el dni', function(done){
        supertest(app)
        .put('/'+versionapi+'/users')
        .send({_id: '12223456456',nombre:'Se cambia',apellidos:'Se cambia' })
        .expect(400, done);
    });
    it('PUT /users devuelve un 400 porque le falta el nombre', function(done){
        supertest(app)
        .put('/'+versionapi+'/users')
        .send({_id: '12223456456',dni:'Se cambia',apellidos:'Se cambia' })
        .expect(400, done);
    });
    it('PUT /users devuelve un 400 porque le faltan los apellidos', function(done){
        supertest(app)
        .put('/'+versionapi+'/users')
        .send({_id: '12223456456',dni:'Se cambia',nombre:'Se cambia' })
        .expect(400, done);
    });
    it('PATCH /users devuelve un 200 editado correctamente con toda la estructura de usuario.', function(done){
        newdata = {nombre:'Prueba',apellidos:'PruebaApellidos',dni:'111111114'}
        mongo.collection('users').insert(newdata,
            function(err, result) {
            if(err){
                throw new Error('No se ha podido insertar el usuario.')
            }else{
                o_id=result.insertedIds[0]
                supertest(app)
                .patch('/'+versionapi+'/users')
                .send({ _id: o_id, dni:'111111112',nombre:"Se cambia",apellidos:'Se cambia' })
                .expect(200, done);
            }
        })
    });
    it('PATCH /users devuelve un 200 editado correctamente faltando nombre.', function(done){
        newdata = {nombre:'Prueba',apellidos:'PruebaApellidos',dni:'111111114'}
        mongo.collection('users').insert(newdata,
            function(err, result) {
            if(err){
                throw new Error('No se ha podido insertar el usuario.')
            }else{
                o_id=result.insertedIds[0]
                supertest(app)
                .patch('/'+versionapi+'/users')
                .send({ _id: o_id, dni:'111111112',apellidos:'Se cambia'})
                .expect(200, done);
            }
        })
    });
    it('PATCH /users devuelve un 200 editado correctamente faltando apellidos.', function(done){
        newdata = {nombre:'Prueba',apellidos:'PruebaApellidos',dni:'111111114'}
        mongo.collection('users').insert(newdata,
            function(err, result) {
            if(err){
                throw new Error('No se ha podido insertar el usuario.')
            }else{
                o_id=result.insertedIds[0]
                supertest(app)
                .patch('/'+versionapi+'/users')
                .send({ _id: o_id, dni:'111111112',nombre:'Se cambia' })
                .expect(200, done);
            }
        })
    });
    it('PATCH /users devuelve un 200 editado correctamente faltando dni.', function(done){
        newdata = {nombre:'Prueba',apellidos:'PruebaApellidos',dni:'111111114'}
        mongo.collection('users').insert(newdata,
            function(err, result) {
            if(err){
                throw new Error('No se ha podido insertar el usuario.')
            }else{
                o_id=result.insertedIds[0]
                supertest(app)
                .patch('/'+versionapi+'/users')
                .send({ _id: o_id, apellidos:'Se cambia' })
                .expect(200, done);
            }
        })
    });
    it('PATCH /users devuelve un 404 usuario no existe.', function(done){
        newdata = {nombre:'Prueba',apellidos:'PruebaApellidos',dni:'111111117'}
        mongo.collection('users').insert(newdata,
            function(err, result) {
            if(err){
                throw new Error('No se ha podido insertar el usuario.')
            }else{
                o_id=result.insertedIds[0]
                mongo.collection('users').deleteOne({_id:o_id},function(err,result){
                    if(err){
                        throw new Error('No se ha podido borrar el usuario.')
                    }else{
                        supertest(app)
                        .patch('/'+versionapi+'/users')
                        .send({ _id: o_id, dni:'111111112',nombre:'Se cambia',apellidos:'Se cambia' })
                        .expect(404, done);
                    }
                })
            }
        })
    });
    it('PATCH /users devuelve un 500 error de servidor por oid mal formado.', function(done){
        supertest(app)
        .patch('/'+versionapi+'/users')
        .send({ _id: '12223456456', dni:'111111112',nombre:'Se cambia',apellidos:'Se cambia' })
        .expect(500, done);
    });
    it('PATCH /users devuelve un 400 por no enviar el oid.', function(done){
        supertest(app)
        .patch('/'+versionapi+'/users')
        .send({dni:'111111112',nombre:'Se cambia',apellidos:'Se cambia' })
        .expect(400, done);
    });
    it('POST /users/login devuelve un 200 autenticado correctamente.', function(done){
        supertest(app)
            .post('/'+versionapi+'/users/login')
            .send({dni:'111111111',password:'111111111'})
            .expect(200, done);
    });
    it('DELETE /users devuelve un 500 token incorrecto.', function(done){
        supertest(app)
            .delete('/'+versionapi+'/users/111111111')
            .send({token:'abcdefghijklmnñopqrstuvwxyz',password:'111111111'})
            .expect(500, done);
    });
})

describe('Test del CRUD Wallet', function(){
    it('GET /wallets devuelve un listado vacío', function(done){
        supertest(app)
            .get('/'+versionapi+'/wallets')
            .expect(200, done);
    });
    it('POST /wallets devuelve 201 recurso creado', function(done){
        supertest(app)
            .post('/'+versionapi+'/wallets')
            .send({titulo:'Cartera principal',
            descripcion:'Mi cartera de Bitcoins principal',
            saldo:0, moneda_symbol:'BTC', usuario_dni:'48576470X'})
            .expect(201, done);
    });
    it('PUT /wallets devuelve un 200 editado correctamente.', function(done){
        newdata = {titulo:'Cartera principal',
        descripcion:'Mi cartera de Bitcoins principal',
        saldo:0, moneda_symbol:'BTC', usuario_dni:'48576470X'}
        mongo.collection('wallets').insert(newdata,
            function(err, result) {
            if(err){
                throw new Error('No se ha podido insertar la wallet.')
            }else{
                o_id=result.insertedIds[0]
                supertest(app)
                .put('/'+versionapi+'/wallets')
                .send({ _id: o_id, titulo:'Cartera principal',
                descripcion:'Mi cartera de Bitcoins principal cambiada',
                saldo:0, moneda_symbol:'BTC', usuario_dni:'48576470X'})
                .expect(200, done);
            }
        })
    });
    it('PUT /wallets devuelve un 404 usuario no existe. (El tiempo no es problema, es cosa del test, que añade y elimina.)', function(done){
        newdata = {titulo:'Cartera principal',
        descripcion:'Mi cartera de Bitcoins principal',
        saldo:0, moneda_symbol:'BTC', usuario_dni:'48576470X'}
        mongo.collection('wallets').insert(newdata,
            function(err, result) {
            if(err){
                throw new Error('No se ha podido insertar la wallet.')
            }else{
                o_id=result.insertedIds[0]
                mongo.collection('wallets').deleteOne({_id:o_id},function(err,result){
                    if(err){
                        throw new Error('No se ha podido borrar la wallet.')
                    }else{
                        supertest(app)
                        .put('/'+versionapi+'/wallets')
                        .send({ _id: o_id, titulo:'Cartera principal',
                        descripcion:'Mi cartera de Bitcoins principal',
                        saldo:0, moneda_symbol:'BTC', usuario_dni:'48576470X'})
                        .expect(404, done);
                    }
                })
            }
        })
    });
    it('PUT /wallets devuelve un 500 error de servidor por oid mal formado.', function(done){
        supertest(app)
        .put('/'+versionapi+'/wallets')
        .send({ _id: '12223456456', titulo:'Cartera principal',
        descripcion:'Mi cartera de Bitcoins principal',
        saldo:0, moneda_symbol:'BTC', usuario_dni:'48576470X'})
        .expect(500, done);
    });
    it('PUT /wallets devuelve un 400 porque le falta el usuario_dni', function(done){
        supertest(app)
        .put('/'+versionapi+'/wallets')
        .send({_id: '12223456456', titulo:'Cartera principal',
        descripcion:'Mi cartera de Bitcoins principal',
        saldo:0, moneda_symbol:'BTC'})
        .expect(400, done);
    });
    it('PUT /wallets devuelve un 400 porque le falta el titulo', function(done){
        supertest(app)
        .put('/'+versionapi+'/wallets')
        .send({_id: '12223456456',
        descripcion:'Mi cartera de Bitcoins principal',
        saldo:0, moneda_symbol:'BTC', usuario_dni:'48576470X'})
        .expect(400, done);
    });
    it('PUT /wallets devuelve un 400 porque le falta la descripción', function(done){
        supertest(app)
        .put('/'+versionapi+'/wallets')
        .send({_id: '12223456456', titulo:'Cartera principal',
        saldo:0, moneda_symbol:'BTC', usuario_dni:'48576470X'})
        .expect(400, done);
    });
    it('PUT /wallets devuelve un 400 porque le falta el saldo', function(done){
        supertest(app)
        .put('/'+versionapi+'/wallets')
        .send({_id: '12223456456', titulo:'Cartera principal',
        descripcion:'D', moneda_symbol:'BTC', usuario_dni:'48576470X'})
        .expect(400, done);
    });
    it('PUT /wallets devuelve un 400 porque le falta el símbolo de moneda', function(done){
        supertest(app)
        .put('/'+versionapi+'/wallets')
        .send({_id: '12223456456', titulo:'Cartera principal',
        saldo:0, descripcion:'BTC', usuario_dni:'48576470X'})
        .expect(400, done);
    });
    it('PATCH /wallets devuelve un 200 editado correctamente con toda la estructura de usuario.', function(done){
        newdata = {titulo:'Cartera principal',
        descripcion:'Mi cartera de Bitcoins principal',
        saldo:0, moneda_symbol:'BTC', usuario_dni:'48576470X'}
        mongo.collection('wallets').insert(newdata,
            function(err, result) {
            if(err){
                throw new Error('No se ha podido insertar la wallet.')
            }else{
                o_id=result.insertedIds[0]
                supertest(app)
                .patch('/'+versionapi+'/wallets')
                .send({ _id: o_id, titulo:'Cartera cambiada',
                descripcion:'Mi cartera de Bitcoins principal',
                saldo:0, moneda_symbol:'BTC', usuario_dni:'48576470X'})
                .expect(200, done);
            }
        })
    });
    it('PATCH /wallets devuelve un 200 editado correctamente faltando titulo.', function(done){
        newdata = {titulo:'Cartera principal',
        descripcion:'Mi cartera de Bitcoins principal',
        saldo:0, moneda_symbol:'BTC', usuario_dni:'48576470X'}
        mongo.collection('wallets').insert(newdata,
            function(err, result) {
            if(err){
                throw new Error('No se ha podido insertar la wallet.')
            }else{
                o_id=result.insertedIds[0]
                supertest(app)
                .patch('/'+versionapi+'/wallets')
                .send({ _id: o_id,
                descripcion:'Mi cartera de Bitcoins principal',
                saldo:0, moneda_symbol:'BTC', usuario_dni:'48576470X'})
                .expect(200, done);
            }
        })
    });
    it('PATCH /wallets devuelve un 200 editado correctamente faltando descripción.', function(done){
        newdata = {titulo:'Cartera principal',
        descripcion:'Mi cartera de Bitcoins principal',
        saldo:0, moneda_symbol:'BTC', usuario_dni:'48576470X'}
        mongo.collection('wallets').insert(newdata,
            function(err, result) {
            if(err){
                throw new Error('No se ha podido insertar la wallet.')
            }else{
                o_id=result.insertedIds[0]
                supertest(app)
                .patch('/'+versionapi+'/wallets')
                .send({ _id: o_id, titulo:'Cartera principal',
                saldo:0, moneda_symbol:'BTC', usuario_dni:'48576470X'})
                .expect(200, done);
            }
        })
    });
    it('PATCH /wallets devuelve un 200 editado correctamente faltando moneda_symbol.', function(done){
        newdata = {titulo:'Cartera principal',
        descripcion:'Mi cartera de Bitcoins principal',
        saldo:0, moneda_symbol:'BTC', usuario_dni:'48576470X'}
        mongo.collection('wallets').insert(newdata,
            function(err, result) {
            if(err){
                throw new Error('No se ha podido insertar la wallet.')
            }else{
                o_id=result.insertedIds[0]
                supertest(app)
                .patch('/'+versionapi+'/wallets')
                .send({ _id: o_id, titulo:'Cartera principal',
                descripcion:'Mi cartera de Bitcoins principal',
                saldo:0, usuario_dni:'48576470X'})
                .expect(200, done);
            }
        })
    });
    it('PATCH /wallets devuelve un 200 editado correctamente faltando saldo.', function(done){
        newdata = {titulo:'Cartera principal',
        descripcion:'Mi cartera de Bitcoins principal',
        saldo:0, moneda_symbol:'BTC', usuario_dni:'48576470X'}
        mongo.collection('wallets').insert(newdata,
            function(err, result) {
            if(err){
                throw new Error('No se ha podido insertar la wallet.')
            }else{
                o_id=result.insertedIds[0]
                supertest(app)
                .patch('/'+versionapi+'/wallets')
                .send({ _id: o_id, titulo:'Cartera principal',
                descripcion:'Mi cartera de Bitcoins principal',
                moneda_symbol:'ETH', usuario_dni:'48576470X'})
                .expect(200, done);
            }
        })
    });
    it('PATCH /wallets devuelve un 404 usuario no existe.', function(done){
        newdata = {titulo:'Cartera principal',
        descripcion:'Mi cartera de Bitcoins principal',
        saldo:0, moneda_symbol:'BTC', usuario_dni:'48576470X'}
        mongo.collection('wallets').insert(newdata,
            function(err, result) {
            if(err){
                throw new Error('No se ha podido insertar la wallet.')
            }else{
                o_id=result.insertedIds[0]
                mongo.collection('wallets').deleteOne({_id:o_id},function(err,result){
                    if(err){
                        throw new Error('No se ha podido borrar la wallet.')
                    }else{
                        supertest(app)
                        .patch('/'+versionapi+'/wallets')
                        .send({ _id: o_id, titulo:'Cartera principal',
                        descripcion:'Mi cartera de Bitcoins principal',
                        saldo:0, moneda_symbol:'BTC', usuario_dni:'48576470X'})
                        .expect(404, done);
                    }
                })
            }
        })
    });
    it('PATCH /wallets devuelve un 500 error de servidor por oid mal formado.', function(done){
        supertest(app)
        .patch('/'+versionapi+'/wallets')
        .send({ _id: '12223456456', titulo:'Cartera principal',
        descripcion:'Mi cartera de Bitcoins principal',
        saldo:0, moneda_symbol:'BTC', usuario_dni:'48576470X'})
        .expect(500, done);
    });
    it('PATCH /wallets devuelve un 400 por no enviar el oid.', function(done){
        supertest(app)
        .patch('/'+versionapi+'/wallets')
        .send({titulo:'Cartera principal',
        descripcion:'Mi cartera de Bitcoins principal',
        saldo:0, moneda_symbol:'BTC', usuario_dni:'48576470X'})
        .expect(400, done);
    });
    it('DELETE /wallets devuelve un 204 eliminado correctamente.', function(done){
        newdata = {titulo:'Cartera principal',
        descripcion:'Mi cartera de Bitcoins principal',
        saldo:0, moneda_symbol:'BTC', usuario_dni:'48576470X'}
        mongo.collection('wallets').insert(newdata,
            function(err, result) {
            if(err){
                throw new Error('No se ha podido insertar la wallet.')
            }else{
                o_id=result.insertedIds[0]
                supertest(app)
                .delete('/'+versionapi+'/wallets/'+o_id)
                .expect(204, done);
            }
        })
    });
    it('DELETE /wallets devuelve un 404 usuario no encontrado.', function(done){
        newdata = {titulo:'Cartera principal',
        descripcion:'Mi cartera de Bitcoins principal',
        saldo:0, moneda_symbol:'BTC', usuario_dni:'48576470X'}
        mongo.collection('wallets').insert(newdata,
            function(err, result) {
            if(err){
                throw new Error('No se ha podido insertar la wallet.')
            }else{
                o_id=result.insertedIds[0]
                mongo.collection('wallets').deleteOne({_id:o_id},function(err,result){
                    if(err){
                        throw new Error('No se ha podido borrar la wallet.')
                    }else{
                        supertest(app)
                        .delete('/'+versionapi+'/wallets/'+o_id)
                        .expect(404, done);
                    }
                })
            }
        })
    });
})