import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import to from 'await-to-js';
import Box from '../../../toolbox/box';
import BoxContent from '../../../toolbox/box/content';
import BoxFooter from '../../../toolbox/box/footer';
import BoxHeader from '../../../toolbox/box/header';
import { PrimaryButton } from '../../../toolbox/buttons';
import { toRawLsk, fromRawLsk } from '../../../../utils/lsk';
import Piwik from '../../../../utils/piwik';
import { getAvailableUnlockingTransactions } from '../../../../utils/account';
import { create } from '../../../../utils/api/lsk/transactions';
import actionTypes from '../../../../constants/actions';
import transactionTypes from '../../../../constants/transactionTypes';
import styles from './lockedBalance.css';

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
    currentBlock,
    availableBalance,
  } = data;
  const dispatch = useDispatch();

  const onClickUnlock = async () => {
    Piwik.trackingEvent('Send_SubmitTransaction', 'button', 'Next step');
    const selectedFee = customFee ? customFee.value : fee.value;
    const txData = {
      nonce: account.nonce,
      fee: `${toRawLsk(parseFloat(selectedFee))}`,
      passphrase: account.passphrase,
      unlockingObjects: getAvailableUnlockingTransactions(account, currentBlock),
    };

    const network = useSelector(state => state.network);
    const [error, tx] = await to(create(
      { ...txData, network },
      transactionTypes().unlockToken.key,
    ));

    if (error) {
      dispatch({
        type: actionTypes.transactionCreatedError,
        data: error,
      });
    }

    dispatch({
      type: actionTypes.transactionCreatedSuccess,
      data: tx,
    });

    nextStep({ transactionInfo: tx });
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
          disabled={availableBalance === 0}
        >
          {t(`Unlock ${fromRawLsk(availableBalance)} LSK`)}
        </PrimaryButton>
      </BoxFooter>
    </Box>
  );
};

export default withTranslation()(Form);
