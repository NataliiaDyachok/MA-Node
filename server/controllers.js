// const services = require('../helpers');
const { helper1: helpFilterItems,
  helper2: helpSortItems,
  helper3: helpFillPrice
} = require('../helpers');

function filter(req, res) {
  const { message, code } = helpFilterItems.filterByParams(req.params);

  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify({message, code}));
  res.statusCode = code;
  res.end();
}

function filterPost(req, res) {
  const { message, code } = helpFilterItems.filterByParams(
    req.params,
    JSON.parse(req.body),
  );

  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify({message, code}));
  res.statusCode = code;
  res.end();
}

function topprice(req, res) {

  const { message, code } = helpSortItems();

  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify({message, code}));
  res.statusCode = code;
  res.end();
}

function toppricePost(req, res) {

  const { message, code } = helpSortItems(
    JSON.parse(req.body),
  );

  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify({message, code}));
  res.statusCode = code;
  res.end();
}

function commonprice(req, res) {

  const { message, code } = helpFillPrice();

  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify({message, code}));
  res.statusCode = code;
  res.end();
}

function commonpricePost(req, res) {
  const { message, code } = helpFillPrice(
    JSON.parse(req.body),
  );

  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify({message, code}));
  res.statusCode = code;
  res.end();
}

function dataPost(req, res) {
  
  const errorsArray = helpFilterItems.validate(JSON.parse(req.body));
  if (errorsArray.length>0){
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify({message: errorsArray, code: 400}));
    res.statusCode = code;
    res.end();
  }

  const fs = require('fs');
  const pathToJSONFile = '../data.json';
  const content = JSON.stringify(JSON.parse(req.body));
   
  fs.writeFile(pathToJSONFile, content, 'utf8', function (err) {
      if (err) {
          return console.log(err);
      }

      console.log("The file was saved!");
  }); 
  
  //fs.writeFileSync(pathToJSONFile, content);

  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify({message: content, code: 200}));
 
  res.statusCode = 200;
  res.end();
}

function notFound(req, res) {
  const { message, code } = services.notFound();
  res.statusCode = code;
  res.write(message);
  res.end();
}

module.exports = {
  filter,
  filterPost,
  topprice,
  toppricePost,
  commonprice,
  commonpricePost,
  dataPost,
  notFound,
};