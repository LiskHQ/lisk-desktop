const moduleCommandSchemas = {
  'token:transfer': {
    $id: 'lisk/transfer-asset',
    properties: {
      amount: { dataType: 'uint64', fieldNumber: 1 },
      recipientAddress: {
        dataType: 'bytes', fieldNumber: 2, maxLength: 20, minLength: 20,
      },
      data: {
        dataType: 'string', fieldNumber: 3, maxLength: 64, minLength: 0,
      },
    },
    required: ['amount', 'recipientAddress', 'data'],
    title: 'Transfer transaction asset',
    type: 'object',
  },
  'auth:registerMultisignatureGroup': {
    $id: 'lisk/keys/register',
    type: 'object',
    required: [
      'numberOfSignatures',
      'optionalKeys',
      'mandatoryKeys',
    ],
    properties: {
      numberOfSignatures: {
        dataType: 'uint32',
        fieldNumber: 1,
        minimum: 1,
        maximum: 64,
      },
      mandatoryKeys: {
        type: 'array',
        items: {
          dataType: 'bytes',
          minLength: 32,
          maxLength: 32,
        },
        fieldNumber: 2,
        minItems: 0,
        maxItems: 64,
      },
      optionalKeys: {
        type: 'array',
        items: {
          dataType: 'bytes',
          minLength: 32,
          maxLength: 32,
        },
        fieldNumber: 3,
        minItems: 0,
        maxItems: 64,
      },
    },
  },
  'dpos:registerDelegate': {
    $id: 'lisk/dpos/register',
    type: 'object',
    required: [
      'username',
    ],
    properties: {
      username: {
        dataType: 'string',
        fieldNumber: 1,
        minLength: 1,
        maxLength: 20,
      },
    },
  },
  'dpos:voteDelegate': {
    $id: 'lisk/dpos/vote',
    type: 'object',
    required: [
      'votes',
    ],
    properties: {
      votes: {
        type: 'array',
        minItems: 1,
        maxItems: 20,
        items: {
          type: 'object',
          required: [
            'delegateAddress',
            'amount',
          ],
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
  },
  'dpos:unlock': {
    $id: 'lisk/dpos/unlock',
    type: 'object',
    required: [
      'unlockObjects',
    ],
    properties: {
      unlockObjects: {
        type: 'array',
        minItems: 1,
        maxItems: 20,
        items: {
          type: 'object',
          required: [
            'delegateAddress',
            'amount',
            'unvoteHeight',
          ],
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
  },
  'legacy:reclaim': {
    $id: 'lisk/legacyAccount/reclaim',
    title: 'Reclaim transaction asset',
    type: 'object',
    required: [
      'amount',
    ],
    properties: {
      amount: {
        dataType: 'uint64',
        fieldNumber: 1,
      },
    },
  },
};

export default moduleCommandSchemas;
