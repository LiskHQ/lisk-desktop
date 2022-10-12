// eslint-disable-next-line import/prefer-default-export
export const mockCommandParametersSchemas = {
  data: [
    {
      moduleCommandID: '00000002:00000000',
      moduleCommand: 'token:transfer',
      schema: {
        $id: '/lisk/transferParams',
        title: 'Transfer transaction params',
        type: 'object',
        required: ['tokenID', 'amount', 'recipientAddress', 'data'],
        properties: {
          tokenID: {
            dataType: 'bytes',
            fieldNumber: 1,
            minLength: 8,
            maxLength: 8,
          },
          amount: {
            dataType: 'uint64',
            fieldNumber: 2,
          },
          recipientAddress: {
            dataType: 'bytes',
            fieldNumber: 3,
            minLength: 20,
            maxLength: 20,
          },
          data: {
            dataType: 'string',
            fieldNumber: 4,
            minLength: 0,
            maxLength: 64,
          },
        },
      },
    },
    {
      moduleCommandID: '00000002:00000000',
      moduleCommand: 'token:crossChaintransfer',
      schema: {
        $id: '/lisk/ccTransferParams',
        type: 'object',
        required: [
          'tokenID',
          'amount',
          'receivingChainID',
          'recipientAddress',
          'data',
          'messageFee',
        ],
        properties: {
          tokenID: {
            dataType: 'bytes',
            fieldNumber: 1,
            minLength: 8,
            maxLength: 8,
          },
          amount: {
            dataType: 'uint64',
            fieldNumber: 2,
          },
          receivingChainID: {
            dataType: 'bytes',
            fieldNumber: 3,
            minLength: 4,
            maxLength: 4,
          },
          recipientAddress: {
            dataType: 'bytes',
            fieldNumber: 4,
            minLength: 20,
            maxLength: 20,
          },
          data: {
            dataType: 'string',
            fieldNumber: 5,
            minLength: 0,
            maxLength: 64,
          },
          messageFee: {
            dataType: 'uint64',
            fieldNumber: 6,
          },
        },
      },
    },
    {
      moduleCommandID: '0000000c:00000000',
      moduleCommand: 'auth:registerMultisignature',
      schema: {
        $id: '/auth/command/regMultisig',
        type: 'object',
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
        required: ['numberOfSignatures', 'mandatoryKeys', 'optionalKeys'],
      },
    },
    {
      moduleCommandID: '0000000d:00000000',
      moduleCommand: 'dpos:registerDelegate',
      schema: {
        $id: '/dpos/command/registerDelegateParams',
        type: 'object',
        required: ['name', 'generatorKey', 'blsKey', 'proofOfPossession'],
        properties: {
          name: {
            dataType: 'string',
            fieldNumber: 1,
            minLength: 1,
            maxLength: 20,
          },
          generatorKey: {
            dataType: 'bytes',
            fieldNumber: 2,
            minLength: 32,
            maxLength: 32,
          },
          blsKey: {
            dataType: 'bytes',
            fieldNumber: 3,
            minLength: 48,
            maxLength: 48,
          },
          proofOfPossession: {
            dataType: 'bytes',
            fieldNumber: 4,
            minLength: 96,
            maxLength: 96,
          },
        },
      },
    },
    {
      moduleCommandID: '0000000d:00000003',
      moduleCommand: 'dpos:reportDelegateMisbehavior',
      schema: {
        $id: '/dpos/command/reportDelegateMisbehaviorParams',
        type: 'object',
        required: ['header1', 'header2'],
        properties: {
          header1: {
            dataType: 'bytes',
            fieldNumber: 1,
          },
          header2: {
            dataType: 'bytes',
            fieldNumber: 2,
          },
        },
      },
    },
    {
      moduleCommandID: '0000000d:00000002',
      moduleCommand: 'dpos:unlockToken',
    },
    {
      moduleCommandID: '0000000d:00000004',
      moduleCommand: 'dpos:updateGeneratorKey',
      schema: {
        $id: '/dpos/command/updateGeneratorKeyParams',
        type: 'object',
        required: ['generatorKey'],
        properties: {
          generatorKey: {
            dataType: 'bytes',
            fieldNumber: 1,
            minLength: 32,
            maxLength: 32,
          },
        },
      },
    },
    {
      moduleCommandID: '0000000d:00000001',
      moduleCommand: 'dpos:voteDelegate',
      schema: {
        $id: '/dpos/command/voteDelegateParams',
        type: 'object',
        required: ['votes'],
        properties: {
          votes: {
            type: 'array',
            fieldNumber: 1,
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
          },
        },
      },
    },
    {
      moduleCommandID: '00008000:00000000',
      moduleCommand: 'legacy:reclaimLSK',
      schema: {
        $id: 'lisk/legacy/reclaim',
        type: 'object',
        required: ['amount'],
        properties: {
          amount: {
            dataType: 'uint64',
            fieldNumber: 1,
          },
        },
      },
    },
    {
      moduleCommandID: '00008000:00000001',
      moduleCommand: 'legacy:registerkeys',
      schema: {
        $id: 'lisk/legacy/registerKeys',
        type: 'object',
        required: ['blsKey', 'proofOfPossession', 'generatorKey'],
        properties: {
          blsKey: {
            dataType: 'bytes',
            minLength: 48,
            maxLength: 48,
            fieldNumber: 1,
          },
          proofOfPossession: {
            dataType: 'bytes',
            minLength: 96,
            maxLength: 96,
            fieldNumber: 2,
          },
          generatorKey: {
            dataType: 'bytes',
            minLength: 32,
            maxLength: 32,
            fieldNumber: 3,
          },
        },
      },
    },
  ],
  meta: {
    count: 10,
    offset: 0,
    total: 10,
  },
};
