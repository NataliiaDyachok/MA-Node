const { helper1: helpFilterItems,
  helper2: helpSortItems,
  helper3: helpFillPrice
} = require('../helpers');

const constants = require('../constants');
const pathToJSONFile = constants.pathToJSONFile;

function filter(req, res) {
  const { message, code } = helpFilterItems.filterByParams(req.params);

  res.setHeader('Content-Type', 'application/json');
  res.writeHead(code, { 'Content-Type': 'text/plain' });
  res.write(JSON.stringify({message, code}));
  res.statusCode = code;
  res.end();
}

// function checkReqBody(reqBody){
//   if (!reqBody || 0 === reqBody.length){
//     return '[]';
//   }
//   return reqBody
// }

function checkReqBody(reqBody){
  let retObj = { message: reqBody, code: 200};
  
  try {
    JSON.parse(reqBody);
  } catch (error) {
    retObj.code = 400;
  }
  return retObj;
}

function filterPost(req, res) {
  let resObj = checkReqBody(req.body);
  
  if(resObj.code == 200)
  {
    resObj = helpFilterItems.filterByParams(
      req.params,
      JSON.parse((req.body))
    );
  }
  
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = resObj.code;
  res.write(JSON.stringify({message: resObj.message}));
  res.end();
}

function topprice(req, res) {

  const { message, code } = helpSortItems();

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = code;
  res.write(JSON.stringify({message, code}));
  res.end();
}

function toppricePost(req, res) {

  let resObj = checkReqBody(req.body);
  if(resObj.code == 200)
  {
    resObj = helpSortItems(JSON.parse((req.body)));
  }

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = resObj.code;
  res.write(JSON.stringify({message: resObj.message}));
  res.end();
}

function commonprice(req, res) {

  const { message, code } = helpFillPrice();

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = code;
  res.write(JSON.stringify({message}));
  res.end();
}

function commonpricePost(req, res) {
  let resObj = checkReqBody(req.body);
  if(resObj.code == 200)
  {
    resObj = helpFillPrice(JSON.parse(req.body));
  }

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = resObj.code;
  res.write(JSON.stringify({message: resObj.message}));
  res.end();
}

function dataPost(req, res) {
  let resObj = checkReqBody(req.body);
  if(resObj.code == 200)
  {
    
    const errorsArray = helpFilterItems.validate(
      JSON.parse(req.body)
    );
    if (errorsArray.length>0){
      resObj = {message: errorsArray, code: 400};

      res.setHeader('Content-Type', 'application/json');
      res.statusCode = resObj.code;
      res.write(JSON.stringify({ message: resObj.message}));
      res.end();

      console.log("The file wasn't saved!");

      return;
    }

    const fs = require('fs');
    const content = JSON.stringify(
      JSON.parse(req.body)
    );
    
    fs.writeFile(pathToJSONFile, content, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });

  }
  // fs.writeFileSync(pathToJSONFile, content);

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = resObj.code;
  res.write(JSON.stringify({message: resObj.message}));
  res.end();
}

function notFound(req, res) {
  const resObj = { message: 'Bad Request', code: 400 };
  
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = resObj.code;
  res.write(resObj.message);
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