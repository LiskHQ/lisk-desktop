exports.default = async function (configuration) {
  if (configuration.path) {
    require('child_process').execSync(
      `smctl sign --keypair-alias="${String(configuration.options.keyPairAlias)}" --input "${String(
        configuration.path
      )}"`,
      {
        stdio: 'inherit',
      }
    );
  }
};
