import React from 'react';
import { Button, PrimaryButton } from '../toolbox/buttons/button';
import styles from './confirmVotes.css';
import Checkbox from '../toolbox/sliderCheckbox';
import fees from '../../constants/fees';
import { fromRawLsk } from '../../utils/lsk';

class ConfirmVotes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      didSend: false,
    };
  }

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
        body: t('Your votes are being processed. It may take up to 10 minutes for it to be secured in the blockchain.'),
      };
    }
    updateList(false);
    nextStep(message);
  }

  votePlacedDelayed(value) {
    this.setState({ didSend: true });
    this.timeout = setTimeout(() => {
      this.props.votePlaced(value);
    }, 120);
  }

  render() {
    const {
      t, prevStep, votePlaced, skipped,
      votes, account, secondPassphrase, passphrase,
    } = this.props;
    const data = {
      account,
      votes,
      passphrase: passphrase.value,
      secondSecret: secondPassphrase.value,
      goToNextStep: this.goToNextStep.bind(this),
    };

    return (
      <div className={styles.wrapper}>
        <article className={styles.content}>
          <h2 className={styles.header}>{account.hwInfo && account.hwInfo.deviceId ?
            t('Confirm on Ledger') : t('Final confirmation') }</h2>
          <p className={styles.message}>
            {t('Are you certain of your choice?')}
          </p>
          <PrimaryButton
            className={`${styles.confirmButton} confirm`}
            onClick={() => { votePlaced(data); }}>{t('Confirm (Fee: 1 LSK)')}</PrimaryButton>
          <Button
            className={`${styles.backButton} back`}
            onClick={() => prevStep({ reset: skipped })}>{t('Back')}</Button>
          <Checkbox
            className={`${styles.checkbox} confirmSlider`}
            disabled={this.state.didSend}
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

