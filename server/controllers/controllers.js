const fs = require('fs');

const { helper1: helpFilterItems,
  helper2: helpSortItems,
  helper3: helpFillPrice,
  helperDiscountPromise,
  helperDiscountPromiseAsyncAwait,
  helperDiscountPromisify,
  // helperRandomizer,
// eslint-disable-next-line import/no-dynamic-require
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

  helperDiscountPromise()
    .then(items => {
      const code = 200;
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = code;
      res.write(JSON.stringify({message: items}));
      res.end();
    });

}

function discountPromisePost(req, res) {
  let resObj = checkReqBody(req.body);

  if(resObj.code === 200){
    const errorsArray = helpFilterItems.validate(JSON.parse(req.body));
    if (errorsArray.length>0){
      resObj = {
        code: 400,
        message: errorsArray,
      };
    }
  }

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = resObj.code;

  if(resObj.code === 200)  {
    helperDiscountPromise(JSON.parse(req.body))
    .then(items => {
      res.write(JSON.stringify({message: items}));
      res.end();
    });
  } else{
    res.write(JSON.stringify({message: resObj.message}));
    res.end();
  }
}

function discountPromisify(req, res) {
  helperDiscountPromisify()
    .then(items => {
      const code = 200;
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = code;
      res.write(JSON.stringify({message: items}));
      res.end();
    });
}

function discountPromisifyPost(req, res){
  let resObj = checkReqBody(req.body);

  if(resObj.code === 200){
    const errorsArray = helpFilterItems.validate(JSON.parse(req.body));
    if (errorsArray.length>0){
      resObj = {
        code: 400,
        message: errorsArray,
      };
    }
  }

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = resObj.code;

  if(resObj.code === 200)  {
    helperDiscountPromisify(JSON.parse(req.body))
    .then(items => {
      res.write(JSON.stringify({message: items}));
      res.end();
    });
  } else{
    res.write(JSON.stringify({message: resObj.message}));
    res.end();
  }
}

function discountPromiseAsyncAwait(req, res) {
  helperDiscountPromiseAsyncAwait()
    .then(items => {
      const code = 200;
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = code;
      res.write(JSON.stringify({message: items}));
      res.end();
    });
}

function discountPromiseAsyncAwaitPost(req, res) {
  let resObj = checkReqBody(req.body);

  if(resObj.code === 200){
    const errorsArray = helpFilterItems.validate(JSON.parse(req.body));
    if (errorsArray.length>0){
      resObj = {
        code: 400,
        message: errorsArray,
      };
    }
  }

  if(resObj.code === 200)  {
    helperDiscountPromiseAsyncAwait(JSON.parse(req.body))
    .then(items => {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = resObj.code;
      res.write(JSON.stringify({message: items}));
      res.end();
    });
  } else{
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = resObj.code;
    res.write(JSON.stringify({message: resObj.message}));
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
  discountPromiseAsyncAwaitPost,
  discountPromisify,
  discountPromisifyPost,
  notFound,
};
