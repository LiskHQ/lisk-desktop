const find = require('findit'); // eslint-disable-line
const fs = require('fs');

const finder = find('./node_modules/@liskhq');
const fix = "console.log('monkey patch');";

finder.on('file', (file) => {
  if (file.match(/\.js/)) {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) throw err;
      let newData = '';
      if (data.match(/process\.env\.NACL_FAST\s=\s'disable';/)) {
        newData = data
          .replace(/process.env.NACL_FAST = 'disable';/, fix);
        console.log(`Fix the LiskSDK bug in ${file} `);
        fs.writeFileSync(file, newData, { encoding: 'utf8', flag: 'w' });
      }
    });
  }
});
