# Practica 1 ADI - Universidad de Alicante
### Aplicaciones distribuidas en internet 2017/18
**Author: Diego Maroto García**

### Descripción
Aplicación basada en nodejs, express y mongodb para poner en funcionamiento un API REST.

### Contenido
Simulación de broker en bolsa para compra/venta de criptomonedas.

**Implementado para la primera entrega:**

- Crud de Usuario.
- Crud de Wallet.
- 2 peticiones get a una API externa de noticias.
- jsontoken, login en `post /users/login` y acreditación de token en `delete /users/:dni`.
- hypermedia en las respuestas, contenidas en el índice links del objeto json devuelto.
- paginación de los readAll de usuarios y wallets

### Wiki de la API
Visualiza `swagger_editor.html` en tu navegador favorito, se cargará por defecto el fichero `wikiApi.yaml` con swagger de Open Api como parseador.

Al abrir `swagger_editor.html`, a la derecha, se puede navegar de forma visual por la especificación del API.