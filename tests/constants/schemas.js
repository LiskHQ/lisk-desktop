/* eslint-disable max-lines */

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
        dataType: 'bytes', fieldNumber: 4, maxLength: 8, minLength: 8,
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
    "auth:registerMultisignature": {
      $id: "/auth/command/regMultisig",
      type: "object",
      properties: {
        numberOfSignatures: {
          dataType: "uint32",
          fieldNumber: 1,
          minimum: 1,
          maximum: 64,
        },
        mandatoryKeys: {
          type: "array",
          items: {
            dataType: "bytes",
            minLength: 32,
            maxLength: 32,
          },
          fieldNumber: 2,
          minItems: 0,
          maxItems: 64,
        },
        optionalKeys: {
          type: "array",
          items: {
            dataType: "bytes",
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
    },
    "dpos:registerDelegate": {
      $id: "/dpos/command/registerDelegateParams",
      type: "object",
      required: ["name", "generatorKey", "blsKey", "proofOfPossession"],
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
      generatorKey: {
        dataType: "bytes",
        fieldNumber: 2,
        minLength: 32,
        maxLength: 32,
      },
      blsKey: {
        dataType: "bytes",
        fieldNumber: 3,
        minLength: 48,
        maxLength: 48,
      },
      proofOfPossession: {
        dataType: "bytes",
        fieldNumber: 4,
        minLength: 96,
        maxLength: 96,
      },
    },
  },
  "dpos:reportDelegateMisbehavior": {
    $id: "/dpos/command/reportDelegateMisbehaviorParams",
    type: "object",
    required: ["header1", "header2"],
    properties: {
      header1: {
        dataType: "bytes",
        fieldNumber: 1,
      },
      header2: {
        dataType: "bytes",
        fieldNumber: 2,
      },
    },
  },
  "dpos:updateGeneratorKey": {
    $id: "/dpos/command/updateGeneratorKeyParams",
    type: "object",
    required: ["generatorKey"],
    properties: {
      generatorKey: {
        dataType: "bytes",
        fieldNumber: 1,
        minLength: 32,
        maxLength: 32,
      },
    },
  },
  "dpos:voteDelegate": {
    $id: "/dpos/command/voteDelegateParams",
    type: "object",
    required: ["votes"],
    properties: {
      votes: {
        type: "array",
        fieldNumber: 1,
        minItems: 1,
        maxItems: 20,
        items: {
          type: "object",
          required: ["delegateAddress", "amount"],
          properties: {
            delegateAddress: {
              dataType: "bytes",
              fieldNumber: 1,
              format: "lisk32",
            },
            amount: {
              dataType: "sint64",
              fieldNumber: 2,
            },
          },
        },
      },
    },
  },
  "interoperability:mainchainRegistration": {
    $id: "/modules/interoperability/sidechain/mainchainRegistration",
    type: "object",
    required: [
      "ownChainID",
      "ownName",
      "mainchainValidators",
      "signature",
      "aggregationBits",
    ],
    properties: {
      ownChainID: {
        dataType: "bytes",
        fieldNumber: 1,
        minLength: 4,
        maxLength: 4,
      },
      ownName: {
        dataType: "string",
        fieldNumber: 2,
        minLength: 1,
        maxLength: 40,
      },
      mainchainValidators: {
        type: "array",
        fieldNumber: 3,
        items: {
          type: "object",
          required: ["blsKey", "bftWeight"],
          properties: {
            blsKey: {
              dataType: "bytes",
              fieldNumber: 1,
              minLength: 48,
              maxLength: 48,
            },
            bftWeight: {
              dataType: "uint64",
              fieldNumber: 2,
            },
          },
        },
        minItems: 101,
        maxItems: 101,
      },
      signature: {
        dataType: "bytes",
        fieldNumber: 4,
        minItems: 96,
        maxItems: 96,
      },
      aggregationBits: {
        dataType: "bytes",
        fieldNumber: 5,
      },
    },
  },
  "legacy:reclaim": {
    $id: "lisk/legacy/reclaim",
    type: "object",
    required: ["amount"],
    properties: {
      amount: {
        dataType: "uint64",
        fieldNumber: 1,
      },
    },
  },
  "legacy:registerKeys": {
    $id: "lisk/legacy/registerKeys",
    type: "object",
    required: ["blsKey", "proofOfPossession", "generatorKey"],
    properties: {
      blsKey: {
        dataType: "bytes",
        minLength: 48,
        maxLength: 48,
        fieldNumber: 1,
      },
      proofOfPossession: {
        dataType: "bytes",
        minLength: 96,
        maxLength: 96,
        fieldNumber: 2,
      },
      generatorKey: {
        dataType: "bytes",
        minLength: 32,
        maxLength: 32,
        fieldNumber: 3,
      },
    },
  },
};

export default moduleCommandSchemas;
