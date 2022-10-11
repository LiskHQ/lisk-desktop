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
      tokenID: {
        dataType: 'Buffer', fieldNumber: 4, maxLength: 8, minLength: 8,
      },
    },
    required: ['amount', 'recipientAddress', 'data', 'tokenID'],
    title: 'Transfer transaction asset',
    type: 'object',
  },
  'auth:registerMultisignature': {
    $id: 'lisk/keys/register',
    type: 'object',
    required: [
      'numberOfSignatures',
      'optionalKeys',
      'mandatoryKeys',
      'signatures',
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
      signatures: {
        type: 'array',
        items: {
          dataType: 'bytes',
          minLength: 64,
          maxLength: 64,
        },
        fieldNumber: 4,
      },
    },
  },
  'dpos:registerDelegate': {
    $id: 'lisk/dpos/register',
    type: 'object',
    required: [
      'name', 'generatorKey', 'blsKey', 'proofOfPossession',
    ],
    properties: {
      name: {
        dataType: 'string',
        fieldNumber: 1,
        minLength: 1,
        maxLength: 20
      },
      generatorKey: {
        dataType: 'bytes',
        fieldNumber: 2,
        minLength: 32,
        maxLength: 32
      },
      blsKey: {
        dataType: 'bytes',
        fieldNumber: 3,
        minLength: 48,
        maxLength: 48
      },
      proofOfPossession: {
        dataType: 'bytes',
        fieldNumber: 4,
        minLength: 96,
        maxLength: 96
      }
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
