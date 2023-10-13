exports.default = async function (configuration) {
  if (configuration.path) {
    require('child_process').execSync(
      `smctl sign --keypair-alias="${String(
        configuration.options.certificateSubjectName
      )}" --input "${String(configuration.path)}"`,
      {
        stdio: 'inherit',
      }
    );
  }
};
