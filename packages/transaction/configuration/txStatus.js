export const txStatusTypes = {
  multisigSignaturePartialSuccess: 'MULTISIG_SIGNATURE_PARTIAL_SUCCESS',
  multisigSignatureSuccess: 'MULTISIG_SIGNATURE_SUCCESS',
  signatureSuccess: 'SIGNATURE_SUCCESS',
  multisigBroadcastSuccess: 'MULTISIG_BROADCAST_SUCCESS',
  broadcastSuccess: 'BROADCAST_SUCCESS',
  signatureError: 'SIGNATURE_ERROR',
  broadcastError: 'BROADCAST_ERROR',
  hwRejected: 'HW_REJECTED',
};

export const signatureCollectionStatus = {
  partiallySigned: 'partiallySigned',
  fullySigned: 'fullySigned',
  occupiedByOptionals: 'occupiedByOptionals',
  overSigned: 'overSigned',
};
