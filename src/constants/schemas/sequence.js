export default {
  type: 'object',
  properties: {
    nonce: {
      fieldNumber: 1,
      dataType: 'uint64',
    },
  },
  default: {
    nonce: BigInt(0),
  },
};
