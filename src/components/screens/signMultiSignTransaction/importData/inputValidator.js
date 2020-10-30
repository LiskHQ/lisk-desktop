import Lisk from '@liskhq/lisk-client';

export default (object) => {
  const id = object.id || object.lsTrackingId;
  const signatures = Array.isArray(object.signatures) && object.signatures.map((signature) => {
    if (typeof signature === 'string') {
      return signature;
    }
    return signature.signature;
  });
  const validation = Lisk.transaction.utils.validateMultisignatures(
    object.asset && [...object.asset.mandatoryKeys, ...object.asset.optionalKeys],
    signatures,
    object.asset && object.asset.numberOfSignatures,
    Buffer.from(JSON.stringify(object)),
    id,
  );
  return validation;
};
