/* eslint-disable max-statements */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MODULE_COMMANDS_NAME_MAP } from '@transaction/configuration/moduleCommand';
import BoxContent from 'src/theme/box/content';
import BoxHeader from 'src/theme/box/header';
import TxComposer from '@transaction/components/TxComposer';
import getUnlockButtonTitle from '../../utils/getUnlockButtonTitle';
import useUnlockableCalculator from '../../hooks/useUnlockableCalculator';
import BalanceTable from './BalanceTable';
import styles from './unlockBalance.css';
import usePosToken from '../../hooks/usePosToken';

const UnlockBalanceForm = ({ nextStep }) => {
  const { t } = useTranslation();
  const { lockedPendingUnlocks, sentStakesAmount, unlockedAmount } = useUnlockableCalculator();
  const { token } = usePosToken();

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
    fields: {
      token,
    },
    isFormValid: unlockedAmount > 0,
    enableMinimumBalanceFeedback: true,
    unlockedAmount,
  };

  return (
    <section className={styles.wrapper}>
      <TxComposer
        onConfirm={onConfirm}
        formProps={unlockBalanceFormProps}
        buttonTitle={getUnlockButtonTitle(unlockedAmount, t)}
      >
        <>
          <BoxHeader className={styles.header}>
            <h2>{t('Unlock stakes')}</h2>
          </BoxHeader>
          <BoxContent className={styles.container}>
            <p>
              {t(
                'Below are the details of your staked balances, as well as the unlock waiting periods. From here you can submit an unlock transaction when waiting periods are over.'
              )}
            </p>
            <BalanceTable
              sentStakesAmount={sentStakesAmount}
              unlockedAmount={unlockedAmount}
              lockedPendingUnlocks={lockedPendingUnlocks}
              token={token}
            />
          </BoxContent>
        </>
      </TxComposer>
    </section>
  );
};

export default UnlockBalanceForm;
