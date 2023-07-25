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
import { convertFromBaseDenom, convertToBaseDenom } from '@token/fungible/utils/helpers';
import { useDeprecatedAccount } from '@account/hooks/useDeprecatedAccount';
import { useTransactionFee } from '@transaction/hooks/useTransactionFee';
import { PrimaryButton } from 'src/theme/buttons';
import to from 'await-to-js';
import { useCommandSchema } from 'src/modules/network/hooks';
import useSettings from 'src/modules/settings/hooks/useSettings';
import Feedback from './Feedback';
import { getFeeStatus } from '../../utils/helpers';
import { fromTransactionJSON, splitModuleAndCommand } from '../../utils';
import { dryRun } from '../../api';
import { TransactionExecutionResult } from '../../constants';

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

  const { minimumFee, components, transactionFee } = useTransactionFee({
    selectedPriority,
    transactionJSON,
    isFormValid: formProps.isFormValid,
    senderAddress: address,
    extraCommandFee: formProps.extraCommandFee,
  });

  useEffect(() => {
    if (typeof onComposed === 'function') {
      onComposed({}, formProps, {
        ...transactionJSON,
        fee: convertToBaseDenom(transactionFee, formProps.fields.token),
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

    console.log('--->>>', transaction, transactionJSON);

    const [error, dryRunResult] = await to(
      dryRun({
        paramsSchema,
        transaction,
        skipVerify: false,
        serviceUrl: mainChainNetwork.serviceUrl,
      })
    );

    const transactionErrorMessage =
      error?.message ||
      (dryRunResult?.data?.result === TransactionExecutionResult.FAIL
        ? dryRunResult?.data?.events.map((e) => e.name).join(', ')
        : dryRunResult?.data?.errorMessage);

    if (transactionErrorMessage) setFeedBack(transactionErrorMessage);

    setIsRunningDryRun(false);
    onConfirm(formProps, transactionJSON, selectedPriority, composedFees);
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
        isLoading={loadingPriorities}
        composedFees={composedFees}
      />
      <Feedback
        feedback={feedback}
        // minRequiredBalance={minRequiredBalance.toString()}
        // token={formProps.fields?.token || {}}
      />
      <BoxFooter>
        <PrimaryButton
          className="confirm-btn"
          onClick={onSubmit}
          isLoading={isRunningDryRun}
          disabled={
            !formProps.isFormValid ||
            minRequiredBalance > BigInt(formProps.fields?.token?.availableBalance || 0)
          }
        >
          {buttonTitle ?? t('Continue')}
        </PrimaryButton>
      </BoxFooter>
    </Box>
  );
};

export default TxComposer;
