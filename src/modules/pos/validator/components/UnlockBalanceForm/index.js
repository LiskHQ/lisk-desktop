/* eslint-disable max-statements */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MODULE_COMMANDS_NAME_MAP } from '@transaction/configuration/moduleCommand';
import { useTokenBalances } from '@token/fungible/hooks/queries';
import BoxContent from 'src/theme/box/content';
import BoxHeader from 'src/theme/box/header';
import { useLatestBlock } from '@block/hooks/queries/useLatestBlock';
import TxComposer from '@transaction/components/TxComposer';
import getUnlockButtonTitle from '../../utils/getUnlockButtonTitle';
import useUnlockableCalculator from '../../hooks/useUnlockableCalculator';
import BalanceTable from './BalanceTable';
import styles from './unlockBalance.css';
import { usePosConstants } from '../../hooks/queries';

const UnlockBalanceForm = ({ nextStep }) => {
  const { t } = useTranslation();
  const { data: latestBlock } = useLatestBlock();
  const { lockedPendingUnlocks, sentStakesAmount, unlockedAmount } = useUnlockableCalculator();
  const { data: posConstants, isLoading: isGettingPosConstants } = usePosConstants();
  const { data: tokens } = useTokenBalances({
    config: { params: { tokenID: posConstants?.posTokenID } },
    options: { enabled: !isGettingPosConstants },
  });
  const posToken = tokens?.data?.[0] || {};

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
      token: posToken,
    },
    isFormValid: unlockedAmount > 0,
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
            <h2>{t('Pending unlock details')}</h2>
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
              currentBlockHeight={latestBlock?.height ?? 0}
              lockedPendingUnlocks={lockedPendingUnlocks}
              token={posToken}
            />
          </BoxContent>
        </>
      </TxComposer>
    </section>
  );
};

export default UnlockBalanceForm;
