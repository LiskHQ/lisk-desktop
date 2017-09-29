const fs = require('fs');
const glob = require('glob');
const Parser = require('i18next-scanner').Parser;

const translationFunctionNames = ['i18next.t', 'props.t', 'this.props.t', 't'];
const outputFilePath = './src/locales/en/common.json';

const parser = new Parser({
  keySeparator: '>',
  nsSeparator: '|',
});


const customHandler = function (key, options) {
  const value = key;
  if (options.context) {
    key += `_${options.context}`;
  }
  parser.set(key, value);
  if (options.count !== undefined) {
    parser.set(`${key}_plural`);
  }
};

const files = glob.sync('./src/**/*.js', {});
files.forEach((file) => {
  const content = fs.readFileSync(file, 'utf-8');
  parser.parseFuncFromString(content, { list: translationFunctionNames }, customHandler);
});

const translations = parser.get({ sort: true }).en.translation;
const count = Object.keys(translations).length;
const outputJSON = JSON.stringify(translations, null, 2);
fs.writeFileSync(outputFilePath, `${outputJSON}\n`);
process.stdout.write(`${count} translation keys parsed and written to '${outputFilePath}'`);
