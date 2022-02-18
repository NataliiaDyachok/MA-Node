Homework-08

// execute a query on the database to be able to generate id
CREATE EXTENSION IF NOT EXISTS "uuid-ossp"

// the work with migrations
npm run sequelize:migrate:latest
npm run sequelize:migrate:undo

// adding products to the database
POST http://localhost:3000/product 
body:
[
    {"item":"apple","type":"Fuji","weight":10,"pricePerKilo":"$3"},
    {"item":"orange","type":"Clementine","weight":6,"pricePerKilo":"$7"},
    {"item":"watermelon","type":"Nova","quantity":1,"pricePerItem":"$5"},
    {"item":"orange","type":"Navel","weight":6,"pricePerKilo":"$7"}
]

// update product to the database
PUT http://localhost:3000/product
body:
[
    {"item":"apple","type":"Fuji","weight":10,"pricePerKilo":"$3"}
]

// adding products to the database
PUT http://localhost:3000/store/csv
body: binary data_100.csv

// get product from database by id
GET http://localhost:3000/product
params: specify id

// get all products from database
GET http://localhost:3000/product-all


// delete product from database by id
DELETE http://localhost:3000/product
params: specify id

// adding products to the order 
PUT http://localhost:3000/order 
body:
[
    {"item":"apple","type":"Fuji","weight":10,"pricePerKilo":"$3"},
    {"item":"orange","type":"Clementine","weight":6,"pricePerKilo":"$7"},
    {"item":"watermelon","type":"Nova","quantity":1,"pricePerItem":"$5"},
    {"item":"orange","type":"Navel","weight":6,"pricePerKilo":"$7"}
]

// ======================================================================

Homework-09

ACCESS_TOKEN_SECRET=48f234b26ecdd84220f1a8a85d13496874041d6b1eab09c4506ae152c2bebd0a
REFRESH_TOKEN_SECRET=fabff2fa3833326be2e4170e1ad3e5c1d4639752197bc5175dfb75c51f737dbb
REFRESH_EXPIRES_IN=315360000
ACCESS_EXPIRES_IN=5m

POST http://localhost:3000/register
body: 
  {"firstName":"Ivan","lastName":"Ivanov","email":"ivanov@gmail.com","password":"qwe"}

POST http://localhost:3000/login
body: 
  {"email":"ivanov@gmail.com","password":"qwe"}

POST http://localhost:3000/refresh


