export const txStatusTypes = {
  multisigSignaturePartialSuccess: 'MULTISIG_SIGNATURE_PARTIAL_SUCCESS',
  multisigSignatureSuccess: 'MULTISIG_SIGNATURE_SUCCESS',
  signatureSuccess: 'SIGNATURE_SUCCESS',
  multisigBroadcastSuccess: 'MULTISIG_BROADCAST_SUCCESS',
  broadcastSuccess: 'BROADCAST_SUCCESS',
  signatureError: 'SIGNATURE_ERROR',
  broadcastError: 'BROADCAST_ERROR',
  hwCannotOpenPath: 'HW_CANNOT_OPEN_PATH',
  hwRejected: 'HW_REJECTED',
  hwMemorySizeLimitRejection: 'HW_MEMORY_SIZE_LIMIT_REJECTION',
  hwLiskAppClosed: 'HW_LISK_APP_CLOSED',
  hwDisconnected: 'HW_DISCONNECTED',
};

export const signatureCollectionStatus = {
  partiallySigned: 'partiallySigned',
  fullySigned: 'fullySigned',
  occupiedByOptionals: 'occupiedByOptionals',
  overSigned: 'overSigned',
};
