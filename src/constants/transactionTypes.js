/**
 * Returns details of the transaction types
 *
 * @todo Starting Lisk Desktop 2.0.0 we should
 * remove the version detection logic
 * and simply assume we always receive the new layout
 * but transactions may have either of the tx type codes.
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
  setSecondPassphrase: {
    code: {
      legacy: 1,
      new: 9,
    },
    outgoingCode: 9,
    title: t('Second passphrase registration'),
    senderLabel: t('Account'),
    key: 'secondPassphrase',
    icon: 'tx2ndPassphrase',
    nameFee: 0,
    hardCap: 5e8, // rawLSK
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
    icon: 'txDelegate',
    nameFee: 1e9,
    hardCap: 25e8, // rawLSK
  },
  vote: {
    code: {
      legacy: 3,
      new: 13,
    },
    outgoingCode: 11,
    title: t('Delegate vote'),
    senderLabel: t('Voter'),
    key: 'castVotes',
    icon: 'txVote',
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
    icon: 'signMultiSignatureTransaction',
    nameFee: 0,
    hardCap: 5e8, // rawLSK
  },
  unlock: {
    code: {
      legacy: 5,
      new: 14,
    },
    outgoingCode: 14,
    title: t('Unlock LSK'),
    senderLabel: t('Sender'),
    key: 'unlock',
    icon: 'txUnlock',
    nameFee: 0,
  },
  unlock: {
    code: {
      legacy: 5,
      new: 14,
    },
    outgoingCode: 14,
    title: t('Unlock LSK'),
    senderLabel: t('Sender'),
    key: 'unlock',
    icon: 'txUnlock',
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
  const key = Object.keys(types)
    .filter(type => (
      types[type].code.legacy === code || types[type].code.new === code
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
