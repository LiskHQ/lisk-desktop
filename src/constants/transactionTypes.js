const transactionTypes = (t = str => str) => ({
  send: {
    code: 0,
    title: t('Send'),
    key: 'transfer',
  },
  setSecondPassphrase: {
    code: 1,
    title: t('Second passphrase registration'),
    key: 'secondPassphrase',
  },
  registerDelegate: {
    code: 2,
    title: t('Delegate registration'),
    key: 'registerDelegate',
  },
  vote: {
    code: 3,
    title: t('Delegate vote'),
    key: 'vote',
  },
  createMultiSig: {
    code: 4,
    title: t('Multisignature creation'),
    key: 'createMultiSig',
  },
});

/**
 * To get the transaction config for a given transaction code.
 *
 * @param {Number} transaction type code
 * @returns {Object} Returns the transaction config if the key is valid, else it return null
 */
transactionTypes.getByCode = (code) => {
  const types = transactionTypes();
  const key = Object.keys(types).filter(type => types[type].code === code);
  return key.length ? types[key] : null;
};

/**
 * To get the list of values for a given key
 * For example it returns [0, 1, 2, 3, 4] if called with 'code' against Core 3.x
 *
 * @param {String} transaction type code
 * @returns {Array} Returns the list of values for a given key
 */
transactionTypes.getListOf = (key) => {
  const types = transactionTypes();
  return Object.keys(types).map(type => types[type][key]);
};

export default transactionTypes;
