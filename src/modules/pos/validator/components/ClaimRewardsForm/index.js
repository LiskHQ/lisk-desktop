import React, { useMemo } from 'react';
import classNames from 'classnames';
import BoxHeader from '@theme/box/header';
import { useTranslation } from 'react-i18next';
import { MODULE_COMMANDS_NAME_MAP } from '@transaction/configuration/moduleCommand';
import { useTokenBalances } from '@token/fungible/hooks/queries';
import TxComposer from '@transaction/components/TxComposer';
import { useCurrentAccount } from '@account/hooks';
import getRewardsClaimableHeader from '@pos/validator/components/ClaimRewardsForm/utils/getRewardsClaimableHeader';
import RewardsClaimableRow from '@pos/validator/components/ClaimRewardsForm/RewardsClaimableRow';
import Table from '@theme/table';
import { useValidatorRewardsWithToken } from '@pos/reward/hooks/queries';
import { usePosConstants } from '../../hooks/queries';
import styles from './ClaimRewardsForm.css';

const ClaimRewardsForm = ({ nextStep }) => {
  const { t } = useTranslation();
  const [
    {
      metadata: { address },
    },
  ] = useCurrentAccount();

  const { validatorRewardsWithToken } = useValidatorRewardsWithToken();

  const { data: posConstants, isLoading: isGettingPosConstants } = usePosConstants();
  const { data: tokens } = useTokenBalances({
    config: { params: { tokenID: posConstants?.data?.posTokenID, address } },
    options: { enabled: !isGettingPosConstants },
  });
  const token = useMemo(() => tokens?.data?.[0] || {}, [tokens]);
  const onConfirm = (formProps, transactionJSON, selectedPriority, fees) => {
    nextStep({
      formProps,
      transactionJSON,
      selectedPriority,
      fees,
    });
  };

  const unlockBalanceFormProps = {
    moduleCommand: MODULE_COMMANDS_NAME_MAP.claimRewards,
    isFormValid: validatorRewardsWithToken?.length > 0 && !!Object.keys(token).length,
    enableMinimumBalanceFeedback: true,
    fields: { token },
  };

  const rewardsClaimableHeader = getRewardsClaimableHeader(t);

  return (
    <section className={classNames(styles.ClaimRewardsForm)}>
      <TxComposer
        onConfirm={onConfirm}
        formProps={unlockBalanceFormProps}
        buttonTitle={t('Claim rewards')}
      >
        <>
          <BoxHeader>
            <h2 className={styles.title}>{t('Claim rewards')}</h2>
          </BoxHeader>
          <p className={styles.description}>
            {t(
              'Below are the details of your reward balances, once you click "Claim rewards" the rewarded tokens will be added to your wallet.'
            )}
          </p>
          <div className={styles.tableContainer}>
            <Table
              showHeader
              isLoading={!validatorRewardsWithToken}
              header={rewardsClaimableHeader}
              additionalRowProps={{ rewardsClaimableHeader }}
              headerClassName={styles.tableHeader}
              data={validatorRewardsWithToken || []}
              row={RewardsClaimableRow}
            />
          </div>
        </>
      </TxComposer>
    </section>
  );
};

export default ClaimRewardsForm;
