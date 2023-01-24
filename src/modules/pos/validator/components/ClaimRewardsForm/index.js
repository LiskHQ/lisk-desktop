import React from 'react';
import { useRewardsClaimable } from '@pos/reward/hooks/queries';
import classNames from 'classnames';
import BoxHeader from '@theme/box/header';
import { useTranslation } from 'react-i18next';
import { MODULE_COMMANDS_NAME_MAP } from '@transaction/configuration/moduleCommand';
import TxComposer from '@transaction/components/TxComposer';
import { useCurrentAccount } from '@account/hooks';
import { QueryTable } from '@theme/QueryTable';
import getRewardsClaimableHeader from '@pos/validator/components/ClaimRewardsForm/utils/getRewardsClaimableHeader';
import RewardsClaimableRow from '@pos/validator/components/ClaimRewardsForm/RewardsClaimableRow';
import styles from './ClaimRewardsForm.css';

const ClaimRewardsForm = ({ nextStep }) => {
  const { t } = useTranslation();
  const [{ metadata: { address } }] = useCurrentAccount();
  const { data: rewardsClaimable } = useRewardsClaimable({ config: { params: { address } } });

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
    isValid: rewardsClaimable?.data?.length > 0,
  };

  const rewardsClaimableHeader = getRewardsClaimableHeader(t);

  return (
    <section className={classNames(styles.ClaimRewardsForm)}>
      <TxComposer
        onConfirm={onConfirm}
        formProps={unlockBalanceFormProps}
        buttonTitle="Claim rewards"
      >
        <>
          <BoxHeader>
            <h2 className={styles.title}>{t('Claim rewards')}</h2>
          </BoxHeader>
          <p className={styles.description}>
            {t(
              'Below are the details of your reward balances, you can continue to claim your rewards and they will be transferred to your wallet balance.'
            )}
          </p>
          <div className={styles.tableContainer}>
            <QueryTable
              showHeader
              queryHook={useRewardsClaimable}
              queryConfig={{ config: { params: { address } } }}
              row={RewardsClaimableRow}
              header={rewardsClaimableHeader}
              additionalRowProps={{ rewardsClaimableHeader }}
              headerClassName={styles.tableHeader}
            />
          </div>
        </>
      </TxComposer>
    </section>
  );
};

export default ClaimRewardsForm;
