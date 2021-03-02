/**
 * Returns details of the transaction types
 */
const transactionTypes = (t = str => str) => ({
  transfer: {
    code: {
      legacy: 0,
      new: 8,
    },
    outgoingCode: 8,
    title: t('Send'),
    senderLabel: t('Sender'),
    key: 'transfer',
    nameFee: 0,
    hardCap: 1e7, // rawLSK
  },
  registerDelegate: {
    code: {
      legacy: 2,
      new: 10,
    },
    outgoingCode: 10,
    title: t('Delegate registration'),
    senderLabel: t('Account nickname'),
    key: 'registerDelegate',
    nameFee: 1e9,
    hardCap: 25e8, // rawLSK
  },
  vote: {
    code: {
      legacy: 3,
      new: 13,
    },
    outgoingCode: 13,
    title: t('Delegate vote'),
    senderLabel: t('Voter'),
    key: 'vote',
    nameFee: 0,
    hardCap: 1e8, // rawLSK
  },
  createMultiSig: {
    code: {
      legacy: 4,
      new: 12,
    },
    outgoingCode: 12,
    title: t('Multisignature creation'),
    senderLabel: t('Registrant'),
    key: 'createMultiSig',
    nameFee: 0,
    hardCap: 5e8, // rawLSK
  },
  unlockToken: {
    code: {
      legacy: 5,
      new: 14,
    },
    outgoingCode: 14,
    title: t('Unlock LSK'),
    senderLabel: t('Sender'),
    key: 'unlockToken',
    nameFee: 0,
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

  if (typeof code === 'string' && types[code]) {
    return types[code];
  }
  const key = Object.keys(types)
    .filter(type => (
      types[type].code.legacy === code
      || types[type].code.new === code
    ));
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

/**
 * gets the name fee for a transaction type
 *
 * @param {key} key the transaction type
 * @returns {number} transaction name fee
 */
transactionTypes.getNameFee = (key) => {
  const types = transactionTypes();
  return types[key].nameFee;
};

/**
 * gets the hard cap for a transaction type
 *
 * @param {key} key the transaction type
 * @returns {number} transaction hard cap
 */
transactionTypes.getHardCap = (key) => {
  const types = transactionTypes();
  return types[key].hardCap;
};

export const byteSizes = {
  type: 1,
  nonce: 8,
  fee: 8,
  signature: 64,
};

export const minFeePerByte = 1000;

export default transactionTypes;
