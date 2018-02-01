import React from 'react';
import { Button, PrimaryButton } from '../toolbox/buttons/button';
import styles from './confirmVotes.css';

class ResultBox extends React.Component {
  render() {
    const { t, prevStep, votePlaced, activePeer, finalCallback,
      votes, account, secondPassphrase, passphrase } = this.props;
    const data = {
      activePeer,
      account,
      votes,
      passphrase: passphrase.value,
      secondSecret: secondPassphrase.value,
    };

    return (
      <div className={styles.wrapper}>
        <article className={styles.content}>
          <h2 className={styles.header}>{t('Final confirmation')}</h2>
          <p className={styles.message}>
            {t('We will take care of your transaction as soon as you are online again.')}
          </p>
          <PrimaryButton
            className={styles.confirmButton}
            onClick={() => { votePlaced(data); finalCallback(); }}>{t('Confirm (Fee: 1 LSK)')}</PrimaryButton>
          <Button onClick={() => prevStep()}>{t('Back')}</Button>
        </article>
      </div>
    );
  }
}

export default ResultBox;

