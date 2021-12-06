const { Transform } = require('stream');

function createCsvToJson(){
  let isFirst = true;

  const transform = (chunk, encoding, callback) => {
    let  arrData = chunk.toString().split('\n');

    if (isFirst){
      // {}
      arrData.shift();
      isFirst = false;
      // callback(null, 'JSON string\n');
      // return;
    }

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

    const arrayUnique =  arrData.reduce((retArr, productItem) => {

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

    const content = JSON.stringify(arrayUnique, null, 2);

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
  // Transform.prototype._flush = flush;

  return new Transform();

}

module.exports = createCsvToJson;
