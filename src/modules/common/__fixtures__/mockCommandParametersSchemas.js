/* eslint-disable max-lines */
export const mockCommandParametersSchemas = {
  data: {
    block: {
      schema: {
        $id: '/block',
        type: 'object',
        properties: {
          header: {
            dataType: 'bytes',
            fieldNumber: 1,
          },
          transactions: {
            type: 'array',
            items: {
              dataType: 'bytes',
            },
            fieldNumber: 2,
          },
          assets: {
            type: 'array',
            items: {
              dataType: 'bytes',
            },
            fieldNumber: 3,
          },
        },
        required: ['header', 'transactions', 'assets'],
      },
    },
    header: {
      schema: {
        $id: '/block/header/3',
        type: 'object',
        properties: {
          version: {
            dataType: 'uint32',
            fieldNumber: 1,
          },
          timestamp: {
            dataType: 'uint32',
            fieldNumber: 2,
          },
          height: {
            dataType: 'uint32',
            fieldNumber: 3,
          },
          previousBlockID: {
            dataType: 'bytes',
            fieldNumber: 4,
          },
          generatorAddress: {
            dataType: 'bytes',
            fieldNumber: 5,
            format: 'lisk32',
          },
          transactionRoot: {
            dataType: 'bytes',
            fieldNumber: 6,
          },
          assetRoot: {
            dataType: 'bytes',
            fieldNumber: 7,
          },
          eventRoot: {
            dataType: 'bytes',
            fieldNumber: 8,
          },
          stateRoot: {
            dataType: 'bytes',
            fieldNumber: 9,
          },
          maxHeightPrestaked: {
            dataType: 'uint32',
            fieldNumber: 10,
          },
          maxHeightGenerated: {
            dataType: 'uint32',
            fieldNumber: 11,
          },
          impliesMaxPrestakes: {
            dataType: 'boolean',
            fieldNumber: 12,
          },
          validatorsHash: {
            dataType: 'bytes',
            fieldNumber: 13,
          },
          aggregateCommit: {
            type: 'object',
            fieldNumber: 14,
            required: ['height', 'aggregationBits', 'certificateSignature'],
            properties: {
              height: {
                dataType: 'uint32',
                fieldNumber: 1,
              },
              aggregationBits: {
                dataType: 'bytes',
                fieldNumber: 2,
              },
              certificateSignature: {
                dataType: 'bytes',
                fieldNumber: 3,
              },
            },
          },
          signature: {
            dataType: 'bytes',
            fieldNumber: 15,
          },
        },
        required: [
          'version',
          'timestamp',
          'height',
          'previousBlockID',
          'generatorAddress',
          'transactionRoot',
          'assetRoot',
          'eventRoot',
          'stateRoot',
          'maxHeightPrestaked',
          'maxHeightGenerated',
          'impliesMaxPrestakes',
          'validatorsHash',
          'aggregateCommit',
          'signature',
        ],
      },
    },
    asset: {
      schema: {
        $id: '/block/asset/3',
        type: 'object',
        required: ['module', 'data'],
        properties: {
          module: {
            dataType: 'string',
            fieldNumber: 1,
          },
          data: {
            dataType: 'bytes',
            fieldNumber: 2,
          },
        },
      },
    },
    transaction: {
      schema: {
        $id: '/lisk/transaction',
        type: 'object',
        required: ['module', 'command', 'nonce', 'fee', 'senderPublicKey', 'params'],
        properties: {
          module: {
            dataType: 'string',
            fieldNumber: 1,
            minLength: 1,
            maxLength: 32,
          },
          command: {
            dataType: 'string',
            fieldNumber: 2,
            minLength: 1,
            maxLength: 32,
          },
          nonce: {
            dataType: 'uint64',
            fieldNumber: 3,
          },
          fee: {
            dataType: 'uint64',
            fieldNumber: 4,
          },
          senderPublicKey: {
            dataType: 'bytes',
            fieldNumber: 5,
            minLength: 32,
            maxLength: 32,
          },
          params: {
            dataType: 'bytes',
            fieldNumber: 6,
          },
          signatures: {
            type: 'array',
            items: {
              dataType: 'bytes',
            },
            fieldNumber: 7,
          },
        },
      },
    },
    event: {
      schema: {
        $id: '/block/event',
        type: 'object',
        required: ['module', 'name', 'data', 'topics', 'height', 'index'],
        properties: {
          module: {
            dataType: 'string',
            minLength: 1,
            maxLength: 32,
            fieldNumber: 1,
          },
          name: {
            dataType: 'string',
            minLength: 1,
            maxLength: 32,
            fieldNumber: 2,
          },
          data: {
            dataType: 'bytes',
            fieldNumber: 3,
          },
          topics: {
            type: 'array',
            fieldNumber: 4,
            items: {
              dataType: 'bytes',
            },
          },
          height: {
            dataType: 'uint32',
            fieldNumber: 5,
          },
          index: {
            dataType: 'uint32',
            fieldNumber: 6,
          },
        },
      },
    },
    events: [
      {
        module: 'auth',
        name: 'multisignatureRegistration',
        schema: {
          $id: '/auth/events/multisigRegData',
          type: 'object',
          required: ['numberOfSignatures', 'mandatoryKeys', 'optionalKeys'],
          properties: {
            numberOfSignatures: {
              dataType: 'uint32',
              fieldNumber: 1,
            },
            mandatoryKeys: {
              type: 'array',
              items: {
                dataType: 'bytes',
                minLength: 32,
                maxLength: 32,
              },
              fieldNumber: 2,
            },
            optionalKeys: {
              type: 'array',
              items: {
                dataType: 'bytes',
                minLength: 32,
                maxLength: 32,
              },
              fieldNumber: 3,
            },
          },
        },
      },
      {
        module: 'auth',
        name: 'invalidSignature',
        schema: {
          $id: '/auth/events/invalidSigData',
          type: 'object',
          required: [
            'numberOfSignatures',
            'mandatoryKeys',
            'optionalKeys',
            'failingPublicKey',
            'failingSignature',
          ],
          properties: {
            numberOfSignatures: {
              dataType: 'uint32',
              fieldNumber: 1,
            },
            mandatoryKeys: {
              type: 'array',
              items: {
                dataType: 'bytes',
                minLength: 32,
                maxLength: 32,
              },
              fieldNumber: 2,
            },
            optionalKeys: {
              type: 'array',
              items: {
                dataType: 'bytes',
                minLength: 32,
                maxLength: 32,
              },
              fieldNumber: 3,
            },
            failingPublicKey: {
              dataType: 'bytes',
              minLength: 32,
              maxLength: 32,
              fieldNumber: 4,
            },
            failingSignature: {
              dataType: 'bytes',
              minLength: 64,
              maxLength: 64,
              fieldNumber: 5,
            },
          },
        },
      },
      {
        module: 'dynamicReward',
        name: 'rewardMinted',
        schema: {
          $id: '/reward/events/rewardMintedData',
          type: 'object',
          required: ['amount', 'reduction'],
          properties: {
            amount: {
              dataType: 'uint64',
              fieldNumber: 1,
            },
            reduction: {
              dataType: 'uint32',
              fieldNumber: 2,
            },
          },
        },
      },
      {
        module: 'fee',
        name: 'generatorFeeProcessed',
        schema: {
          $id: '/fee/events/generatorFeeProcessed',
          type: 'object',
          required: ['senderAddress', 'generatorAddress', 'burntAmount', 'generatorAmount'],
          properties: {
            senderAddress: {
              dataType: 'bytes',
              format: 'lisk32',
              fieldNumber: 1,
            },
            generatorAddress: {
              dataType: 'bytes',
              format: 'lisk32',
              fieldNumber: 2,
            },
            burntAmount: {
              dataType: 'uint64',
              fieldNumber: 3,
            },
            generatorAmount: {
              dataType: 'uint64',
              fieldNumber: 4,
            },
          },
        },
      },
      {
        module: 'fee',
        name: 'relayerFeeProcessed',
        schema: {
          $id: '/fee/events/relayerFeeProcessed',
          type: 'object',
          required: ['ccmID', 'relayerAddress', 'burntAmount', 'relayerAmount'],
          properties: {
            ccmID: {
              dataType: 'bytes',
              minLength: 32,
              maxLength: 32,
              fieldNumber: 1,
            },
            relayerAddress: {
              dataType: 'bytes',
              format: 'lisk32',
              fieldNumber: 2,
            },
            burntAmount: {
              dataType: 'uint64',
              fieldNumber: 3,
            },
            relayerAmount: {
              dataType: 'uint64',
              fieldNumber: 4,
            },
          },
        },
      },
      {
        module: 'fee',
        name: 'insufficientFee',
      },
      {
        module: 'interoperability',
        name: 'chainAccountUpdated',
        schema: {
          $id: '/modules/interoperability/chainAccount',
          type: 'object',
          required: ['name', 'lastCertificate', 'status'],
          properties: {
            name: {
              dataType: 'string',
              fieldNumber: 1,
            },
            lastCertificate: {
              type: 'object',
              fieldNumber: 2,
              required: ['height', 'timestamp', 'stateRoot', 'validatorsHash'],
              properties: {
                height: {
                  dataType: 'uint32',
                  fieldNumber: 1,
                },
                timestamp: {
                  dataType: 'uint32',
                  fieldNumber: 2,
                },
                stateRoot: {
                  dataType: 'bytes',
                  minLength: 32,
                  maxLength: 32,
                  fieldNumber: 3,
                },
                validatorsHash: {
                  dataType: 'bytes',
                  minLength: 32,
                  maxLength: 32,
                  fieldNumber: 4,
                },
              },
            },
            status: {
              dataType: 'uint32',
              fieldNumber: 3,
            },
          },
        },
      },
      {
        module: 'interoperability',
        name: 'ccmProcessed',
        schema: {
          $id: '/interoperability/events/ccmProcessed',
          type: 'object',
          required: ['ccmID', 'result', 'code'],
          properties: {
            ccmID: {
              dataType: 'bytes',
              fieldNumber: 1,
            },
            result: {
              dataType: 'uint32',
              fieldNumber: 2,
            },
            code: {
              dataType: 'uint32',
              fieldNumber: 3,
            },
          },
        },
      },
      {
        module: 'interoperability',
        name: 'ccmSendSuccess',
        schema: {
          $id: '/interoperability/events/ccmSendSuccess',
          type: 'object',
          required: ['ccmID'],
          properties: {
            ccmID: {
              dataType: 'bytes',
              fieldNumber: 1,
              minLength: 32,
              maxLength: 32,
            },
          },
        },
      },
      {
        module: 'interoperability',
        name: 'terminatedStateCreated',
        schema: {
          $id: '/modules/interoperability/terminatedState',
          type: 'object',
          required: ['stateRoot', 'mainchainStateRoot', 'initialized'],
          properties: {
            stateRoot: {
              dataType: 'bytes',
              minLength: 32,
              maxLength: 32,
              fieldNumber: 1,
            },
            mainchainStateRoot: {
              dataType: 'bytes',
              minLength: 32,
              maxLength: 32,
              fieldNumber: 2,
            },
            initialized: {
              dataType: 'boolean',
              fieldNumber: 3,
            },
          },
        },
      },
      {
        module: 'interoperability',
        name: 'terminatedOutboxCreated',
        schema: {
          $id: '/modules/interoperability/terminatedOutbox',
          type: 'object',
          required: ['outboxRoot', 'outboxSize', 'partnerChainInboxSize'],
          properties: {
            outboxRoot: {
              dataType: 'bytes',
              minLength: 32,
              maxLength: 32,
              fieldNumber: 1,
            },
            outboxSize: {
              dataType: 'uint32',
              fieldNumber: 2,
            },
            partnerChainInboxSize: {
              dataType: 'uint32',
              fieldNumber: 3,
            },
          },
        },
      },
      {
        module: 'token',
        name: 'transfer',
        schema: {
          $id: '/token/events/transfer',
          type: 'object',
          required: ['senderAddress', 'recipientAddress', 'tokenID', 'amount', 'result'],
          properties: {
            senderAddress: {
              dataType: 'bytes',
              format: 'lisk32',
              fieldNumber: 1,
            },
            recipientAddress: {
              dataType: 'bytes',
              format: 'lisk32',
              fieldNumber: 2,
            },
            tokenID: {
              dataType: 'bytes',
              minLength: 8,
              maxLength: 8,
              fieldNumber: 3,
            },
            amount: {
              dataType: 'uint64',
              fieldNumber: 4,
            },
            result: {
              dataType: 'uint32',
              fieldNumber: 5,
            },
          },
        },
      },
      {
        module: 'token',
        name: 'transferCrossChain',
        schema: {
          $id: '/token/events/transferCrossChain',
          type: 'object',
          required: [
            'senderAddress',
            'recipientAddress',
            'tokenID',
            'amount',
            'receivingChainID',
            'result',
          ],
          properties: {
            senderAddress: {
              dataType: 'bytes',
              format: 'lisk32',
              fieldNumber: 1,
            },
            recipientAddress: {
              dataType: 'bytes',
              format: 'lisk32',
              fieldNumber: 2,
            },
            tokenID: {
              dataType: 'bytes',
              minLength: 8,
              maxLength: 8,
              fieldNumber: 3,
            },
            amount: {
              dataType: 'uint64',
              fieldNumber: 4,
            },
            receivingChainID: {
              dataType: 'bytes',
              minLength: 4,
              maxLength: 4,
              fieldNumber: 5,
            },
            result: {
              dataType: 'uint32',
              fieldNumber: 6,
            },
          },
        },
      },
      {
        module: 'token',
        name: 'ccmTransfer',
        schema: {
          $id: '/token/events/ccmTransfer',
          type: 'object',
          required: [
            'senderAddress',
            'recipientAddress',
            'tokenID',
            'amount',
            'receivingChainID',
            'result',
          ],
          properties: {
            senderAddress: {
              dataType: 'bytes',
              format: 'lisk32',
              fieldNumber: 1,
            },
            recipientAddress: {
              dataType: 'bytes',
              format: 'lisk32',
              fieldNumber: 2,
            },
            tokenID: {
              dataType: 'bytes',
              minLength: 8,
              maxLength: 8,
              fieldNumber: 3,
            },
            amount: {
              dataType: 'uint64',
              fieldNumber: 4,
            },
            receivingChainID: {
              dataType: 'bytes',
              minLength: 4,
              maxLength: 4,
              fieldNumber: 5,
            },
            result: {
              dataType: 'uint32',
              fieldNumber: 6,
            },
          },
        },
      },
      {
        module: 'token',
        name: 'mint',
        schema: {
          $id: '/token/events/mint',
          type: 'object',
          required: ['address', 'tokenID', 'amount', 'result'],
          properties: {
            address: {
              dataType: 'bytes',
              format: 'lisk32',
              fieldNumber: 1,
            },
            tokenID: {
              dataType: 'bytes',
              minLength: 8,
              maxLength: 8,
              fieldNumber: 2,
            },
            amount: {
              dataType: 'uint64',
              fieldNumber: 3,
            },
            result: {
              dataType: 'uint32',
              fieldNumber: 4,
            },
          },
        },
      },
      {
        module: 'token',
        name: 'burn',
        schema: {
          $id: '/token/events/burn',
          type: 'object',
          required: ['address', 'tokenID', 'amount', 'result'],
          properties: {
            address: {
              dataType: 'bytes',
              format: 'lisk32',
              fieldNumber: 1,
            },
            tokenID: {
              dataType: 'bytes',
              minLength: 8,
              maxLength: 8,
              fieldNumber: 2,
            },
            amount: {
              dataType: 'uint64',
              fieldNumber: 3,
            },
            result: {
              dataType: 'uint32',
              fieldNumber: 4,
            },
          },
        },
      },
      {
        module: 'token',
        name: 'lock',
        schema: {
          $id: '/token/events/lock',
          type: 'object',
          required: ['address', 'module', 'tokenID', 'amount', 'result'],
          properties: {
            address: {
              dataType: 'bytes',
              format: 'lisk32',
              fieldNumber: 1,
            },
            module: {
              dataType: 'string',
              minLength: 1,
              maxLength: 32,
              fieldNumber: 2,
            },
            tokenID: {
              dataType: 'bytes',
              minLength: 8,
              maxLength: 8,
              fieldNumber: 3,
            },
            amount: {
              dataType: 'uint64',
              fieldNumber: 4,
            },
            result: {
              dataType: 'uint32',
              fieldNumber: 5,
            },
          },
        },
      },
      {
        module: 'token',
        name: 'unlock',
        schema: {
          $id: '/token/events/unlock',
          type: 'object',
          required: ['address', 'module', 'tokenID', 'amount', 'result'],
          properties: {
            address: {
              dataType: 'bytes',
              format: 'lisk32',
              fieldNumber: 1,
            },
            module: {
              dataType: 'string',
              minLength: 1,
              maxLength: 32,
              fieldNumber: 2,
            },
            tokenID: {
              dataType: 'bytes',
              minLength: 8,
              maxLength: 8,
              fieldNumber: 3,
            },
            amount: {
              dataType: 'uint64',
              fieldNumber: 4,
            },
            result: {
              dataType: 'uint32',
              fieldNumber: 5,
            },
          },
        },
      },
      {
        module: 'token',
        name: 'initializeToken',
        schema: {
          $id: '/token/events/initializeTokenEvent',
          type: 'object',
          required: ['tokenID', 'result'],
          properties: {
            tokenID: {
              dataType: 'bytes',
              minLength: 8,
              maxLength: 8,
              fieldNumber: 1,
            },
            result: {
              dataType: 'uint32',
              fieldNumber: 2,
            },
          },
        },
      },
      {
        module: 'token',
        name: 'initializeUserAccount',
        schema: {
          $id: '/token/events/initializeUserAccount',
          type: 'object',
          required: ['address', 'tokenID', 'initializationFee', 'result'],
          properties: {
            address: {
              dataType: 'bytes',
              format: 'lisk32',
              fieldNumber: 1,
            },
            tokenID: {
              dataType: 'bytes',
              minLength: 8,
              maxLength: 8,
              fieldNumber: 2,
            },
            initializationFee: {
              dataType: 'uint64',
              fieldNumber: 3,
            },
            result: {
              dataType: 'uint32',
              fieldNumber: 4,
            },
          },
        },
      },
      {
        module: 'token',
        name: 'initializeEscrowAccount',
        schema: {
          $id: '/token/events/initializeEscrowAccount',
          type: 'object',
          required: ['chainID', 'tokenID', 'initializationFee', 'result'],
          properties: {
            chainID: {
              dataType: 'bytes',
              minLength: 4,
              maxLength: 4,
              fieldNumber: 1,
            },
            tokenID: {
              dataType: 'bytes',
              minLength: 8,
              maxLength: 8,
              fieldNumber: 2,
            },
            initializationFee: {
              dataType: 'uint64',
              fieldNumber: 3,
            },
            result: {
              dataType: 'uint32',
              fieldNumber: 4,
            },
          },
        },
      },
      {
        module: 'token',
        name: 'recover',
        schema: {
          $id: '/token/events/recover',
          type: 'object',
          required: ['terminatedChainID', 'tokenID', 'amount', 'result'],
          properties: {
            terminatedChainID: {
              dataType: 'bytes',
              minLength: 4,
              maxLength: 4,
              fieldNumber: 1,
            },
            tokenID: {
              dataType: 'bytes',
              minLength: 8,
              maxLength: 8,
              fieldNumber: 2,
            },
            amount: {
              dataType: 'uint64',
              fieldNumber: 3,
            },
            result: {
              dataType: 'uint32',
              fieldNumber: 4,
            },
          },
        },
      },
      {
        module: 'token',
        name: 'beforeCCCExecution',
        schema: {
          $id: '/token/events/beforeCCCExecution',
          type: 'object',
          required: ['ccmID', 'messageFeeTokenID', 'relayerAddress', 'result'],
          properties: {
            ccmID: {
              dataType: 'bytes',
              minLength: 32,
              maxLength: 32,
              fieldNumber: 1,
            },
            messageFeeTokenID: {
              dataType: 'bytes',
              minLength: 8,
              maxLength: 8,
              fieldNumber: 2,
            },
            relayerAddress: {
              dataType: 'bytes',
              format: 'lisk32',
              fieldNumber: 3,
            },
            result: {
              dataType: 'uint32',
              fieldNumber: 4,
            },
          },
        },
      },
      {
        module: 'token',
        name: 'beforeCCMForwarding',
        schema: {
          $id: '/token/events/beforeCCMForwarding',
          type: 'object',
          required: ['ccmID', 'messageFeeTokenID', 'result'],
          properties: {
            ccmID: {
              dataType: 'bytes',
              minLength: 32,
              maxLength: 32,
              fieldNumber: 1,
            },
            messageFeeTokenID: {
              dataType: 'bytes',
              minLength: 8,
              maxLength: 8,
              fieldNumber: 2,
            },
            result: {
              dataType: 'uint32',
              fieldNumber: 3,
            },
          },
        },
      },
      {
        module: 'token',
        name: 'allTokensSupported',
      },
      {
        module: 'token',
        name: 'allTokensSupportRemoved',
      },
      {
        module: 'token',
        name: 'allTokensFromChainSupported',
        schema: {
          $id: '/token/events/allTokensFromChainSupported',
          type: 'object',
          required: ['chainID'],
          properties: {
            chainID: {
              dataType: 'bytes',
              minLength: 4,
              maxLength: 4,
              fieldNumber: 1,
            },
          },
        },
      },
      {
        module: 'token',
        name: 'allTokensFromChainSupportRemoved',
        schema: {
          $id: '/token/events/allTokensFromChainSupportRemoved',
          type: 'object',
          required: ['chainID'],
          properties: {
            chainID: {
              dataType: 'bytes',
              minLength: 4,
              maxLength: 4,
              fieldNumber: 1,
            },
          },
        },
      },
      {
        module: 'token',
        name: 'tokenIDSupported',
        schema: {
          $id: '/token/events/tokenIDSupported',
          type: 'object',
          required: ['tokenID'],
          properties: {
            tokenID: {
              dataType: 'bytes',
              minLength: 8,
              maxLength: 8,
              fieldNumber: 1,
            },
          },
        },
      },
      {
        module: 'token',
        name: 'tokenIDSupportRemoved',
        schema: {
          $id: '/token/events/tokenIDSupportRemoved',
          type: 'object',
          required: ['tokenID'],
          properties: {
            tokenID: {
              dataType: 'bytes',
              minLength: 8,
              maxLength: 8,
              fieldNumber: 1,
            },
          },
        },
      },
    ],
    assets: [
      {
        module: 'auth',
        version: '0',
        schema: {
          $id: '/auth/module/genesis',
          type: 'object',
          required: ['authDataSubstore'],
          properties: {
            authDataSubstore: {
              type: 'array',
              fieldNumber: 1,
              items: {
                type: 'object',
                required: ['storeKey', 'storeValue'],
                properties: {
                  storeKey: {
                    dataType: 'bytes',
                    fieldNumber: 1,
                  },
                  storeValue: {
                    type: 'object',
                    fieldNumber: 2,
                    required: ['nonce', 'numberOfSignatures', 'mandatoryKeys', 'optionalKeys'],
                    properties: {
                      nonce: {
                        dataType: 'uint64',
                        fieldNumber: 1,
                      },
                      numberOfSignatures: {
                        dataType: 'uint32',
                        fieldNumber: 2,
                      },
                      mandatoryKeys: {
                        type: 'array',
                        fieldNumber: 3,
                        items: {
                          dataType: 'bytes',
                        },
                      },
                      optionalKeys: {
                        type: 'array',
                        fieldNumber: 4,
                        items: {
                          dataType: 'bytes',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        module: 'interoperability',
        version: '0',
        schema: {
          $id: '/interoperability/module/genesis',
          type: 'object',
          required: [
            'outboxRootSubstore',
            'chainDataSubstore',
            'channelDataSubstore',
            'chainValidatorsSubstore',
            'ownChainDataSubstore',
            'terminatedStateSubstore',
            'terminatedOutboxSubstore',
            'registeredNamesSubstore',
          ],
          properties: {
            outboxRootSubstore: {
              type: 'array',
              fieldNumber: 1,
              items: {
                type: 'object',
                required: ['storeKey', 'storeValue'],
                properties: {
                  storeKey: {
                    dataType: 'bytes',
                    fieldNumber: 1,
                  },
                  storeValue: {
                    $id: '/modules/interoperability/outbox',
                    type: 'object',
                    required: ['root'],
                    properties: {
                      root: {
                        dataType: 'bytes',
                        minLength: 32,
                        maxLength: 32,
                        fieldNumber: 1,
                      },
                    },
                    fieldNumber: 2,
                  },
                },
              },
            },
            chainDataSubstore: {
              type: 'array',
              fieldNumber: 2,
              items: {
                type: 'object',
                required: ['storeKey', 'storeValue'],
                properties: {
                  storeKey: {
                    dataType: 'bytes',
                    fieldNumber: 1,
                  },
                  storeValue: {
                    $id: '/modules/interoperability/chainAccount',
                    type: 'object',
                    required: ['name', 'lastCertificate', 'status'],
                    properties: {
                      name: {
                        dataType: 'string',
                        fieldNumber: 1,
                      },
                      lastCertificate: {
                        type: 'object',
                        fieldNumber: 2,
                        required: ['height', 'timestamp', 'stateRoot', 'validatorsHash'],
                        properties: {
                          height: {
                            dataType: 'uint32',
                            fieldNumber: 1,
                          },
                          timestamp: {
                            dataType: 'uint32',
                            fieldNumber: 2,
                          },
                          stateRoot: {
                            dataType: 'bytes',
                            minLength: 32,
                            maxLength: 32,
                            fieldNumber: 3,
                          },
                          validatorsHash: {
                            dataType: 'bytes',
                            minLength: 32,
                            maxLength: 32,
                            fieldNumber: 4,
                          },
                        },
                      },
                      status: {
                        dataType: 'uint32',
                        fieldNumber: 3,
                      },
                    },
                    fieldNumber: 2,
                  },
                },
              },
            },
            channelDataSubstore: {
              type: 'array',
              fieldNumber: 3,
              items: {
                type: 'object',
                required: ['storeKey', 'storeValue'],
                properties: {
                  storeKey: {
                    dataType: 'bytes',
                    fieldNumber: 1,
                  },
                  storeValue: {
                    $id: '/modules/interoperability/channel',
                    type: 'object',
                    required: ['inbox', 'outbox', 'partnerChainOutboxRoot', 'messageFeeTokenID'],
                    properties: {
                      inbox: {
                        type: 'object',
                        fieldNumber: 1,
                        required: ['appendPath', 'size', 'root'],
                        properties: {
                          appendPath: {
                            type: 'array',
                            items: {
                              dataType: 'bytes',
                              minLength: 32,
                              maxLength: 32,
                            },
                            fieldNumber: 1,
                          },
                          size: {
                            dataType: 'uint32',
                            fieldNumber: 2,
                          },
                          root: {
                            dataType: 'bytes',
                            minLength: 32,
                            maxLength: 32,
                            fieldNumber: 3,
                          },
                        },
                      },
                      outbox: {
                        type: 'object',
                        fieldNumber: 2,
                        required: ['appendPath', 'size', 'root'],
                        properties: {
                          appendPath: {
                            type: 'array',
                            items: {
                              dataType: 'bytes',
                              minLength: 32,
                              maxLength: 32,
                            },
                            fieldNumber: 1,
                          },
                          size: {
                            dataType: 'uint32',
                            fieldNumber: 2,
                          },
                          root: {
                            dataType: 'bytes',
                            minLength: 32,
                            maxLength: 32,
                            fieldNumber: 3,
                          },
                        },
                      },
                      partnerChainOutboxRoot: {
                        dataType: 'bytes',
                        minLength: 32,
                        maxLength: 32,
                        fieldNumber: 3,
                      },
                      messageFeeTokenID: {
                        dataType: 'bytes',
                        minLength: 8,
                        maxLength: 8,
                        fieldNumber: 4,
                      },
                    },
                    fieldNumber: 2,
                  },
                },
              },
            },
            chainValidatorsSubstore: {
              type: 'array',
              fieldNumber: 4,
              items: {
                type: 'object',
                required: ['storeKey', 'storeValue'],
                properties: {
                  storeKey: {
                    dataType: 'bytes',
                    fieldNumber: 1,
                  },
                  storeValue: {
                    fieldNumber: 2,
                    $id: '/modules/interoperability/chainValidators',
                    type: 'object',
                    required: ['activeValidators', 'certificateThreshold'],
                    properties: {
                      activeValidators: {
                        type: 'array',
                        fieldNumber: 1,
                        minItems: 1,
                        maxItems: 199,
                        items: {
                          type: 'object',
                          required: ['blsKey', 'bftWeight'],
                          properties: {
                            blsKey: {
                              dataType: 'bytes',
                              minLength: 48,
                              maxLength: 48,
                              fieldNumber: 1,
                            },
                            bftWeight: {
                              dataType: 'uint64',
                              fieldNumber: 2,
                            },
                          },
                        },
                      },
                      certificateThreshold: {
                        dataType: 'uint64',
                        fieldNumber: 2,
                      },
                    },
                  },
                },
              },
            },
            ownChainDataSubstore: {
              type: 'array',
              fieldNumber: 5,
              items: {
                type: 'object',
                required: ['storeKey', 'storeValue'],
                properties: {
                  storeKey: {
                    dataType: 'bytes',
                    fieldNumber: 1,
                  },
                  storeValue: {
                    $id: '/modules/interoperability/ownChainAccount',
                    type: 'object',
                    required: ['name', 'chainID', 'nonce'],
                    properties: {
                      name: {
                        dataType: 'string',
                        fieldNumber: 1,
                      },
                      chainID: {
                        dataType: 'bytes',
                        minLength: 4,
                        maxLength: 4,
                        fieldNumber: 2,
                      },
                      nonce: {
                        dataType: 'uint64',
                        fieldNumber: 3,
                      },
                    },
                    fieldNumber: 2,
                  },
                },
              },
            },
            terminatedStateSubstore: {
              type: 'array',
              fieldNumber: 6,
              items: {
                type: 'object',
                required: ['storeKey', 'storeValue'],
                properties: {
                  storeKey: {
                    dataType: 'bytes',
                    fieldNumber: 1,
                  },
                  storeValue: {
                    $id: '/modules/interoperability/terminatedState',
                    type: 'object',
                    required: ['stateRoot', 'mainchainStateRoot', 'initialized'],
                    properties: {
                      stateRoot: {
                        dataType: 'bytes',
                        minLength: 32,
                        maxLength: 32,
                        fieldNumber: 1,
                      },
                      mainchainStateRoot: {
                        dataType: 'bytes',
                        minLength: 32,
                        maxLength: 32,
                        fieldNumber: 2,
                      },
                      initialized: {
                        dataType: 'boolean',
                        fieldNumber: 3,
                      },
                    },
                    fieldNumber: 2,
                  },
                },
              },
            },
            terminatedOutboxSubstore: {
              type: 'array',
              fieldNumber: 7,
              items: {
                type: 'object',
                required: ['storeKey', 'storeValue'],
                properties: {
                  storeKey: {
                    dataType: 'bytes',
                    fieldNumber: 1,
                  },
                  storeValue: {
                    $id: '/modules/interoperability/terminatedOutbox',
                    type: 'object',
                    required: ['outboxRoot', 'outboxSize', 'partnerChainInboxSize'],
                    properties: {
                      outboxRoot: {
                        dataType: 'bytes',
                        minLength: 32,
                        maxLength: 32,
                        fieldNumber: 1,
                      },
                      outboxSize: {
                        dataType: 'uint32',
                        fieldNumber: 2,
                      },
                      partnerChainInboxSize: {
                        dataType: 'uint32',
                        fieldNumber: 3,
                      },
                    },
                    fieldNumber: 2,
                  },
                },
              },
            },
            registeredNamesSubstore: {
              type: 'array',
              fieldNumber: 8,
              items: {
                type: 'object',
                required: ['storeKey', 'storeValue'],
                properties: {
                  storeKey: {
                    dataType: 'bytes',
                    fieldNumber: 1,
                  },
                  storeValue: {
                    $id: '/modules/interoperability/chainId',
                    type: 'object',
                    required: ['chainID'],
                    properties: {
                      chainID: {
                        dataType: 'bytes',
                        minLength: 4,
                        maxLength: 4,
                        fieldNumber: 1,
                      },
                    },
                    fieldNumber: 2,
                  },
                },
              },
            },
          },
        },
      },
      {
        module: 'legacy',
        version: '0',
        schema: {
          $id: 'lisk/legacy/genesisLegacyStore',
          type: 'object',
          required: ['accounts'],
          properties: {
            accounts: {
              type: 'array',
              fieldNumber: 1,
              items: {
                type: 'object',
                required: ['address', 'balance'],
                properties: {
                  address: {
                    dataType: 'bytes',
                    minLength: 8,
                    maxLength: 8,
                    fieldNumber: 1,
                  },
                  balance: {
                    dataType: 'uint64',
                    fieldNumber: 2,
                  },
                },
              },
            },
          },
        },
      },
      {
        module: 'pos',
        version: '0',
        schema: {
          $id: '/pos/module/genesis',
          type: 'object',
          required: ['validators', 'stakers', 'genesisData'],
          properties: {
            validators: {
              type: 'array',
              fieldNumber: 1,
              items: {
                type: 'object',
                required: [
                  'address',
                  'name',
                  'blsKey',
                  'proofOfPossession',
                  'generatorKey',
                  'lastGeneratedHeight',
                  'isBanned',
                  'pomHeights',
                  'consecutiveMissedBlocks',
                  'commission',
                  'lastCommissionIncreaseHeight',
                  'sharingCoefficients',
                ],
                properties: {
                  address: {
                    dataType: 'bytes',
                    format: 'lisk32',
                    fieldNumber: 1,
                  },
                  name: {
                    dataType: 'string',
                    fieldNumber: 2,
                    minLength: 1,
                    maxLength: 20,
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
                  generatorKey: {
                    dataType: 'bytes',
                    fieldNumber: 5,
                    minLength: 32,
                    maxLength: 32,
                  },
                  lastGeneratedHeight: {
                    dataType: 'uint32',
                    fieldNumber: 6,
                  },
                  isBanned: {
                    dataType: 'boolean',
                    fieldNumber: 7,
                  },
                  pomHeights: {
                    type: 'array',
                    fieldNumber: 8,
                    items: {
                      dataType: 'uint32',
                    },
                  },
                  consecutiveMissedBlocks: {
                    dataType: 'uint32',
                    fieldNumber: 9,
                  },
                  commission: {
                    dataType: 'uint32',
                    fieldNumber: 10,
                    maximum: 10000,
                  },
                  lastCommissionIncreaseHeight: {
                    dataType: 'uint32',
                    fieldNumber: 11,
                  },
                  sharingCoefficients: {
                    type: 'array',
                    fieldNumber: 12,
                    items: {
                      type: 'object',
                      required: ['tokenID', 'coefficient'],
                      properties: {
                        tokenID: {
                          dataType: 'bytes',
                          minLength: 8,
                          maxLength: 8,
                          fieldNumber: 1,
                        },
                        coefficient: {
                          dataType: 'bytes',
                          maxLength: 24,
                          fieldNumber: 2,
                        },
                      },
                    },
                  },
                },
              },
            },
            stakers: {
              type: 'array',
              fieldNumber: 2,
              items: {
                type: 'object',
                required: ['address', 'sentStakes', 'pendingUnlocks'],
                properties: {
                  address: {
                    dataType: 'bytes',
                    format: 'lisk32',
                    fieldNumber: 1,
                  },
                  sentStakes: {
                    type: 'array',
                    fieldNumber: 2,
                    items: {
                      type: 'object',
                      required: ['validatorAddress', 'amount'],
                      properties: {
                        validatorAddress: {
                          dataType: 'bytes',
                          format: 'lisk32',
                          fieldNumber: 1,
                        },
                        amount: {
                          dataType: 'uint64',
                          fieldNumber: 2,
                        },
                        stakeSharingCoefficients: {
                          type: 'array',
                          fieldNumber: 3,
                          items: {
                            type: 'object',
                            required: ['tokenID', 'coefficient'],
                            properties: {
                              tokenID: {
                                dataType: 'bytes',
                                minLength: 8,
                                maxLength: 8,
                                fieldNumber: 1,
                              },
                              coefficient: {
                                dataType: 'bytes',
                                maxLength: 24,
                                fieldNumber: 2,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  pendingUnlocks: {
                    type: 'array',
                    fieldNumber: 3,
                    items: {
                      type: 'object',
                      required: ['validatorAddress', 'amount', 'unstakeHeight'],
                      properties: {
                        validatorAddress: {
                          dataType: 'bytes',
                          fieldNumber: 1,
                          format: 'lisk32',
                        },
                        amount: {
                          dataType: 'uint64',
                          fieldNumber: 2,
                        },
                        unstakeHeight: {
                          dataType: 'uint32',
                          fieldNumber: 3,
                        },
                      },
                    },
                  },
                },
              },
            },
            genesisData: {
              type: 'object',
              fieldNumber: 3,
              required: ['initRounds', 'initValidators'],
              properties: {
                initRounds: {
                  dataType: 'uint32',
                  fieldNumber: 1,
                },
                initValidators: {
                  type: 'array',
                  fieldNumber: 2,
                  items: {
                    dataType: 'bytes',
                    format: 'lisk32',
                  },
                },
              },
            },
          },
        },
      },
      {
        module: 'random',
        version: '2',
        schema: {
          $id: '/modules/random/block/header/asset',
          type: 'object',
          properties: {
            seedReveal: {
              dataType: 'bytes',
              fieldNumber: 1,
              minLength: 16,
              maxLength: 16,
            },
          },
          required: ['seedReveal'],
        },
      },
      {
        module: 'token',
        version: '0',
        schema: {
          $id: '/token/module/genesis',
          type: 'object',
          required: ['userSubstore', 'supplySubstore', 'escrowSubstore', 'supportedTokensSubstore'],
          properties: {
            userSubstore: {
              type: 'array',
              fieldNumber: 1,
              items: {
                type: 'object',
                required: ['address', 'tokenID', 'availableBalance', 'lockedBalances'],
                properties: {
                  address: {
                    dataType: 'bytes',
                    format: 'lisk32',
                    fieldNumber: 1,
                  },
                  tokenID: {
                    dataType: 'bytes',
                    fieldNumber: 2,
                    minLength: 8,
                    maxLength: 8,
                  },
                  availableBalance: {
                    dataType: 'uint64',
                    fieldNumber: 3,
                  },
                  lockedBalances: {
                    type: 'array',
                    fieldNumber: 4,
                    items: {
                      type: 'object',
                      required: ['module', 'amount'],
                      properties: {
                        module: {
                          dataType: 'string',
                          minLength: 1,
                          maxLength: 32,
                          fieldNumber: 1,
                        },
                        amount: {
                          dataType: 'uint64',
                          fieldNumber: 2,
                        },
                      },
                    },
                  },
                },
              },
            },
            supplySubstore: {
              type: 'array',
              fieldNumber: 2,
              items: {
                type: 'object',
                required: ['tokenID', 'totalSupply'],
                properties: {
                  tokenID: {
                    dataType: 'bytes',
                    fieldNumber: 1,
                    minLength: 8,
                    maxLength: 8,
                  },
                  totalSupply: {
                    dataType: 'uint64',
                    fieldNumber: 2,
                  },
                },
              },
            },
            escrowSubstore: {
              type: 'array',
              fieldNumber: 3,
              items: {
                type: 'object',
                required: ['escrowChainID', 'tokenID', 'amount'],
                properties: {
                  escrowChainID: {
                    dataType: 'bytes',
                    minLength: 4,
                    maxLength: 4,
                    fieldNumber: 1,
                  },
                  tokenID: {
                    dataType: 'bytes',
                    fieldNumber: 2,
                    minLength: 8,
                    maxLength: 8,
                  },
                  amount: {
                    dataType: 'uint64',
                    fieldNumber: 3,
                  },
                },
              },
            },
            supportedTokensSubstore: {
              type: 'array',
              fieldNumber: 4,
              items: {
                type: 'object',
                required: ['chainID', 'supportedTokenIDs'],
                properties: {
                  chainID: {
                    dataType: 'bytes',
                    minLength: 4,
                    maxLength: 4,
                    fieldNumber: 1,
                  },
                  supportedTokenIDs: {
                    type: 'array',
                    fieldNumber: 2,
                    items: {
                      dataType: 'bytes',
                      minLength: 8,
                      maxLength: 8,
                    },
                  },
                },
              },
            },
          },
        },
      },
    ],
    commands: [
      {
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
      },
      {
        moduleCommand: 'interoperability:mainchainCCUpdate',
        schema: {
          $id: '/modules/interoperability/ccu',
          type: 'object',
          required: [
            'sendingChainID',
            'certificate',
            'activeValidatorsUpdate',
            'certificateThreshold',
            'inboxUpdate',
          ],
          properties: {
            sendingChainID: {
              dataType: 'bytes',
              fieldNumber: 1,
              minLength: 4,
              maxLength: 4,
            },
            certificate: {
              dataType: 'bytes',
              fieldNumber: 2,
            },
            activeValidatorsUpdate: {
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
            },
            certificateThreshold: {
              dataType: 'uint64',
              fieldNumber: 4,
            },
            inboxUpdate: {
              type: 'object',
              fieldNumber: 5,
              required: ['crossChainMessages', 'messageWitnessHashes', 'outboxRootWitness'],
              properties: {
                crossChainMessages: {
                  type: 'array',
                  fieldNumber: 1,
                  items: {
                    dataType: 'bytes',
                  },
                },
                messageWitnessHashes: {
                  type: 'array',
                  fieldNumber: 2,
                  items: {
                    dataType: 'bytes',
                    minLength: 32,
                    maxLength: 32,
                  },
                },
                outboxRootWitness: {
                  type: 'object',
                  fieldNumber: 3,
                  required: ['bitmap', 'siblingHashes'],
                  properties: {
                    bitmap: {
                      dataType: 'bytes',
                      fieldNumber: 1,
                    },
                    siblingHashes: {
                      type: 'array',
                      fieldNumber: 2,
                      items: {
                        dataType: 'bytes',
                        minLength: 32,
                        maxLength: 32,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        moduleCommand: 'interoperability:messageRecoveryInitialization',
        schema: {
          $id: '/modules/interoperability/mainchain/messageRecoveryInitialization',
          type: 'object',
          required: ['chainID', 'channel', 'bitmap', 'siblingHashes'],
          properties: {
            chainID: {
              dataType: 'bytes',
              fieldNumber: 1,
              minLength: 4,
              maxLength: 4,
            },
            channel: {
              dataType: 'bytes',
              fieldNumber: 2,
            },
            bitmap: {
              dataType: 'bytes',
              fieldNumber: 3,
            },
            siblingHashes: {
              type: 'array',
              items: {
                dataType: 'bytes',
                minLength: 32,
                maxLength: 32,
              },
              fieldNumber: 4,
            },
          },
        },
      },
      {
        moduleCommand: 'interoperability:messageRecovery',
        schema: {
          $id: '/modules/interoperability/mainchain/messageRecovery',
          type: 'object',
          required: ['chainID', 'crossChainMessages', 'idxs', 'siblingHashes'],
          properties: {
            chainID: {
              dataType: 'bytes',
              minLength: 4,
              maxLength: 4,
              fieldNumber: 1,
            },
            crossChainMessages: {
              type: 'array',
              minItems: 1,
              items: {
                dataType: 'bytes',
              },
              fieldNumber: 2,
            },
            idxs: {
              type: 'array',
              items: {
                dataType: 'uint32',
              },
              fieldNumber: 3,
            },
            siblingHashes: {
              type: 'array',
              items: {
                dataType: 'bytes',
                minLength: 32,
                maxLength: 32,
              },
              fieldNumber: 4,
            },
          },
        },
      },
      {
        moduleCommand: 'interoperability:sidechainRegistration',
        schema: {
          $id: '/modules/interoperability/mainchain/sidechainRegistration',
          type: 'object',
          required: ['name', 'chainID', 'initValidators', 'certificateThreshold'],
          properties: {
            name: {
              dataType: 'string',
              fieldNumber: 1,
              minLength: 1,
              maxLength: 32,
            },
            chainID: {
              dataType: 'bytes',
              fieldNumber: 2,
              minLength: 4,
              maxLength: 4,
            },
            initValidators: {
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
              minItems: 1,
              maxItems: 199,
            },
            certificateThreshold: {
              dataType: 'uint64',
              fieldNumber: 4,
            },
          },
        },
      },
      {
        moduleCommand: 'interoperability:stateRecovery',
        schema: {
          $id: '/modules/interoperability/mainchain/commands/stateRecovery',
          type: 'object',
          required: ['chainID', 'module', 'storeEntries', 'siblingHashes'],
          properties: {
            chainID: {
              dataType: 'bytes',
              fieldNumber: 1,
              minLength: 4,
              maxLength: 4,
            },
            module: {
              dataType: 'string',
              fieldNumber: 2,
            },
            storeEntries: {
              type: 'array',
              fieldNumber: 3,
              items: {
                type: 'object',
                properties: {
                  substorePrefix: {
                    dataType: 'bytes',
                    fieldNumber: 1,
                  },
                  storeKey: {
                    dataType: 'bytes',
                    fieldNumber: 2,
                  },
                  storeValue: {
                    dataType: 'bytes',
                    fieldNumber: 3,
                  },
                  bitmap: {
                    dataType: 'bytes',
                    fieldNumber: 4,
                  },
                },
                required: ['substorePrefix', 'storeKey', 'storeValue', 'bitmap'],
              },
            },
            siblingHashes: {
              type: 'array',
              items: {
                dataType: 'bytes',
              },
              fieldNumber: 4,
            },
          },
        },
      },
      {
        moduleCommand: 'interoperability:terminateSidechainForLiveness',
        schema: {
          $id: '/modules/interoperability/mainchain/terminateSidechainForLiveness',
          type: 'object',
          required: ['chainID'],
          properties: {
            chainID: {
              dataType: 'bytes',
              fieldNumber: 1,
              minLength: 4,
              maxLength: 4,
            },
          },
        },
      },
      {
        moduleCommand: 'legacy:reclaimLSK',
        schema: {
          $id: 'lisk/legacy/reclaimLSK',
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
        moduleCommand: 'legacy:registerKeys',
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
      {
        moduleCommand: 'pos:registerValidator',
        schema: {
          $id: '/pos/command/registerValidatorParams',
          type: 'object',
          required: ['name', 'blsKey', 'proofOfPossession', 'generatorKey'],
          properties: {
            name: {
              dataType: 'string',
              fieldNumber: 1,
            },
            blsKey: {
              dataType: 'bytes',
              minLength: 48,
              maxLength: 48,
              fieldNumber: 2,
            },
            proofOfPossession: {
              dataType: 'bytes',
              minLength: 96,
              maxLength: 96,
              fieldNumber: 3,
            },
            generatorKey: {
              dataType: 'bytes',
              minLength: 32,
              maxLength: 32,
              fieldNumber: 4,
            },
          },
        },
      },
      {
        moduleCommand: 'pos:reportMisbehavior',
        schema: {
          $id: '/pos/command/reportMisbehaviorParams',
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
        moduleCommand: 'pos:unlock',
      },
      {
        moduleCommand: 'pos:updateGeneratorKey',
        schema: {
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
      },
      {
        moduleCommand: 'pos:stake',
        schema: {
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
      },
      {
        moduleCommand: 'pos:changeCommission',
        schema: {
          $id: '/pos/command/changeCommissionCommandParams',
          type: 'object',
          required: ['newCommission'],
          properties: {
            newCommission: {
              dataType: 'uint32',
              fieldNumber: 1,
              maximum: 10000,
            },
          },
        },
      },
      {
        moduleCommand: 'pos:claimRewards',
      },
      {
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
      },
      {
        moduleCommand: 'token:crossChainTransfer',
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
      },
    ],
  },
  meta: {},
};
