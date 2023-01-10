import { txStatusTypes } from '@transaction/configuration/txStatus';
import { getDeviceType } from '@wallet/utils/hwManager';

const illustrations = {
  default: {
    [txStatusTypes.signatureSuccess]: 'transactionPending',
    [txStatusTypes.broadcastSuccess]: 'transactionSuccess',
    [txStatusTypes.broadcastError]: 'transactionError',
    [txStatusTypes.signatureError]: 'transactionError',
    [txStatusTypes.hwRejected]: 'HwRejection',
  },
  stake: {
    [txStatusTypes.signatureSuccess]: 'stakingSuccess',
    [txStatusTypes.broadcastSuccess]: 'stakingSuccess',
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
  registerValidator: {
    [txStatusTypes.broadcastSuccess]: 'validatorRegistrationSuccess',
    [txStatusTypes.broadcastError]: 'validatorRegistrationSuccess',
  }
};

const getIllustration = (status, type, hwInfo) => {
  const name = illustrations[type][status];
  const deviceType = getDeviceType(hwInfo?.deviceModel);

  return status === txStatusTypes.hwRejected ? `${deviceType}${name}` : name;
};

export default getIllustration;
