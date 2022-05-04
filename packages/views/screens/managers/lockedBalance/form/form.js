import React from 'react';
import { withTranslation } from 'react-i18next';
import { tokenMap } from '@token/configuration/tokens';
import Box from '@theme/box';
import BoxContent from '@basics/box/content';
import BoxFooter from '@basics/box/footer';
import BoxHeader from '@basics/box/header';
import { PrimaryButton } from '@basics/buttons';
import LiskAmount from '@shared/liskAmount';
import styles from './lockedBalance.css';

const ButtonTitle = ({ unlockableBalance, t }) => {
  if (unlockableBalance === 0) {
    return <>{t('Nothing available to unlock')}</>;
  }
  return (
    <>
      {t('Unlock')}{' '}
      <LiskAmount val={unlockableBalance} token={tokenMap.LSK.key} />
    </>
  );
};

const Form = ({ t, children, nextStep, data }) => {
  const { customFee, fee, unlockableBalance } = data;

  const onClick = async () => {
    nextStep({
      rawTransaction: {
        selectedFee: customFee ? customFee.value : fee.value,
      },
    });
  };

  return (
    <Box className={styles.wrapper}>
      <BoxHeader className={styles.header}>
        <h1>{t('Locked balance details')}</h1>
      </BoxHeader>
      <BoxContent className={styles.content}>
        <p>
          {t(
            'Below are the details of your locked balances and the unlock waiting periods. From here you can submit an unlock transaction when waiting periods are over.'
          )}
        </p>
        {children}
      </BoxContent>
      <BoxFooter>
        <PrimaryButton
          className="unlock-btn"
          onClick={onClick}
          disabled={unlockableBalance === 0}
        >
          <ButtonTitle unlockableBalance={unlockableBalance} t={t} />
        </PrimaryButton>
      </BoxFooter>
    </Box>
  );
};

export default withTranslation()(Form);
