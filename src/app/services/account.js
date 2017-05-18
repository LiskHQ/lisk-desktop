import lisk from 'lisk-js';

/**
 * @description This factory provides methods to get and set basic informations and
 * statistics of the current client
 *
 * @memberOf app
 * @function Account
 */
app.factory('Account', function ($rootScope) {
  /**
   * @type Object
   */
  this.account = {};

  /**
   * Deep compare any two parameter for equality. if not a primary value,
   * compares all the members recursively checking if all primary value members are equal
   *
   * @private
   * @method equals
   * @param {any} ref1 - Value to compare equality
   * @param {any} ref2 - Value to compare equality
   * @returns {boolean} Whether two parameters are equal or not
   */
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

  /**
   * If the new value of the given property on the account is changed,
   * it sets the changed property with the values on a dictionary
   *
   * @private
   * @method setChangedItem
   * @param {Object} changes - The object to collect a dictionary of all the changes
   * @param {String} property - The name of the property to check if changed
   * @param {any} value - The new value of the property
   */
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

  /**
   * Merged the existing account object with the given changes object.
   * For a given passphrase, it also sets address and publicKey.
   * Broadcasts an event from rootScope downwards containing changes.
   *
   * @method set
   * @param {Object} config - Changes to be applied to account object.
   * @returns {object} the account object after changes applied.
   *  for each key in changes: {key: [newValue, oldValue]}
   */
  this.set = (config) => {
    merge(config);
    return this.account;
  };

  /**
   * Returns the dictionary of the account basic statistics
   *
   * @method get
   * @returns {object} The account dictionary
   */
  this.get = () => this.account;

  /**
   * Removes all the keys from the account but keeps the reference
   *
   * @method reset
   */
  this.reset = () => {
    const keys = Object.keys(this.account);
    keys.forEach((key) => {
      delete this.account[key];
    });
  };

  return this;
});
