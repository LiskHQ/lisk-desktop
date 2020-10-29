import transactionTypes from '../../../../constants/transactionTypes';

const signatureSchema = {
  publicKey: param => typeof param === 'string',
  accountId: param => typeof param === 'string',
  signature: param => typeof param === 'string',
  accountRole: param => typeof param === 'string',
};

const assetSchema = {
  amount: param => typeof param === 'string',
  recipientId: param => typeof param === 'string',
  data: param => typeof param === 'string',
  mandatoryKeys: (param) => {
    if (!Array.isArray(param)) return false;
    const error = param.find(key => typeof key !== 'string');
    return error === undefined;
  },
  optionalKeys: (param) => {
    if (!Array.isArray(param)) return false;
    const error = param.find(key => typeof key !== 'string');
    return error === undefined;
  },
  numberOfSignatures: param => parseInt(param, 10),
};

const txSchema = {
  nonce: param => parseInt(param, 10),
  fee: param => parseInt(param, 10),
  type: param => param === transactionTypes().transfer.code.new,
  lsTrackingId: param => typeof param === 'string',
  senderPublicKey: param => typeof param === 'string',
  signatures: (param) => {
    if (!Array.isArray(param)) return false;
    const error = param.find((signature) => {
      const itemError = Object
        .keys(signatureSchema)
        .find(key => !signatureSchema[key](signature[key]));
      return itemError !== undefined;
    });
    return error === undefined;
  },
  asset: (param) => {
    const error = Object
      .keys(assetSchema)
      .find(key => !assetSchema[key](param[key]));

    return error === undefined;
  },
};

export default (object) => {
  const error = Object
    .keys(txSchema)
    .find(key => !txSchema[key](object[key]));
  return error === undefined;
};
