export default {
  $id: 'lisk/dpos/unlock',
  type: 'object',
  required: ['unlockObjects'],
  properties: {
    unlockObjects: {
      type: 'array',
      minItems: 1,
      maxItems: 20,
      items: {
        type: 'object',
        required: ['delegateAddress', 'amount', 'unvoteHeight'],
        properties: {
          delegateAddress: {
            dataType: 'bytes',
            fieldNumber: 1,
            minLength: 20,
            maxLength: 20,
          },
          amount: {
            dataType: 'uint64',
            fieldNumber: 2,
          },
          unvoteHeight: {
            dataType: 'uint32',
            fieldNumber: 3,
          },
        },
      },
      fieldNumber: 1,
    },
  },
};
