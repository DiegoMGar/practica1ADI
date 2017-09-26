//Cargamos el módulo express
var express = require('express')
var bp = require('body-parser')
var app = express()
app.use(bp.json())

app.get('/', function(pet,resp) {
   //Tenemos una serie de primitivas para devolver la respuesta HTTP
   resp.status(200)
   resp.send('Hola mundo') 
})

//En Express asociamos un método HTTP y una URL con un callback a ejecutar
app.get('/api/items', function(pet,resp) {
   //Tenemos una serie de primitivas para devolver la respuesta HTTP
   resp.status(200)
   resp.send('Listado de items') 
})

app.post('/api/items',function(pet,resp){
	console.log(pet.body)
	var obj = pet.body
	resp.header("Location",'http://localhost/api/items')
	if(obj.nombre && obj.cantidad){

	}else{
		resp.status(400)
		resp.send({error:"Error en los parámetros"})
	}
})

//Este método delega en el server.listen "nativo" de Node
app.listen(3000, function () {
   console.log("El servidor express está en el puerto 3000")
})
module.exports = app