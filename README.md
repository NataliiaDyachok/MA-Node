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
