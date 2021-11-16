const { helper1: helpFilterItems,
  helper2: helpSortItems,
  helper3: helpFillPrice
} = require('../helpers');

const constants = require('../constants');
const pathToJSONFile = constants.pathToJSONFile;

function filter(req, res) {
  const { message, code } = helpFilterItems.filterByParams(req.params);

  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify({message, code}));
  res.statusCode = code;
  res.end();
}

function checkReqBody(reqBody){
  if (!reqBody || 0 === reqBody.length){
    return '[]';
  }
  return reqBody
}

function filterPost(req, res) {
  const { message, code } = helpFilterItems.filterByParams(
    req.params,
    JSON.parse(checkReqBody(req.body))
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
    JSON.parse(checkReqBody(req.body))
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
    JSON.parse(checkReqBody(req.body))
  );

  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify({message, code}));
  res.statusCode = code;
  res.end();
}

function dataPost(req, res) {
  
  const errorsArray = helpFilterItems.validate(
    JSON.parse(checkReqBody(req.body))
  );

  if (errorsArray.length>0){
    const { message, code } = {message: errorsArray, code: 400};

    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify({ message, code }));
    res.statusCode = code;
    res.end();

    console.log("The file wasn't saved!");

    return;
  }

  const fs = require('fs');
  const content = JSON.stringify(
    JSON.parse(checkReqBody(req.body))
  );
   
  fs.writeFile(pathToJSONFile, content, 'utf8', function (err) {
      if (err) {
          return console.log(err);
      }

      console.log("The file was saved!");
  });
  
  // fs.writeFileSync(pathToJSONFile, content);

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