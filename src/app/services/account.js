import lisk from 'lisk-js';

app.factory('Account', function ($rootScope) {
  this.account = {};

  const merge = (obj) => {
    const keys = Object.keys(obj);
    keys.forEach((key) => {
      this.account[key] = obj[key];

      if (key === 'passphrase') {
        const kp = lisk.crypto.getKeys(obj[key]);
        this.account.publicKey = kp.publicKey;
        this.account.address = lisk.crypto.getAddress(kp.publicKey);
      }

      // calling listeners with the list of changes
      $rootScope.$broadcast('onAccountChange', {});
    });
  };

  this.set = (config) => {
    merge(config);
    return this.account;
  };

  this.get = () => this.account;

  this.reset = () => {
    const keys = Object.keys(this.account);
    keys.forEach((key) => {
      delete this.account[key];
    });
  };

  return this;
});
