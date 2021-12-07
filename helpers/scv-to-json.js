const { Transform } = require('stream');
const {validate: helpFilterItemsValidate} = require('./helper1');

function getArrayUnique(arrScr){
  const arrayUnique =  arrScr.reduce((retArr, productItem) => {
    
    const hasWeight = typeof productItem.weight  !== 'undefined'
      && typeof productItem.pricePerKilo !== 'undefined';
    // eslint-disable-next-line arrow-body-style
    const productExist = retArr.find((productUnique) => {
      return productItem.item === productUnique.item
        && productItem.type === productUnique.type
        && (hasWeight === true
          ? productItem.pricePerKilo === productUnique.pricePerKilo
          : productItem.pricePerItem ===  productUnique.pricePerItem);
    });

    if (typeof productExist !== 'undefined'){
      // eslint-disable-next-line no-unused-expressions
      hasWeight === true
        ? productExist.weight += productItem.weight
        : productExist.quantity += productItem.quantity;
    } else {
      return [...retArr, productItem];
    }

    return retArr;
  }, []);

  return arrayUnique;
}

function createCsvToJson(){
  let isFirst = true;
  let sFirstRow = '';
  let sLastRow = '';
  let sAdditionalLine = '';
  let globalArrayUnique = [];

  const transform = (chunk, encoding, callback) => {
    let  arrData = chunk.toString().split('\n');

    if (isFirst){
      // {}
      arrData.shift();
      // isFirst = false;
      // callback(null, 'JSON string\n');
      // return;
    } else {
      arrData = arrData.filter(element => element.trim() !== '' );
      sFirstRow = arrData.shift();
      sAdditionalLine = sLastRow.concat(sFirstRow);
    }

    sLastRow = arrData.pop();
    arrData = [...arrData, sAdditionalLine];

    isFirst = false;

    arrData = arrData
      .filter((element) => element.trim() !== '' )
      .map(element => {
        const arrElem =  element
          // eslint-disable-next-line no-useless-escape
          .replace('\"', '')
          // eslint-disable-next-line no-useless-escape
          .replace(/(\d+),(\d+)/, '$1\.$2')
          .split(',')
          // eslint-disable-next-line no-useless-escape
          .map(a => a.replace('.', ',').replace('\"', ''));

        return {
          item: arrElem[0],
          type: arrElem[1],
          [arrElem[2]]: Number(arrElem[3]),
          [arrElem[4]]: arrElem[5],
        };
    });

    const errorsArray = helpFilterItemsValidate(arrData);
    if (errorsArray.length>0){
      callback(JSON.stringify({message: errorsArray, code: 400}), null);
      return;
    }

    const arrayUnique = getArrayUnique(arrData);
    globalArrayUnique = globalArrayUnique.concat(arrayUnique);
    globalArrayUnique = getArrayUnique(globalArrayUnique);

    const content = JSON.stringify(globalArrayUnique, null, 2);
    callback(null, content);
  };

  // eslint-disable-next-line no-underscore-dangle
  Transform.prototype._transform = transform;

  // eslint-disable-next-line no-unused-vars
  const flush = callback => {
    console.log('No more data is read.');
    callback(null, '\nFinish!');
  };
  // eslint-disable-next-line no-underscore-dangle
  Transform.prototype._flush = flush;

  return new Transform();

}

module.exports = createCsvToJson;
