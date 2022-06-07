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
  nextStep, customFee, fee,
}) => {
  const { t } = useTranslation();
  const activeToken = useSelector(selectActiveToken);
  const currentBlockHeight = useSelector(selectCurrentBlockHeight);
  const [unlockObjects, lockedInVotes, unlockableBalance] = useUnlockableCalculator();
  const wallet = useSelector(selectActiveTokenAccount);

  const onComposed = async (/* Here I can get the composed tx */) => {
    nextStep({
      rawTransaction: {
        selectedFee: customFee ? customFee.value : fee.value,
      },
    });
  };

  const transaction = {
    moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.unlockToken,
    asset: { unlockObjects },
    isValid: unlockableBalance > 0,
  };

  return (
    <TxComposer
      onComposed={onComposed}
      className={styles.wrapper}
      transaction={transaction}
      buttonTitle={getUnlockButtonTitle(unlockableBalance, activeToken, t)}
    >
      <>
        <BoxHeader className={styles.header}>
          <h1>{t('Locked balance details')}</h1>
        </BoxHeader>
        <BoxContent className={styles.content}>
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
  );
};

export default UnlockBalanceForm;
