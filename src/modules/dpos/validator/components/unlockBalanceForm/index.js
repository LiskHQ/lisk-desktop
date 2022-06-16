import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import {
  selectCurrentBlockHeight,
  selectActiveTokenAccount,
  selectActiveToken,
} from '@common/store';
import BoxContent from 'src/theme/box/content';
import BoxHeader from 'src/theme/box/header';
import TxComposer from '@transaction/components/TxComposer';
import getUnlockButtonTitle from '../../utils/getUnlockButtonTitle';
import useUnlockableCalculator from '../../hooks/useUnlockableCalculator';
import BalanceTable from './BalanceTable';
import styles from './unlockBalance.css';

const UnlockBalanceForm = ({
  nextStep,
}) => {
  const { t } = useTranslation();
  const activeToken = useSelector(selectActiveToken);
  const currentBlockHeight = useSelector(selectCurrentBlockHeight);
  const [unlockObjects, lockedInVotes, unlockableBalance] = useUnlockableCalculator();
  const wallet = useSelector(selectActiveTokenAccount);

  const onConfirm = async (rawTx) => {
    nextStep({ rawTx });
  };

  const transaction = {
    moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.unlockToken,
    asset: { unlockObjects },
    isValid: unlockableBalance > 0,
  };

  return (
    <section className={styles.wrapper}>
      <TxComposer
        onConfirm={onConfirm}
        transaction={transaction}
        buttonTitle={getUnlockButtonTitle(unlockableBalance, activeToken, t)}
      >
        <>
          <BoxHeader className={styles.header}>
            <h2>{t('Locked balance details')}</h2>
          </BoxHeader>
          <BoxContent className={styles.container}>
            <p>
              {t(
                'Below are the details of your locked balances and the unlock waiting periods. From here you can submit an unlock transaction when waiting periods are over.',
              )}
            </p>
            <BalanceTable
              lockedInVotes={lockedInVotes}
              unlockableBalance={unlockableBalance}
              currentBlockHeight={currentBlockHeight}
              account={wallet}
            />
          </BoxContent>
        </>
      </TxComposer>
    </section>
  );
};

export default UnlockBalanceForm;
