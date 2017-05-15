import lisk from 'lisk-js';

app.factory('Account', function ($rootScope) {
  this.account = {};

  const equals = (ref1, ref2) => {
    /* eslint-disable eqeqeq */

    if (ref1 == undefined && ref2 == undefined) {
      return true;
    }
    if (typeof ref1 !== typeof ref2 || (typeof ref1 !== 'object' && ref1 != ref2)) {
      return false;
    }

    const props1 = (ref1 instanceof Array) ? ref1.map((val, idx) => idx) : Object.keys(ref1).sort();
    const props2 = (ref2 instanceof Array) ? ref2.map((val, idx) => idx) : Object.keys(ref2).sort();

    let isEqual = true;

    props1.forEach((value1, index) => {
      if (typeof ref1[value1] === 'object' && typeof ref2[props2[index]] === 'object') {
        if (!equals(ref1[value1], ref2[props2[index]])) {
          isEqual = false;
        }
      } else if (ref1[value1] != ref2[props2[index]]) {
        isEqual = false;
      }
    });
    return isEqual;
  };

  const setChangedItem = (changes, property, value) => {
    if (!equals(this.account[property], value)) {
      changes[property] = [this.account[property], value];
    }
  };

  const merge = (obj) => {
    const keys = Object.keys(obj);
    let changes = {};

    keys.forEach((key) => {
      setChangedItem(changes, key, obj[key]);

      this.account[key] = obj[key];

      if (key === 'passphrase') {
        const kp = lisk.crypto.getKeys(obj[key]);
        setChangedItem(changes, 'publicKey', kp.publicKey);
        this.account.publicKey = kp.publicKey;

        const address = lisk.crypto.getAddress(kp.publicKey);
        setChangedItem(changes, 'address', address);
        this.account.address = address;
      }
    });

    // Calling listeners with the list of changes
    if (Object.keys(changes).length) {
      $rootScope.$broadcast('accountChange', changes);
      changes = {};
    }
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
