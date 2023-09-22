/* eslint-disable complexity */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import useTransactionPriority from '@transaction/hooks/useTransactionPriority';
import { useSchemas } from '@transaction/hooks/queries/useSchemas';
import { useAuth } from '@auth/hooks/queries';
import { useCurrentAccount } from '@account/hooks';
import Box from 'src/theme/box';
import BoxFooter from 'src/theme/box/footer';
import TransactionPriority from '@transaction/components/TransactionPriority';
import {
  fromTransactionJSON,
  joinModuleAndCommand,
  splitModuleAndCommand,
} from '@transaction/utils';
import { dryRunTransaction } from '@transaction/api';
import { getTotalSpendingAmount } from '@transaction/utils/transaction';
import { convertFromBaseDenom, convertToBaseDenom } from '@token/fungible/utils/helpers';
import { useDeprecatedAccount } from '@account/hooks/useDeprecatedAccount';
import { useTransactionFee } from '@transaction/hooks/useTransactionFee';
import { useTokenBalances } from '@token/fungible/hooks/queries';
import { PrimaryButton } from 'src/theme/buttons';
import { useCommandSchema } from 'src/modules/network/hooks';
import Feedback from './Feedback';
import { getFeeStatus } from '../../utils/helpers';
import { MODULE_COMMANDS_NAME_MAP } from '../../configuration/moduleCommand';
import { emptyTransactionsData } from '../../store/actions';

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
  const reduxDispatch = useDispatch();

  useSchemas();
  useDeprecatedAccount();
  const [
    {
      metadata: { pubkey, address },
    },
  ] = useCurrentAccount();
  const { data: auth } = useAuth({ config: { params: { address } } });
  const { fields } = formProps;
  const [customFee, setCustomFee] = useState({});
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
    minimumFee = BigInt(0),
    components = [],
    transactionFee = BigInt(0),
    messageFeeTokenID,
    messageFee,
    isFetched = true,
    isLoading: isLoadingFee,
    feeEstimateError,
    feeTokenID,
  } = useTransactionFee({
    selectedPriority,
    transactionJSON,
    isFormValid: formProps.isFormValid,
    senderAddress: address,
    extraCommandFee: formProps.extraCommandFee,
  });

  const { data: { data: feeTokens } = {} } = useTokenBalances({
    config: { params: { tokenID: feeTokenID, limit: 1 } },
    options: { enabled: !!feeTokenID },
  });
  const { data: { data: messageFeeTokens } = {} } = useTokenBalances({
    config: { params: { tokenID: messageFeeTokenID, limit: 1 } },
    options: { enabled: !!messageFeeTokenID },
  });
  const feeToken = feeTokens?.[0];
  const messageFeeToken = messageFeeTokens?.[0];

  if (isFetched && fields?.sendingChain?.chainID !== fields?.recipientChain?.chainID) {
    transactionJSON.params = {
      ...transactionJSON.params,
      messageFee,
      messageFeeTokenID,
    };
  }

  useEffect(() => {
    reduxDispatch(emptyTransactionsData());
  }, []);

  useEffect(() => {
    if (feeEstimateError) {
      setFeedBack([feeEstimateError]);
    }
  }, [feeEstimateError]);

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
    setFeedBack(null);
  }, [formProps.fields]);

  useEffect(() => {
    setFeedBack(formProps.feedback);
  }, [formProps.feedback]);

  useEffect(() => {
    setCustomFee({});
  }, [minimumFee, messageFee]);

  const minRequiredBalance =
    BigInt(transactionFee) + BigInt(getTotalSpendingAmount(transactionJSON));
  const { recipientChain, sendingChain } = formProps;
  const composedFees = [
    {
      title: 'Transaction',
      label: 'transactionFee',
      token: feeToken,
      value: getFeeStatus({
        fee: Number(convertFromBaseDenom(transactionFee, feeToken)),
        tokenSymbol: feeToken?.symbol,
        customFee: customFee.value?.transactionFee
          ? { value: customFee.value?.transactionFee }
          : null,
      }),
      components: components.map((component) => ({
        ...component,
        feeToken,
      })),
    },
    {
      title: 'Message',
      label: 'messageFee',
      token: messageFeeToken,
      value: getFeeStatus({
        fee: Number(convertFromBaseDenom(transactionJSON.params.messageFee || 0, messageFeeToken)),
        tokenSymbol: messageFeeToken?.symbol,
        customFee: customFee.value?.messageFee ? { value: customFee.value?.messageFee } : null,
      }),
      isHidden: !transactionJSON.params.messageFee,
      components: [],
    },
  ];
  formProps.composedFees = composedFees;
  // eslint-disable-next-line no-extra-boolean-cast
  transactionJSON.fee = !!customFee.value?.transactionFee
    ? convertToBaseDenom(customFee.value.transactionFee, feeToken)
    : transactionFee;

  // eslint-disable-next-line max-statements
  const onSubmit = async () => {
    setIsRunningDryRun(true);
    const moduleCommand = formProps.moduleCommand;
    const paramsSchema = moduleCommandSchemas[moduleCommand];
    const transaction = fromTransactionJSON(transactionJSON, paramsSchema);

    if (joinModuleAndCommand(transactionJSON) !== MODULE_COMMANDS_NAME_MAP.registerMultisignature) {
      const { isOk, errorMessage } = await dryRunTransaction({
        paramsSchema,
        transaction,
      });

      if (!isOk && errorMessage) {
        setIsRunningDryRun(false);
        return setFeedBack([errorMessage]);
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
        token={feeToken}
        fee={transactionFee}
        minFee={minimumFee}
        customFee={customFee}
        setCustomFee={setCustomFee}
        priorityOptions={priorityOptions}
        selectedPriority={selectedPriority.selectedIndex}
        setSelectedPriority={selectTransactionPriority}
        loadError={prioritiesLoadError}
        isLoading={loadingPriorities || isLoadingFee}
        composedFees={composedFees}
        minRequiredBalance={minRequiredBalance}
        computedMinimumFees={{ transactionFee: minimumFee, messageFee }}
        formProps={formProps}
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
            !isFetched ||
            !!feeEstimateError ||
            isLoadingFee
          }
        >
          {buttonTitle ?? t('Continue')}
        </PrimaryButton>
      </BoxFooter>
    </Box>
  );
};

export default TxComposer;
