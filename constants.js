const { readdirSync, lstatSync } = require('fs');

const path = require('path');

const pathToJSONFile = path.resolve(__dirname, 'data.json');

const getFullPath = (sFile = '') =>
  path.resolve(__dirname, './upload', sFile);

const orderReccentFiles = (dir) =>
  readdirSync(dir)
    .filter(file => lstatSync(getFullPath(file)).isFile())
    .filter(file => path.extname(file) === '.json')
    .map(file => ({ file, mtime: lstatSync(getFullPath(file)).mtime }))
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

const getMostRecentFile = (dir) => {
  const files = orderReccentFiles(dir);
  return files.length ? files[0] : undefined;
};

const lastUploadedJSONFile = getMostRecentFile(getFullPath());

// const pathToJSONFileForExport =
//   typeof lastUploadedJSONFile === 'undefined'
//     ? pathToJSONFile
//     : getFullPath(lastUploadedJSONFile.file);

const getPathToMostRecentFile = () =>
  typeof lastUploadedJSONFile === 'undefined'
    ? pathToJSONFile
    : getFullPath(lastUploadedJSONFile.file);

module.exports = {
  getPathToMostRecentFile,
  pathToJSONFile
};
