import React from 'react';
import { useRewardsClaimable, useRewardsClaimableWithTokenMeta } from '@pos/reward/hooks/queries';
import classNames from 'classnames';
import BoxHeader from '@theme/box/header';
import { useTranslation } from 'react-i18next';
import { MODULE_COMMANDS_NAME_MAP } from '@transaction/configuration/moduleCommand';
import TxComposer from '@transaction/components/TxComposer';
import { useCurrentAccount } from '@account/hooks';
import { QueryTable } from '@theme/QueryTable';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './ClaimRewardsForm.css';

const rewardsClaimableHeader = (t) => [
  {
    title: t && t('Token'),
    classList: `${grid['col-xs-3']}`,
  },
  {
    title: t && t('Reward amount'),
    classList: `${grid['col-xs-4']}`,
  },
  {
    title: t && t('Fiat'),
    classList: `${grid['col-xs-1']}`,
  },
];

const RewardsClaimableRow = ({ data }) => {
  const { tokenName, logo, reward, symbol, denomUnits, displayDenom } = data;
  const amountInFiat = reward;
  const denom = denomUnits?.find((denomUnit) => denomUnit.denom === displayDenom);

  return (
    <div className={classNames(styles.rewardsClaimableRow)}>
      <div className={classNames(styles.logoContainer, rewardsClaimableHeader()[0].classList)}>
        <img className={styles.logo} src={logo?.png} />
        <span className={styles.tokenName}>{tokenName}</span>
      </div>
      <div className={classNames(rewardsClaimableHeader()[1].classList)}>
        {`${parseInt(reward, denom)} ${symbol}`}
      </div>
      <div className={classNames(rewardsClaimableHeader()[2].classList)}>{amountInFiat}</div>
    </div>
  );
};

const ClaimRewardsForm = ({ nextStep }) => {
  const { t } = useTranslation();
  const [currentAccount] = useCurrentAccount();
  const address = currentAccount?.metadata?.address;
  const { data: rewardsClaimable } = useRewardsClaimableWithTokenMeta({ config: { params: { address } } });

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
              queryHook={useRewardsClaimableWithTokenMeta}
              queryConfig={{ config: { params: { address } } }}
              row={RewardsClaimableRow}
              header={rewardsClaimableHeader(t)}
              headerClassName={styles.tableHeader}
            />
          </div>
        </>
      </TxComposer>
    </section>
  );
};

export default ClaimRewardsForm;
