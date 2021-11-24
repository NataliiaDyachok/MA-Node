const fs = require('fs');


const { helper1: helpFilterItems,
  helper2: helpSortItems,
  helper3: helpFillPrice,
  helperDiscountPromise,
  helperDiscountPromisify,
} = require('../helpers');

const constants = require('../constants');

const {pathToJSONFile} = constants;

function filter(req, res) {
  const { message, code } = helpFilterItems.filterByParams(req.params);

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = code;
  res.write(JSON.stringify({message, code}));
  res.end();
}

function checkReqBody(reqBody){
  const retObj = { message: reqBody, code: 200};

  try {
    JSON.parse(reqBody);
  } catch (error) {
    retObj.code = 400;
  }
  return retObj;
}

function filterPost(req, res) {
  let resObj = checkReqBody(req.body);

  if(resObj.code === 200)
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
  if(resObj.code === 200)
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
  if(resObj.code === 200)
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
  if(resObj.code === 200)
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

      console.log('The file was not saved!');

      return;
    }


    const content = JSON.stringify(
      JSON.parse(req.body)
    );

    // eslint-disable-next-line consistent-return
    fs.writeFile(pathToJSONFile, content, 'utf8', (err) => {
        if (err) {
            return console.log(err);
        }

        console.log('The file was saved!');
    });

  }
  // fs.writeFileSync(pathToJSONFile, content);

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = resObj.code;
  res.write(JSON.stringify({message: resObj.message}));
  res.end();
}

function discountPromise(req, res) {

  const promises = helperDiscountPromise();
  Promise.all(promises)
    .then(items => {
      const code = 200;
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = code;
      res.write(JSON.stringify({items, code}));
      res.end();
    })
    .catch((message) => {
      const code = 400;
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = code;
      res.write(JSON.stringify({message, code}));
      res.end();
    });

}

async function discountPromisify(req, res) {

  const promises = helperDiscountPromisify();
  let code = 200;
  let items = [];

  try{

    items = await Promise.all(promises);

  } catch{
    code = 400;
  } finally{
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = code;
    res.write(JSON.stringify({message: items}));
    res.end();
  }

}

function discountPromisePost(req, res) {
  const { message, code } = helperDiscountPromise(
    JSON.parse(checkReqBody(req.body))
  );

  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify({message, code}));
  res.statusCode = code;
  res.end();
}

async function discountPromiseAsyncAwait(req, res) {
  let code = 200;
  let items = [];
  const promises = helperDiscountPromise();
  try{
    items = await Promise.all(promises);
  } catch{
    code = 400;
  } finally{
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = code;
    res.write(JSON.stringify({items, code}));
    res.end();
  }
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
  discountPromise,
  discountPromisePost,
  discountPromiseAsyncAwait,
  discountPromisify,
  notFound,
};
