import React from 'react';
import { Button, PrimaryButton } from '../toolbox/buttons/button';
import styles from './confirmVotes.css';
import Checkbox from '../toolbox/sliderCheckbox';
import fees from '../../constants/fees';
import { fromRawLsk } from '../../utils/lsk';

class ConfirmVotes extends React.Component {
  componentDidMount() {
    if (typeof this.props.onMount === 'function') {
      this.props.onMount(false, 'ConfirmVotes');
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  goToNextStep({ success, text }) {
    const { t, updateList, nextStep } = this.props;
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
  }

  votePlacedDelayed(value) {
    this.timeout = setTimeout(() => {
      this.props.votePlaced(value);
    }, 120);
  }

  render() {
    const {
      t, prevStep, votePlaced, activePeer, skipped,
      votes, account, secondPassphrase, passphrase,
    } = this.props;
    const data = {
      activePeer,
      account,
      votes,
      passphrase: passphrase.value,
      secondSecret: secondPassphrase.value,
      goToNextStep: this.goToNextStep.bind(this),
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
          <Button
            className={`${styles.backButton} back`}
            onClick={() => prevStep({ reset: skipped })}>{t('Back')}</Button>
          <Checkbox
            className={`${styles.checkbox} confirmSlider`}
            label={t(`Confirm (Fee: ${fromRawLsk(fees.vote)} LSK)`)}
            icons={{
              done: 'checkmark',
            }}
            onChange={this.votePlacedDelayed.bind(this, data)}
            input={{
              value: 'confirm-vote',
            }}/>
        </article>
      </div>
    );
  }
}

export default ConfirmVotes;

