const fs = require('fs');
const glob = require('glob');
const Parser = require('i18next-scanner').Parser;

function i18nScanner(params) {
  const parser = new Parser({
    keySeparator: '>',
    nsSeparator: '|',
  });

  const sourceJSON = fs.readFileSync(params.outputFilePath, 'utf8');
  let translationsSource;
  try {
    translationsSource = JSON.parse(sourceJSON);
  } catch (e) {
    process.stderr.write(`i18nScanner: ${e}\n`);
    return;
  }

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

  params.files.map(filePattern => glob.sync(filePattern, {}))
    .reduce(((accumulator, files) => [...accumulator, ...files]), [])
    .forEach((file) => {
      const content = fs.readFileSync(file, 'utf-8');
      parser.parseFuncFromString(content, { list: params.translationFunctionNames }, customHandler);
    });

  const translations = parser.get({ sort: true }).en.translation;
  const count = Object.keys(translations).length;
  const outputJSON = `${JSON.stringify(translations, null, 2)}\n`;
  if (outputJSON !== sourceJSON) {
    fs.writeFileSync(params.outputFilePath, outputJSON);
    process.stdout.write(`i18nScanner: ${count} translation keys parsed and written to '${params.outputFilePath}'\n`);
  }
}

class I18nScannerPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      i18nScanner(this.options);
      callback();
    });
  }
}

module.exports = I18nScannerPlugin;
