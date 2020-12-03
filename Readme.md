# Products Rest API Demo - NodeJs + Express + MongoDB.

This is a prototype written in nodejs, express and Mongo to expose an API Rest. The idea is to have a template for futures developments. 

This prototype has security. The security "layer" uses JWT to protect the routes. I have developed a simple model with three entities to test the entire prototype and techs.

## Context and Model

As a consumer of REST API you can: get, create, update, and delete users, products, and categories. 
When you create a product, you should specify the category and the app register the user (the authenticated user) that creates it. The next image shows the entity relationships model.


![](https://res.cloudinary.com/dmg0wwwhg/image/upload/c_scale,w_452/v1604429110/zrittfrttuznk9gigvg9.png)

## Project Structure (Server Folder)

The project structure is:

```bash
# Server Folder
|-config
    |- config.js # Contains global configurations: MongoDB, PORTS and Secret.
|- middlewares
    |- authentication.js # Define a mdw for authetication and authorization.
|- model # Contains the model off app.
|- routes # Contains the routes for each entity. The api rest it's define here.

server.js # (file) Makes global configurations and startup the server.

```

When the server starts at first time, a default user is created:

```json
{
    "name": "admin",
    "email": "admin@admin.com",
    "password": "123456",
    "role": "ADMIN_ROLE"
}
```

Then, you can login to adquire the token:

```bash
curl --location --request POST 'localhost:3000/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username" : "admin@admin.com",
    "password" : "123456"
}'
```

If all gone well, you must to recibe:

```json
{
    "ok": true,
    "user": {
        "role": "ADMIN_ROLE",
        "status": true,
        "google": false,
        "_id": "5fa19e8a06c91c6a043016e6",
        "name": "admin",
        "email": "admin@admin.com",
        "__v": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...."
}

```

Now, you can invoke the api using the received token:
```bash
curl --location --request GET 'localhost:3000/user' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX....'

````


## Rest API

### User:
* GET /user - Retrieves all users.
* POST /user - Creates a new user.
* PUT /user/id - Updates a user.
* DELETE /user/id - Deletes a user.

### Category:
* GET /category - Retrieves all categories.
* POST /category - Creates a new category.
* PUT /category/id - Updates a category.
* DELETE /category/id - Deletes a category.

### Product:
* GET /product - Retrieves all products.
* POST /product - Creates a new product.
* PUT /product/id - Updates a product.
* DELETE /product/id - Deletes a product.



## Running with Docker.

You can run de app and mongo with Docker using docker-compose:

```bash
docker-compose up
```
















