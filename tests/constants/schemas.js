/* eslint-disable max-lines */

const moduleCommandSchemas = {
  'auth:registerMultisignature': {
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
    required: ['numberOfSignatures', 'mandatoryKeys', 'optionalKeys', 'signatures'],
  },
  'auth:paramsSchema': {
    $id: '/auth/command/regMultisigMsg',
    type: 'object',
    required: ['address', 'nonce', 'numberOfSignatures', 'mandatoryKeys', 'optionalKeys'],
    properties: {
      address: {
        dataType: 'bytes',
        fieldNumber: 1,
        minLength: 20,
        maxLength: 20,
      },
      nonce: {
        dataType: 'uint64',
        fieldNumber: 2,
      },
      numberOfSignatures: {
        dataType: 'uint32',
        fieldNumber: 3,
      },
      mandatoryKeys: {
        type: 'array',
        items: {
          dataType: 'bytes',
          minLength: 32,
          maxLength: 32,
        },
        fieldNumber: 4,
      },
      optionalKeys: {
        type: 'array',
        items: {
          dataType: 'bytes',
          minLength: 32,
          maxLength: 32,
        },
        fieldNumber: 5,
      },
    },
  },
  'pos:unlock': {
    $id: '/lisk/empty',
    type: 'object',
    properties: {},
  },
  'pos:registerValidator': {
    $id: '/pos/command/registerValidatorParams',
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
  'pos:reportValidatorMisbehavior': {
    $id: '/pos/command/reportValidatorMisbehaviorParams',
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
  'pos:updateGeneratorKey': {
    $id: '/pos/command/updateGeneratorKeyParams',
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
  'pos:stakeValidator': {
    $id: '/pos/command/stakeValidatorParams',
    type: 'object',
    required: ['stakes'],
    properties: {
      stakes: {
        type: 'array',
        fieldNumber: 1,
        minItems: 1,
        maxItems: 20,
        items: {
          type: 'object',
          required: ['validatorAddress', 'amount'],
          properties: {
            validatorAddress: {
              dataType: 'bytes',
              fieldNumber: 1,
              format: 'lisk32',
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
  'interoperability:mainchainRegistration': {
    $id: '/modules/interoperability/sidechain/mainchainRegistration',
    type: 'object',
    required: ['ownChainID', 'ownName', 'mainchainValidators', 'signature', 'aggregationBits'],
    properties: {
      ownChainID: {
        dataType: 'bytes',
        fieldNumber: 1,
        minLength: 4,
        maxLength: 4,
      },
      ownName: {
        dataType: 'string',
        fieldNumber: 2,
        minLength: 1,
        maxLength: 40,
      },
      mainchainValidators: {
        type: 'array',
        fieldNumber: 3,
        items: {
          type: 'object',
          required: ['blsKey', 'bftWeight'],
          properties: {
            blsKey: {
              dataType: 'bytes',
              fieldNumber: 1,
              minLength: 48,
              maxLength: 48,
            },
            bftWeight: {
              dataType: 'uint64',
              fieldNumber: 2,
            },
          },
        },
        minItems: 101,
        maxItems: 101,
      },
      signature: {
        dataType: 'bytes',
        fieldNumber: 4,
        minItems: 96,
        maxItems: 96,
      },
      aggregationBits: {
        dataType: 'bytes',
        fieldNumber: 5,
      },
    },
  },
  'legacy:reclaimLSK': {
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
  'legacy:registerKeys': {
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
  'token:transfer': {
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
        format: 'lisk32',
      },
      data: {
        dataType: 'string',
        fieldNumber: 4,
        minLength: 0,
        maxLength: 64,
      },
    },
  },
  'token:crossChaintransfer': {
    $id: '/lisk/ccTransferParams',
    type: 'object',
    required: ['tokenID', 'amount', 'receivingChainID', 'recipientAddress', 'data', 'messageFee'],
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
        format: 'lisk32',
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
};

export default moduleCommandSchemas;
