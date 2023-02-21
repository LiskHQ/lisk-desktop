import React from 'react';
import { useTranslation } from 'react-i18next';
import { MODULE_COMMANDS_NAME_MAP } from '@transaction/configuration/moduleCommand';
import BoxContent from 'src/theme/box/content';
import BoxHeader from 'src/theme/box/header';
import { useLatestBlock } from '@block/hooks/queries/useLatestBlock';
import TxComposer from '@transaction/components/TxComposer';
import getUnlockButtonTitle from '../../utils/getUnlockButtonTitle';
import useUnlockableCalculator from '../../hooks/useUnlockableCalculator';
import BalanceTable from './BalanceTable';
import styles from './unlockBalance.css';

// eslint-disable-next-line max-statements
const UnlockBalanceForm = ({ nextStep }) => {
  const { t } = useTranslation();
  const { data: latestBlock } = useLatestBlock();
  const { lockedPendingUnlocks, sentStakesAmount, unlockableAmount } = useUnlockableCalculator();

  const onConfirm = async (formProps, transactionJSON, selectedPriority, fees) => {
    nextStep({
      selectedPriority,
      formProps,
      transactionJSON,
      fees,
    });
  };

  const unlockBalanceFormProps = {
    moduleCommand: MODULE_COMMANDS_NAME_MAP.unlock,
    isValid: unlockableAmount > 0,
    unlockableAmount,
  };

  return (
    <section className={styles.wrapper}>
      <TxComposer
        onConfirm={onConfirm}
        formProps={unlockBalanceFormProps}
        buttonTitle={getUnlockButtonTitle(unlockableAmount, t)}
      >
        <>
          <BoxHeader className={styles.header}>
            <h2>{t('Pending unlock details')}</h2>
          </BoxHeader>
          <BoxContent className={styles.container}>
            <p>
              {t(
                'Below are the details of your staked balances and rewards, as well as the unlock waiting periods. From here you can submit an unlock transaction when waiting periods are over.'
              )}
            </p>
            <BalanceTable
              sentStakesAmount={sentStakesAmount}
              unlockableAmount={unlockableAmount}
              currentBlockHeight={latestBlock?.height ?? 0}
              lockedPendingUnlocks={lockedPendingUnlocks}
            />
          </BoxContent>
        </>
      </TxComposer>
    </section>
  );
};

export default UnlockBalanceForm;
