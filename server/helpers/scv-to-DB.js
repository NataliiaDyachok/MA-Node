const { Transform } = require('stream');
const {validate: helpFilterItemsValidate} = require('./helper1');
const writeArrayInDB = require('./helperDB');

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

function formatAndCheckRow(sRow){
  // eslint-disable-next-line no-useless-escape
  let formatRow =  sRow.replace('\"', '');
  // eslint-disable-next-line no-useless-escape
  formatRow =  formatRow.replace(/(\d+),(\d+)/, '$1\.$2');

  return formatRow.split(',')
    .map(element => element.replace('.', ','))
  // eslint-disable-next-line no-useless-escape
    .map(element => element.replace('\"', ''));
}

function createCsvToDB(){
  let isFirst = true;
  let sFirstRow = '';
  let sLastRow = '';
  let sAdditionalLine = '';
  let globalArrayUnique = [];

  let arrFirstRow = [];
  let arrLastRow = [];

  let sAdditionaFirstRow = '';
  let sAdditionaLastRow = '';

  const transform = (chunk, encoding, callback) => {
    let  arrData = chunk.toString().split(/\r?\n/); // /\r|\n/

    if (isFirst){
      arrData.shift();
    } else {
      arrData = arrData.filter(element => element.trim() !== '' );
      sFirstRow = arrData.shift();

      arrFirstRow = [];
      if (sFirstRow !== '' ){
        arrFirstRow = formatAndCheckRow(sFirstRow);
        console.log(arrFirstRow);
      }

      sAdditionalLine = '';
      sAdditionaFirstRow = '';
      sAdditionaLastRow = '';
      if (arrFirstRow.length !== 6 ||  arrLastRow.length !== 6)
        sAdditionalLine = arrLastRow.join(',').concat(arrFirstRow.join(','));
      else {
        sAdditionaFirstRow = sFirstRow;
        sAdditionaLastRow = sLastRow;
      }

    }

    sLastRow = arrData.pop();

    arrLastRow = [];
    if (sLastRow !== '' ){
      arrLastRow = formatAndCheckRow(sLastRow);
      console.log(arrLastRow);
    }

    if (sAdditionalLine !== ''){
      console.log(sAdditionalLine);
      arrData.push(sAdditionalLine);
    }
    else{
      arrData.push(sAdditionaFirstRow);
      arrData.push(sAdditionaLastRow);
    }

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
    // globalArrayUnique = globalArrayUnique.concat(arrayUnique);
    arrayUnique.forEach(elementProduct => {
      globalArrayUnique.push(elementProduct);
    });

    globalArrayUnique = getArrayUnique(globalArrayUnique);

    // const content = JSON.stringify(arrayUnique, null, 2);
    callback(null, '');
  };

  // eslint-disable-next-line no-underscore-dangle
  Transform.prototype._transform = transform;

  // eslint-disable-next-line no-unused-vars
  const flush = async callback => {
    console.log('No more data is read.');

    // const content = JSON.stringify(globalArrayUnique, null, 2);
   // try{
      await writeArrayInDB(globalArrayUnique)
      .then(() => {
        console.log('Writing to the database is over');
        callback(null, globalArrayUnique);
      })
      .catch(err => callback(err.message, null));

  //  } catch {
        // eslint-disable-next-line no-unused-expressions
    //     err => {callback(err.message, null);};
    // }

    // console.log('Writing to the database is over');

    // const content = globalArrayUnique;
    // callback(null, globalArrayUnique);
  };
  // eslint-disable-next-line no-underscore-dangle
  Transform.prototype._flush = flush;

  return new Transform();

}

module.exports = createCsvToDB;
