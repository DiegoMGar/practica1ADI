# Practica 1 ADI - Universidad de Alicante
### Aplicaciones distribuidas en internet 2017/18
**Author: Diego Maroto García**

### Descripción
Aplicación basada en nodejs, express y mongodb para poner en funcionamiento un API REST.

### Contenido
Simulación de broker en bolsa para compra/venta de criptomonedas.

### Repo
[Github - Práctica1 ADI](https://github.com/DiegoMGar/practica1ADI)

### Casos de uso
- Como usuario no autenticado debo ser capaz de listar usuario/s.
- Como usuario no autenticado debo ser capaz de listar cartera/s.
- Como usuario no autenticado debo ser capaz de crear un usuario.
- Como usuario autenticado debo ser capaz de editar y eliminar mi usuario.
- Como usuario no autenticado debo ser capaz de CRUD carteras.
- Como usuario no autenticado debo ser capaz de ver fuentes de noticias (api externa).
  - Ejemplo: http localhost:3000/v1/newsapi
- Como usuario no autenticado debo ser capaz de ver noticias de una fuente seleccionada (api externa).
  - Ejemplo: http localhost:3000/v1/newsapi/wirtschafts-woche

> Se sabe que no hay seguridad en la aplicación, las contraseñas salen en claro en los listados y se cuenta con ello, se está seleccionando el objeto usuario entero para facilitar el desarrollo y la fase de debug.

**Implementado para la primera entrega:**

- Crud de Usuario.
- Crud de Wallet.
- 2 peticiones get a una API externa de noticias.
- hipermedia en las respuestas, contenidas en el índice links del objeto json devuelto.
- paginación de los readAll de usuarios y wallets.
- jsontoken, se usa una contraseña fija (la del usuario) para firmar el token, poco seguro pero suficiente para esta entrega.
- El testing falla desde la implementación del jsonwebtoken, que es lo último que se implementó, _#wontfix_.

### Wiki de la API
Visualiza `swagger_editor.html` en tu navegador favorito, se cargará por defecto el fichero `wikiApi.yaml` con swagger de Open Api como parseador.

Al abrir `swagger_editor.html`, a la derecha, se puede navegar de forma visual por la especificación del API.

### Ejemplos de uso:
- http localhost:3000/v1/users //Devuelve 200 y un listado
- http post localhost:3000/v1/users dni="123456789X" password="123456789X" nombre="ejemplo" apellidos="apellidos de ejemplo" //Devuelve 201 y datos
- http patch localhost:3000/v1/users _id="59f70a542fbe3f177be4d7e8" nombre="ejemplocambiado" //Devuelve un 500, falta el token
- http post localhost:3000/v1/users/login dni="123456789X" password="123456789X" //Devuelve 200 y token, con el objeto que resume el token
- http patch localhost:3000/v1/users _id="59f70a542fbe3f177be4d7e8" nombre="ejemplocambiado" token="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1OWY3MGE1NDJmYmUzZjE3N2JlNGQ3ZTgiLCJkbmkiOiIxMjM0NTY3ODlYIn0.hbijfzsFEhiIYEb5XH5ftnvBoWLyo3b86SmOw8Yeis0" password="123456789X" //Devuelve 200 y los datos cambiados
- http patch localhost:3000/v1/users _id="59f70a542fbe3f177be4d7e8" nombre="ejemplocambiado2" token="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1OWY3MGE1NDJmYmUzZjE3N2JlNGQ3ZTgiLCJkbmkiOiIxMjM0NTY3ODlYIn0.hbijfzsFEhiIYEb5XH5ftnvBoWLyo3b86SmOw8Yeis0" password="123456789" //Devuelve un 500 error en firma
- http put localhost:3000/v1/users _id="59f70a542fbe3f177be4d7e8" nombre="ejemplocambiado2" apellidos="apellidos de ejemplo" dni="123456789X" token="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1OWY3MGE1NDJmYmUzZjE3N2JlNGQ3ZTgiLCJkbmkiOiIxMjM0NTY3ODlYIn0.hbijfzsFEhiIYEb5XH5ftnvBoWLyo3b86SmOw8Yeis0" password="123456789X" //Devuelve un 200 y los datos cambiados
- http localhost:3000/v1/users/123456789X //Devuelve 200 y los datos finales del usuario que se ha ido editando