const fs = require('fs');
const glob = require('glob');
const Parser = require('i18next-scanner').Parser;

const translationFunctionNames = ['i18next.t', 'props.t', 'this.props.t', 't'];
const outputFilePath = './src/locales/en/common.json';

const translationsSource = JSON.parse(fs.readFileSync(outputFilePath, 'utf8'));

const parser = new Parser({
  keySeparator: '>',
  nsSeparator: '|',
});


const customHandler = function (key, options) {
  const value = translationsSource[key] || key;
  if (options.context) {
    key += `_${options.context}`;
  }
  parser.set(key, value);
  if (options.count !== undefined) {
    key = `${key}_plural`;
    parser.set(key, translationsSource[key] || '');
  }
};

const files = glob.sync('./src/**/*.js', {});
const electronFiles = glob.sync('./app/src/**/*.js', {});
[...files, ...electronFiles].forEach((file) => {
  const content = fs.readFileSync(file, 'utf-8');
  parser.parseFuncFromString(content, { list: translationFunctionNames }, customHandler);
});

const translations = parser.get({ sort: true }).en.translation;
const count = Object.keys(translations).length;
const outputJSON = JSON.stringify(translations, null, 2);
fs.writeFileSync(outputFilePath, `${outputJSON}\n`);
process.stdout.write(`${count} translation keys parsed and written to '${outputFilePath}'`);
