/* eslint-disable max-lines */
export const mockCommandParametersSchemas = {
  data: [
    {
      moduleCommand: "auth:registerMultisignature",
      schema: {
        $id: "/auth/command/regMultisig",
        type: "object",
        properties: {
          numberOfSignatures: {
            dataType: "uint32",
            fieldNumber: 1,
            minimum: 1,
            maximum: 64
          },
          mandatoryKeys: {
            type: "array",
            items: {
              dataType: "bytes",
              minLength: 32,
              maxLength: 32
            },
            fieldNumber: 2,
            minItems: 0,
            maxItems: 64
          },
          optionalKeys: {
            type: "array",
            items: {
              dataType: "bytes",
              minLength: 32,
              maxLength: 32
            },
            fieldNumber: 3,
            minItems: 0,
            maxItems: 64
          },
          signatures: {
            type: "array",
            items: {
              dataType: "bytes",
              minLength: 64,
              maxLength: 64
            },
            fieldNumber: 4
          }
        },
        required: [
          "numberOfSignatures",
          "mandatoryKeys",
          "optionalKeys",
          "signatures"
        ]
      }
    },
    {
      moduleCommand: "legacy:reclaimLSK",
      schema: {
        $id: "lisk/legacy/reclaimLSK",
        type: "object",
        required: [
          "amount"
        ],
        properties: {
          amount: {
            dataType: "uint64",
            fieldNumber: 1
          }
        }
      }
    },
    {
      moduleCommand: "pos:registerValidator",
      schema: {
        $id: "/pos/command/registerValidatorParams",
        type: "object",
        required: [
          "name",
          "blsKey",
          "proofOfPossession",
          "generatorKey"
        ],
        properties: {
          name: {
            dataType: "string",
            fieldNumber: 1
          },
          blsKey: {
            dataType: "bytes",
            minLength: 48,
            maxLength: 48,
            fieldNumber: 2
          },
          proofOfPossession: {
            dataType: "bytes",
            minLength: 96,
            maxLength: 96,
            fieldNumber: 3
          },
          generatorKey: {
            dataType: "bytes",
            minLength: 32,
            maxLength: 32,
            fieldNumber: 4
          }
        }
      }
    },
    {
      moduleCommand: "pos:reportMisbehavior",
      schema: {
        $id: "/pos/command/reportMisbehaviorParams",
        type: "object",
        required: [
          "header1",
          "header2"
        ],
        properties: {
          header1: {
            dataType: "bytes",
            fieldNumber: 1
          },
          header2: {
            dataType: "bytes",
            fieldNumber: 2
          }
        }
      }
    },
    {
      moduleCommand: "pos:unlock"
    },
    {
      moduleCommand: "pos:stake",
      schema: {
        $id: "/pos/command/stakeValidatorParams",
        type: "object",
        required: [
          "stakes"
        ],
        properties: {
          stakes: {
            type: "array",
            fieldNumber: 1,
            minItems: 1,
            maxItems: 20,
            items: {
              type: "object",
              required: [
                "validatorAddress",
                "amount"
              ],
              properties: {
                validatorAddress: {
                  dataType: "bytes",
                  fieldNumber: 1,
                  format: "lisk32"
                },
                amount: {
                  dataType: "sint64",
                  fieldNumber: 2
                }
              }
            }
          }
        }
      }
    },
    {
      moduleCommand: "pos:changeCommission",
      schema: {
        $id: "/pos/command/changeCommissionCommandParams",
        type: "object",
        required: [
          "newCommission"
        ],
        properties: {
          newCommission: {
            dataType: "uint32",
            fieldNumber: 1,
            maximum: 10000
          }
        }
      }
    },
    {
      moduleCommand: "pos:claimRewards"
    },
    {
      moduleCommand: "token:transfer",
      schema: {
        $id: "/lisk/transferParams",
        title: "Transfer transaction params",
        type: "object",
        required: [
          "tokenID",
          "amount",
          "recipientAddress",
          "data"
        ],
        properties: {
          tokenID: {
            dataType: "bytes",
            fieldNumber: 1,
            minLength: 8,
            maxLength: 8
          },
          amount: {
            dataType: "uint64",
            fieldNumber: 2
          },
          recipientAddress: {
            dataType: "bytes",
            fieldNumber: 3,
            format: "lisk32"
          },
          data: {
            dataType: "string",
            fieldNumber: 4,
            minLength: 0,
            maxLength: 64
          }
        }
      }
    },
    {
      moduleCommand: "token:crossChainTransfer",
      schema: {
        $id: "/lisk/ccTransferParams",
        type: "object",
        required: [
          "tokenID",
          "amount",
          "receivingChainID",
          "recipientAddress",
          "data",
          "messageFee"
        ],
        properties: {
          tokenID: {
            dataType: "bytes",
            fieldNumber: 1,
            minLength: 8,
            maxLength: 8
          },
          amount: {
            dataType: "uint64",
            fieldNumber: 2
          },
          receivingChainID: {
            dataType: "bytes",
            fieldNumber: 3,
            minLength: 4,
            maxLength: 4
          },
          recipientAddress: {
            dataType: "bytes",
            fieldNumber: 4,
            format: "lisk32"
          },
          data: {
            dataType: "string",
            fieldNumber: 5,
            minLength: 0,
            maxLength: 64
          },
          messageFee: {
            dataType: "uint64",
            fieldNumber: 6
          }
        }
      }
    }
  ],
  meta: {
    count: 10,
    offset: 0,
    total: 10,
  },
};


