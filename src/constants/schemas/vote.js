export default {
  $id: 'lisk/dpos/vote',
  type: 'object',
  required: ['votes'],
  properties: {
    votes: {
      type: 'array',
      minItems: 1,
      maxItems: 20,
      items: {
        type: 'object',
        required: ['delegateAddress', 'amount'],
        properties: {
          delegateAddress: {
            dataType: 'bytes',
            fieldNumber: 1,
            minLength: 20,
            maxLength: 20,
          },
          amount: {
            dataType: 'sint64',
            fieldNumber: 2,
          },
        },
      },
      fieldNumber: 1,
    },
  },
};
