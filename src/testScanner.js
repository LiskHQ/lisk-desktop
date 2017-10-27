var fs = require('fs');

var scanFolder = require("scan-folder");
// process.argv.forEach(function (val, index, array) {
//     console.log(index + ': ' + val);
// });
const min = parseInt(process.argv[2]);
const max = parseInt(process.argv[3]);

// find js files in all dirs  
const files = scanFolder(__dirname + '/', "test.js", true);
console.log('Length', files.length);
const makePathRelative = path => path.replace(__dirname, '.');
const modules = files
    .map( source => `require('${makePathRelative(source)}');` )
    .filter((item, index) => {
        return (min < index && index < max);
    })
    .join('\n');
console.log(__dirname);
fs.writeFile(__dirname+"/test.js", modules, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 