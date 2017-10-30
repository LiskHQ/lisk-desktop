const fs = require('fs');

const scanFolder = require('scan-folder');
// process.argv.forEach(function (val, index, array) {
//     console.log(index + ': ' + val);
// });
const min = parseInt(process.argv[2], 10);
const max = parseInt(process.argv[3], 10);

// find js files in all dirs  
const files = scanFolder(`${__dirname}/`, 'test.js', true);
const makePathRelative = path => path.replace(__dirname, '.');
const modules = files
  .map(source => `require('${makePathRelative(source)}');`)
  .filter((item, index) => (min < index && index < max))
  .join('\n');
fs.writeFile(`${__dirname}/test.js`, `${modules}\n`, (err) => {
  if (err) {
    return console.log(err); //eslint-disable-line
  }
  return console.log('The file was saved!'); //eslint-disable-line
});
