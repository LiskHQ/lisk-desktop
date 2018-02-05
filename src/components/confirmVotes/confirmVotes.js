import React from 'react';
import { Button, PrimaryButton } from '../toolbox/buttons/button';
import styles from './confirmVotes.css';

class ConfirmVotes extends React.Component {
  render() {
    const { t, prevStep, votePlaced, activePeer,
      votes, account, secondPassphrase, passphrase, nextStep } = this.props;

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
            {t('We will take care of your transaction as soon as you are online again.')}
          </p>
          <PrimaryButton
            className={`${styles.confirmButton} confirm`}
            onClick={() => { votePlaced(data); }}>{t('Confirm (Fee: 1 LSK)')}</PrimaryButton>
          <Button className='back' onClick={() => prevStep()}>{t('Back')}</Button>
        </article>
      </div>
    );
  }
}

export default ConfirmVotes;

