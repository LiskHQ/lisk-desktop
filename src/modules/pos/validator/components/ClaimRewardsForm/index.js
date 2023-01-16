import React from 'react';
import { useRewardsClaimable } from '@pos/reward/hooks/queries';
import classNames from 'classnames';
import BoxHeader from '@theme/box/header';
import { useTranslation } from 'react-i18next';
import { MODULE_COMMANDS_NAME_MAP } from '@transaction/configuration/moduleCommand';
import TxComposer from '@transaction/components/TxComposer';
import { useCurrentAccount } from '@account/hooks';
import { QueryTable } from '@theme/QueryTable';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './ClaimRewardsForm.css';

const RewardsClaimableRow = ({ reward, tokenId }) => {
  const token = { id: tokenId, chainName: 'Lisk', symbol: 'LSK' };
  const amountInFiat = reward;

  return (
    <div>
      <div>{token.chainName}</div>
      <div>
        {reward}
        {token.symbol}
      </div>
      <div>{amountInFiat}</div>
    </div>
  );
};

const rewardsClaimableHeader = (t) => [
  {
    title: t('Token'),
    classList: `${grid['col-xs-3']}`,
  },
  {
    title: t('Reward amount'),
    classList: `${grid['col-xs-4']}`,
  },
  {
    title: t('Fiat'),
    classList: `${grid['col-xs-1']}`,
  },
];

const ClaimRewardsForm = ({ nextStep }) => {
  const { t } = useTranslation();
  const [currentAccount] = useCurrentAccount();
  const address = currentAccount?.metadata?.address;

  const onConfirm = (formProps, transactionJSON, selectedPriority, fees) => {
    nextStep({
      formProps,
      transactionJSON,
      selectedPriority,
      fees,
    });
  };

  const unlockBalanceFormProps = {
    moduleCommand: MODULE_COMMANDS_NAME_MAP.unlock,
    isValid: 12 > 0,
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
          <div>
            <p className={styles.description}>
              {t(
                'Below are the details of your reward balances, you can continue to claim your rewards and they will be transferred to your wallet balance.'
              )}
            </p>
            <QueryTable
              showHeader
              queryHook={useRewardsClaimable}
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
