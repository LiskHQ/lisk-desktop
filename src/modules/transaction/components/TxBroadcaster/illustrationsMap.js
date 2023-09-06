import { txStatusTypes } from '@transaction/configuration/txStatus';

const illustrations = {
  default: {
    [txStatusTypes.signatureSuccess]: 'transactionPending',
    [txStatusTypes.broadcastSuccess]: 'transactionSuccess',
    [txStatusTypes.broadcastError]: 'transactionError',
    [txStatusTypes.signatureError]: 'transactionError',
    [txStatusTypes.hwRejected]: 'hwRejection',
    [txStatusTypes.hwDisconnected]: 'hwRejection',
    [txStatusTypes.hwLiskAppClosed]: 'hwRejection',
    [txStatusTypes.hwMemorySizeLimitRejection]: 'hwDataRejection',
  },
  stake: {
    [txStatusTypes.signatureSuccess]: 'stakingSuccess',
    [txStatusTypes.broadcastSuccess]: 'stakingSuccess',
    [txStatusTypes.broadcastError]: 'transactionError',
    [txStatusTypes.signatureError]: 'transactionError',
    [txStatusTypes.hwRejected]: 'hwRejection',
    [txStatusTypes.hwDisconnected]: 'hwRejection',
    [txStatusTypes.hwLiskAppClosed]: 'hwRejection',
  },
  registerMultisignature: {
    [txStatusTypes.signatureSuccess]: 'registerMultisignatureSuccess',
    [txStatusTypes.broadcastSuccess]: 'registerMultisignatureSuccess',
    [txStatusTypes.broadcastError]: 'registerMultisignatureError',
    [txStatusTypes.signatureError]: 'registerMultisignatureError',
    [txStatusTypes.hwRejected]: 'hwRejection',
    [txStatusTypes.hwDisconnected]: 'hwRejection',
    [txStatusTypes.hwLiskAppClosed]: 'hwRejection',
  },
  signMultisignature: {
    [txStatusTypes.multisigSignaturePartialSuccess]: 'multisignaturePartialSuccess',
    [txStatusTypes.multisigSignatureSuccess]: 'multisignaturePartialSuccess',
    [txStatusTypes.signatureSuccess]: 'registerMultisignatureSuccess',
    [txStatusTypes.signatureError]: 'registerMultisignatureError',
    [txStatusTypes.broadcastSuccess]: 'transactionSuccess',
    [txStatusTypes.broadcastError]: 'transactionError',
    [txStatusTypes.hwRejected]: 'hwRejection',
    [txStatusTypes.hwDisconnected]: 'hwRejection',
    [txStatusTypes.hwLiskAppClosed]: 'hwRejection',
  },
  registerValidator: {
    [txStatusTypes.broadcastSuccess]: 'validatorRegistrationSuccess',
    [txStatusTypes.broadcastError]: 'validatorRegistrationError',
  },
};

const getIllustration = (status, type) => {
  const name = illustrations[type][status];

  return name;
};

export default getIllustration;
