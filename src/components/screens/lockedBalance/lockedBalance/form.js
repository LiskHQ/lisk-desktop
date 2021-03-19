import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import to from 'await-to-js';
import { MODULE_ASSETS, actionTypes, tokenMap } from '@constants';
import { toRawLsk } from '@utils/lsk';
import Piwik from '@utils/piwik';
import { getUnlockableUnlockingObjects } from '@utils/account';
import { create } from '@utils/api/transaction';
import Box from '../../../toolbox/box';
import BoxContent from '../../../toolbox/box/content';
import BoxFooter from '../../../toolbox/box/footer';
import BoxHeader from '../../../toolbox/box/header';
import { PrimaryButton } from '../../../toolbox/buttons';
import LiskAmount from '../../../shared/liskAmount';
import styles from './lockedBalance.css';

const ButtonTitle = ({ unlockableBalance, t }) => {
  if (unlockableBalance === 0) {
    return <>{t('Nothing available to unlock')}</>;
  }
  return (
    <>
      {t('Unlock')}
      {' '}
      <LiskAmount val={unlockableBalance} token={tokenMap.LSK.key} />
    </>
  );
};

const Form = ({
  t,
  children,
  nextStep,
  data,
}) => {
  const {
    account,
    customFee,
    fee,
    currentBlockHeight,
    unlockableBalance,
  } = data;
  const dispatch = useDispatch();
  const network = useSelector(state => state.network);

  const onClickUnlock = async () => {
    Piwik.trackingEvent('Send_UnlockTransaction', 'button', 'Next step');
    const selectedFee = customFee ? customFee.value : fee.value;
    const txData = {
      nonce: account.sequence?.nonce,
      fee: `${toRawLsk(parseFloat(selectedFee))}`,
      passphrase: account.passphrase,
      unlockingObjects: getUnlockableUnlockingObjects(account.dpos?.unlocking, currentBlockHeight),
      network,
    };

    const [error, tx] = await to(
      create({
        ...txData,
        transactionType: MODULE_ASSETS.unlockToken,
        network,
      }, tokenMap.LSK.key),
    );

    if (!error) {
      dispatch({
        type: actionTypes.transactionCreatedSuccess,
        data: tx,
      });
      nextStep({ transactionInfo: tx });
    } else {
      dispatch({
        type: actionTypes.transactionCreatedError,
        data: error,
      });
      nextStep({ error });
    }
  };

  return (
    <Box className={styles.wrapper}>
      <BoxHeader className={styles.header}>
        <h1>{t('Locked balance details')}</h1>
      </BoxHeader>
      <BoxContent className={styles.content}>
        <p>{t('Find details of your locked balance and the unlock waiting period. Use this panel to submit an unlock request when waiting periods are over.')}</p>
        { children }
      </BoxContent>
      <BoxFooter>
        <PrimaryButton
          className="unlock-btn"
          onClick={onClickUnlock}
          disabled={unlockableBalance === 0}
        >
          <ButtonTitle unlockableBalance={unlockableBalance} t={t} />
        </PrimaryButton>
      </BoxFooter>
    </Box>
  );
};

export default withTranslation()(Form);
