const products = require('./data.json');

const { helper1: helpFilterItems,
  helper2: helpSortItems,
  helper3: helpFillPrice
} = require('./helpers');

function boot(){
  console.log(helpFillPrice.changeProductsCost(products));

  const arrOrange = helpFilterItems.filterItems(products, 'item', 'orange');
  const arrWeight = helpFilterItems.filterItems(products, 'weight', 4);
  console.log(arrOrange);
  console.log(arrWeight);

  let arrResultItems = arrOrange.concat(arrWeight);
  arrResultItems = helpSortItems.getMaxProductsCost(arrResultItems);
  console.log(arrResultItems);

  console.log(helpSortItems.getMaxProductsCost());
}

boot();
