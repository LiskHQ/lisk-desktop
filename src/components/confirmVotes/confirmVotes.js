import React from 'react';
import { Button, PrimaryButton } from '../toolbox/buttons/button';
import styles from './confirmVotes.css';

const ConfirmVotes = ({ t, prevStep, votePlaced, activePeer, skipped, updateList,
  votes, account, secondPassphrase, passphrase, nextStep }) => {
  const goToNextStep = ({ success, text }) => {
    let message = {
      title: t('Error'),
      success: false,
      body: text,
    };
    if (success) {
      message = {
        title: t('Votes submitted'),
        success: true,
        body: t('You’re votes are being processed and will be confirmed. It may take up to 10 minutes to be secured in the blockchain.'),
      };
    }
    updateList(false);
    nextStep(message);
  };


  const data = {
    activePeer,
    account,
    votes,
    passphrase: passphrase.value,
    secondSecret: secondPassphrase.value,
    goToNextStep,
  };

  return (
    <div className={styles.wrapper}>
      <article className={styles.content}>
        <h2 className={styles.header}>{t('Final confirmation')}</h2>
        <p className={styles.message}>
          {t('Are you sure to confirm this selection?')}
        </p>
        <PrimaryButton
          className={`${styles.confirmButton} confirm`}
          onClick={() => { votePlaced(data); }}>{t('Confirm (Fee: 1 LSK)')}</PrimaryButton>
        <Button className='back' onClick={() => prevStep({ reset: skipped })}>{t('Back')}</Button>
      </article>
    </div>
  );
};

export default ConfirmVotes;

