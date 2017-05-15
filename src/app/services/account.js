import lisk from 'lisk-js';

app.factory('Account', function ($rootScope) {
  this.account = {};

  const merge = (obj) => {
    const keys = Object.keys(obj);
    const changes = {};

    keys.forEach((key) => {
      changes[key] = {
        old: this.account[key],
        new: obj[key],
      };
      this.account[key] = obj[key];

      if (key === 'passphrase') {
        const kp = lisk.crypto.getKeys(obj[key]);

        changes.account = {
          old: this.account.publicKey,
          new: kp.publicKey,
        };
        this.account.publicKey = kp.publicKey;

        changes.address = { old: this.account.address };
        this.account.address = lisk.crypto.getAddress(kp.publicKey);
        changes.address.new = this.account.address;
      }

      // Calling listeners with the list of changes
      $rootScope.$broadcast('onAccountChange', changes);
    });
  };

  /**
   * Merged the existing account object with the given changes object.
   * For a given passphrase, it also sets address and publicKey.
   * Broadcasts an event from rootScope downwards containing changes.
   * 
   * @param {object} config - Changes to be applied to account object.
   * @returns {object} the account object after changes applied.
   *  for each key in changes: {key: [newValue, oldValue]}
   */
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
