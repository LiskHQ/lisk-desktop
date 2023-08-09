/* eslint-disable complexity */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useTransactionPriority from '@transaction/hooks/useTransactionPriority';
import { useSchemas } from '@transaction/hooks/queries/useSchemas';
import { useAuth } from '@auth/hooks/queries';
import { useCurrentAccount } from '@account/hooks';
import Box from 'src/theme/box';
import BoxFooter from 'src/theme/box/footer';
import TransactionPriority from '@transaction/components/TransactionPriority';
import { getTotalSpendingAmount } from '@transaction/utils/transaction';
import { convertFromBaseDenom } from '@token/fungible/utils/helpers';
import { useDeprecatedAccount } from '@account/hooks/useDeprecatedAccount';
import { useTransactionFee } from '@transaction/hooks/useTransactionFee';
import { PrimaryButton } from 'src/theme/buttons';
import to from 'await-to-js';
import { useCommandSchema } from 'src/modules/network/hooks';
import useSettings from 'src/modules/settings/hooks/useSettings';
import Feedback from './Feedback';
import { getFeeStatus } from '../../utils/helpers';
import { fromTransactionJSON, joinModuleAndCommand, splitModuleAndCommand } from '../../utils';
import { dryRun } from '../../api';
import { TransactionExecutionResult } from '../../constants';
import { MODULE_COMMANDS_NAME_MAP } from '../../configuration/moduleCommand';

// eslint-disable-next-line max-statements
const TxComposer = ({
  children,
  onComposed,
  onConfirm,
  className,
  buttonTitle,
  formProps = {},
  commandParams = {},
}) => {
  const [module, command] = splitModuleAndCommand(formProps.moduleCommand);
  const { t } = useTranslation();
  const { moduleCommandSchemas } = useCommandSchema();
  const { mainChainNetwork } = useSettings('mainChainNetwork');

  useSchemas();
  useDeprecatedAccount();
  const [
    {
      metadata: { pubkey, address },
    },
  ] = useCurrentAccount();
  const { data: auth } = useAuth({ config: { params: { address } } });
  const { symbol: tokenSymbol = '' } = formProps.fields.token || {};
  const { fields } = formProps;
  const [customFee, setCustomFee] = useState();
  const [feedback, setFeedBack] = useState(formProps.feedback);
  const [isRunningDryRun, setIsRunningDryRun] = useState(false);
  const [
    selectedPriority,
    selectTransactionPriority,
    priorityOptions,
    prioritiesLoadError,
    loadingPriorities,
  ] = useTransactionPriority();

  const transactionJSON = {
    module,
    command,
    nonce: auth?.data?.nonce,
    fee: 0,
    senderPublicKey: pubkey,
    params: commandParams,
    signatures: [],
  };

  const {
    minimumFee,
    components,
    transactionFee,
    messageFeeTokenID,
    messageFee,
    isFetched,
    isLoading: isLoadingFee,
  } = useTransactionFee({
    selectedPriority,
    transactionJSON,
    isFormValid: formProps.isFormValid,
    senderAddress: address,
    extraCommandFee: formProps.extraCommandFee,
  });

  if (isFetched && fields?.sendingChain?.chainID !== fields?.recipientChain?.chainID) {
    transactionJSON.params = {
      ...transactionJSON.params,
      messageFee,
      messageFeeTokenID,
    };
  }

  useEffect(() => {
    if (typeof onComposed === 'function') {
      onComposed({}, formProps, {
        ...transactionJSON,
        messageFeeTokenID,
        messageFee,
        fee: transactionFee,
      });
    }
  }, [selectedPriority, transactionJSON.params]);

  useEffect(() => {
    setFeedBack(formProps.feedback);
  }, [formProps.feedback]);

  const minRequiredBalance =
    BigInt(transactionFee) + BigInt(getTotalSpendingAmount(transactionJSON));
  const { recipientChain, sendingChain } = formProps;
  const composedFees = [
    {
      title: 'Transaction',
      value: getFeeStatus({
        fee: Number(convertFromBaseDenom(transactionFee, formProps.fields.token)),
        tokenSymbol,
        customFee,
      }),
      components,
    },
    {
      title: 'Message',
      value: getFeeStatus({
        fee: Number(
          convertFromBaseDenom(transactionJSON.params.messageFee || 0, formProps.fields.token)
        ),
        tokenSymbol,
        customFee,
      }),
      isHidden: !transactionJSON.params.messageFee,
      components: [],
    },
  ];

  formProps.composedFees = composedFees;
  transactionJSON.fee = transactionFee;

  // eslint-disable-next-line max-statements
  const onSubmit = async () => {
    setIsRunningDryRun(true);
    const moduleCommand = formProps.moduleCommand;
    const paramsSchema = moduleCommandSchemas[moduleCommand];
    const transaction = fromTransactionJSON(transactionJSON, paramsSchema);

    if (joinModuleAndCommand(transactionJSON) !== MODULE_COMMANDS_NAME_MAP.registerMultisignature) {
      const [error, dryRunResult] = await to(
        dryRun({
          paramsSchema,
          transaction,
          skipVerify: true,
          serviceUrl: mainChainNetwork.serviceUrl,
        })
      );

      const transactionErrorMessage =
        error?.message ||
        (dryRunResult?.data?.result === TransactionExecutionResult.FAIL
          ? dryRunResult?.data?.events.map((e) => e.name).join(', ')
          : dryRunResult?.data?.errorMessage);

      if (transactionErrorMessage) {
        setIsRunningDryRun(false);
        return setFeedBack(transactionErrorMessage);
      }
    }

    setIsRunningDryRun(false);
    return onConfirm(formProps, transactionJSON, selectedPriority, composedFees);
  };

  if (recipientChain && sendingChain) {
    formProps.recipientChain = recipientChain;
    formProps.sendingChain = sendingChain;
  }

  return (
    <Box className={className}>
      {children}
      <TransactionPriority
        token={formProps.fields?.token}
        fee={transactionFee}
        minFee={minimumFee}
        customFee={customFee ? customFee.value : undefined}
        moduleCommand={formProps.moduleCommand}
        setCustomFee={setCustomFee}
        priorityOptions={priorityOptions}
        selectedPriority={selectedPriority.selectedIndex}
        setSelectedPriority={selectTransactionPriority}
        loadError={prioritiesLoadError}
        isLoading={loadingPriorities || isLoadingFee}
        composedFees={composedFees}
      />
      <Feedback
        feedback={feedback}
        minRequiredBalance={formProps.enableMinimumBalanceFeedback && minRequiredBalance.toString()}
        token={formProps.enableMinimumBalanceFeedback && (formProps.fields?.token || {})}
      />
      <BoxFooter>
        <PrimaryButton
          className="confirm-btn"
          onClick={onSubmit}
          isLoading={isRunningDryRun}
          disabled={
            !formProps.isFormValid ||
            minRequiredBalance > BigInt(formProps.fields?.token?.availableBalance || 0) ||
            !isFetched
          }
        >
          {buttonTitle ?? t('Continue')}
        </PrimaryButton>
      </BoxFooter>
    </Box>
  );
};

export default TxComposer;
