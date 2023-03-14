/* eslint-disable max-lines */
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MODULE_COMMANDS_NAME_MAP } from '@transaction/configuration/moduleCommand';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import { Input } from 'src/theme';
import TxComposer from '@transaction/components/TxComposer';
import { convertCommissionToNumber, checkCommissionValidity } from '@pos/validator/utils';
import { useCurrentCommissionPercentage } from '@pos/validator/hooks/useCurrentCommissionPercentage';
import { useTokensBalance } from '@token/fungible/hooks/queries';
import { dryRun } from '@transaction/api';
import { usePosConstants } from '../../../hooks/queries';
import styles from './ChangeCommissionForm.css';

// eslint-disable-next-line max-statements
export const ChangeCommissionForm = ({ prevState, nextStep }) => {
  const { t } = useTranslation();
  const getInitialCommission = (rawTx, initialValue) =>
    rawTx?.fields.newCommission || initialValue || '';
  const {
    currentCommission,
    isLoading,
    isSuccess: isCommissionSuccess,
  } = useCurrentCommissionPercentage();
  const [newCommission, setNewCommission] = useState({
    value: getInitialCommission(prevState.formProps, currentCommission),
    feedback: '',
    numericValue: convertCommissionToNumber(currentCommission),
  });
  const { data: posConstants, isLoading: isGettingPosConstants } = usePosConstants();
  const { data: tokens } = useTokensBalance({
    config: { params: { tokenID: posConstants?.posTokenID } },
    options: { enabled: !isGettingPosConstants },
  });
  const token = useMemo(() => tokens?.data?.[0] || {}, [tokens]);

  useEffect(() => {
    if (currentCommission && currentCommission !== newCommission.value) {
      setNewCommission(currentCommission);
    }
  }, [isCommissionSuccess]);

  const onConfirm = (formProps, transactionJSON, selectedPriority, fees) => {
    nextStep({
      selectedPriority,
      formProps,
      transactionJSON,
      fees,
    });
  };

  const formProps = {
    moduleCommand: MODULE_COMMANDS_NAME_MAP.changeCommission,
    params: { newCommission: newCommission.numericValue },
    fields: { newCommission: newCommission.value, token },
    isFormValid: newCommission.value !== currentCommission && !newCommission.feedback,
  };
  const commandParams = {
    newCommission: newCommission.numericValue,
  };

  const checkCommissionFeedback = (value) => {
    let inputFeedback;
    const newCommissionParam = convertCommissionToNumber(value);
    const newCommissionValid = checkCommissionValidity(value, currentCommission);
    const isFormValid =
      value !== currentCommission &&
      newCommissionParam &&
      newCommissionParam >= 0 &&
      newCommissionParam <= 10000 &&
      newCommissionValid;
    if (newCommissionValid) {
      if (isFormValid) {
        inputFeedback = undefined;
      }
    } else if (newCommissionParam >= 0 && newCommissionParam <= 10000) {
      inputFeedback = t('You cannot increase commission more than 5%');
    } else {
      inputFeedback = t('Commission range is invalid');
    }
    return { feedback: inputFeedback, numericValue: newCommissionParam };
  };

  // const debouncedInput = useDebounce(newCommission.numericValue, 500);
  const debounceTimeout = useRef(null);

  const onComposed = (__, _, transactionJSON) => {
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(async () => {
      const network = {
        networks: {
          LSK: {
            moduleCommandSchemas: {
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
              'interoperability:submitMainchainCrossChainUpdate': {
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
                    type: 'object',
                    fieldNumber: 3,
                    required: ['blsKeysUpdate', 'bftWeightsUpdate', 'bftWeightsUpdateBitmap'],
                    properties: {
                      blsKeysUpdate: {
                        type: 'array',
                        fieldNumber: 1,
                        items: {
                          dataType: 'bytes',
                          minLength: 48,
                          maxLength: 48,
                        },
                      },
                      bftWeightsUpdate: {
                        type: 'array',
                        fieldNumber: 2,
                        items: {
                          dataType: 'uint64',
                        },
                      },
                      bftWeightsUpdateBitmap: {
                        dataType: 'bytes',
                        fieldNumber: 3,
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
              'interoperability:initializeMessageRecovery': {
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
              'interoperability:recoverMessage': {
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
              'interoperability:registerSidechain': {
                $id: '/modules/interoperability/mainchain/sidechainRegistration',
                type: 'object',
                required: [
                  'chainID',
                  'name',
                  'sidechainValidators',
                  'sidechainCertificateThreshold',
                ],
                properties: {
                  chainID: {
                    dataType: 'bytes',
                    fieldNumber: 1,
                    minLength: 4,
                    maxLength: 4,
                  },
                  name: {
                    dataType: 'string',
                    fieldNumber: 2,
                    minLength: 1,
                    maxLength: 32,
                  },
                  sidechainValidators: {
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
                  sidechainCertificateThreshold: {
                    dataType: 'uint64',
                    fieldNumber: 4,
                  },
                },
              },
              'interoperability:recoverState': {
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
              'interoperability:terminateSidechainForLiveness': {
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
              'legacy:reclaimLSK': {
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
              'pos:registerValidator': {
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
              'pos:reportMisbehavior': {
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
              'pos:stake': {
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
              'pos:changeCommission': {
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
              'token:transferCrossChain': {
                $id: '/lisk/ccTransferParams',
                type: 'object',
                required: [
                  'tokenID',
                  'amount',
                  'receivingChainID',
                  'recipientAddress',
                  'data',
                  'messageFee',
                  'messageFeeTokenID',
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
                  messageFeeTokenID: {
                    dataType: 'bytes',
                    fieldNumber: 7,
                    minLength: 8,
                    maxLength: 8,
                  },
                },
              },
            },
          },
        },
      };
      const fullTxJSON = {
        ...transactionJSON,
        id: 'jsy4303a47e89689b67baba6f2bc470e71e680378995f4eb2aa265a637975729',
        fee: String(transactionJSON.fee),
      };
      await dryRun({
        transaction: fullTxJSON,
        serviceUrl: 'http://devnet-service.liskdev.net:9901',
        network,
        full: true,
      });
    });
  };

  const onCommissionChange = ({ target: { value } }) => {
    const { feedback, numericValue } = checkCommissionFeedback(value);
    setNewCommission({
      value,
      feedback,
      numericValue,
    });
  };

  return (
    <section className={styles.wrapper}>
      <TxComposer
        onConfirm={onConfirm}
        onComposed={onComposed}
        formProps={formProps}
        commandParams={commandParams}
        buttonTitle="Confirm"
      >
        <>
          <BoxHeader className={styles.header}>
            <h2>{t('Edit commission')}</h2>
            <p>
              {t(
                'The commission set will be your reward while the rest will be shared with the stakers.'
              )}
            </p>
          </BoxHeader>
          <BoxContent className={`${styles.container} select-name-container`}>
            <label className={styles.label}>{t('Commission (%)')}</label>
            <div className={styles.inputContainer}>
              <Input
                data-name="change-commission"
                autoComplete="off"
                onChange={onCommissionChange}
                name="newCommission"
                value={newCommission.value}
                isLoading={isLoading}
                placeholder="*.**"
                className={`${styles.input} select-name-input`}
                status={newCommission.feedback ? 'error' : 'ok'}
                feedback={newCommission.feedback}
              />
            </div>
          </BoxContent>
        </>
      </TxComposer>
    </section>
  );
};
