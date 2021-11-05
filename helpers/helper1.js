function filterItems(arrItems, parFilter, valFilter) {
  return arrItems.filter(item => item[parFilter] === valFilter);
}

module.exports.filterItems = filterItems;
