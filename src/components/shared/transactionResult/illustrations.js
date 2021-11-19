import { txStatusTypes } from './statusConfig';

const getDeviceType = (deviceModel = '') => {
  if (/ledger/i.test(deviceModel)) {
    return 'ledgerNano';
  }
  if (/trezor/i.test(deviceModel)) {
    return 'trezor';
  }
  return '';
};

const illustrations = {
  default: {
    [txStatusTypes.signatureSuccess]: 'transactionPending',
    [txStatusTypes.broadcastSuccess]: 'transactionSuccess',
    [txStatusTypes.broadcastError]: 'transactionError',
    [txStatusTypes.signatureError]: 'transactionError',
    [txStatusTypes.hwRejected]: 'HwRejection',
  },
  vote: {
    [txStatusTypes.signatureSuccess]: 'votingSuccess',
    [txStatusTypes.broadcastSuccess]: 'votingSuccess',
    [txStatusTypes.broadcastError]: 'transactionError',
    [txStatusTypes.signatureError]: 'transactionError',
    [txStatusTypes.hwRejected]: 'HwRejection',
  },
  registerMultisignature: {
    [txStatusTypes.signatureSuccess]: 'registerMultisignatureSuccess',
    [txStatusTypes.broadcastSuccess]: 'registerMultisignatureSuccess',
    [txStatusTypes.broadcastError]: 'registerMultisignatureError',
    [txStatusTypes.signatureError]: 'registerMultisignatureError',
    [txStatusTypes.hwRejected]: 'HwRejection',
  },
  signMultisignature: {
    [txStatusTypes.multisigSignaturePartialSuccess]: 'multisignaturePartialSuccess',
    [txStatusTypes.multisigSignatureSuccess]: 'multisignaturePartialSuccess',
    [txStatusTypes.signatureSuccess]: 'registerMultisignatureSuccess',
    [txStatusTypes.signatureError]: 'registerMultisignatureError',
    [txStatusTypes.broadcastSuccess]: 'transactionSuccess',
    [txStatusTypes.broadcastError]: 'transactionError',
    [txStatusTypes.hwRejected]: 'HwRejection',
  },
};

const getIllustration = (status, type, hwInfo) => {
  const name = illustrations[type][status];
  const deviceType = getDeviceType(hwInfo?.deviceModel);

  return `${deviceType}${name}`;
};

export default getIllustration;
