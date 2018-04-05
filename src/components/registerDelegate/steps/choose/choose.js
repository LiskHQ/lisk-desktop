import React from 'react';
import TransitionWrapper from '../../../toolbox/transitionWrapper';
import Fees from '../../../../constants/fees';
import { fromRawLsk } from '../../../../utils/lsk';
import { PrimaryButton } from '../../../toolbox/buttons/button';
import { extractPublicKey } from '../../../../utils/api/account';
// eslint-disable-next-line import/no-named-as-default
import PassphraseInput from '../../../passphraseInput';

import styles from './choose.css';

class Choose extends React.Component {
  constructor() {
    super();
    this.state = {
      step: 'choose',
      passphrase: {
        value: '',
        error: '',
      },
      secondPassphrase: {
        value: '',
        error: '',
      },
    };
  }

  hasEnoughLSK() {
    return (fromRawLsk(this.props.account.balance) * 1
    > fromRawLsk(Fees.registerDelegate) * 1);
  }

  checkSufficientFunds(evt) {
    // TODO: uncomment
    /*
    if (!this.hasEnoughLSK()) {
      evt.preventDefault();
      return;
    }
    */
    this.setState({ step: 'first-pass' });
    // this.props.nextStep({});
  }

  validatePassphrase(name, value) {
    let error;
    if (extractPublicKey(value) !== this.props.account.publicKey) {
      error = this.props.t('Entered passphrase does not belong to the active account');
    }
    this.setState({
      [name]: {
        value,
        error: typeof error === 'string' ? error : undefined,
      },
    });
  }

  handleFirstPassSubmit(evt) {
    evt.preventDefault();
    this.props.signWithFirstPass(this.state.passphrase.value);
    this.setState({ step: 'second-pass' });
  }

  handleSecondPassSubmit(evt) {
    evt.preventDefault();
    this.props.signWithSecondPass(this.state.passphrase.value);
    this.setState({ step: 'confirm' });
  }

  render() {
    const { t } = this.props;
    const hasEnoughLSK = true; // TODO: this.hasEnoughLSK();
    const isDelegate = false; // TODO: this.props.account.isDelegate;
    const firstPassHasError = (!typeof this.state.passphrase.value === 'string' ||
      this.state.passphrase.error);
    return (
      <section>
        <TransitionWrapper current={this.state.step} step='choose'>
          <div className={styles.container}>
            <header>
              <h5 className={styles.heading}>
                {t('Be a delegate')}
              </h5>
            </header>
            <p className={styles.description}>
              {t('Delegates have great responsibility within the Lisk system, securing the blockchain. Becoming a delegate requires the registration of a name. The top 101 delegates are eligible to forge.')}
            </p>
            <div className={styles.form}>
              <form onSubmit={this.checkSufficientFunds.bind(this)}>
                <PrimaryButton
                  disabled={!hasEnoughLSK || isDelegate}
                  label={t('Choose a name')}
                  className={`${styles.chooseNameBtn} choose-name`}
                  onClick={this.checkSufficientFunds.bind(this)}
                />
                {!hasEnoughLSK ? <p className={styles.error}>
                  {t('Insufficient funds (Fee: {{fee}} LSK)', { fee: fromRawLsk(Fees.registerDelegate) })}
                </p> : null }
                {isDelegate ? <p className={styles.error}>
                  {t('You have already registered as a delegate.')}
                </p> : null }
              </form>
            </div>
            <footer>
            </footer>
          </div>
        </TransitionWrapper>
        <TransitionWrapper current={this.state.step} step='first-pass'>
          <div className={styles.container}>
            <header>
              <h5 className={styles.heading}>
                {t('Please sign in with your 1st passphrase')}
              </h5>
            </header>
            <div className={styles.form}>
              <form onSubmit={this.handleFirstPassSubmit.bind(this)}>
                <PassphraseInput
                  error={this.state.passphrase.error}
                  value={this.state.passphrase.value}
                  onChange={this.validatePassphrase.bind(this, 'passphrase')}
                  columns={{ xs: 6, sm: 4, md: 2 }}
                  isFocused={true}
                  className='sing-first-pass-input'
                />

                <PrimaryButton
                  disabled={firstPassHasError}
                  label={t('Next')}
                  className={`${styles.chooseNameBtn} sign-first-pass-btn`}
                  onClick={this.handleFirstPassSubmit.bind(this)}
                />
              </form>
            </div>
          </div>
        </TransitionWrapper>
        <TransitionWrapper current={this.state.step} step='second-pass'>
          <div className={styles.container}>
            <header>
              <h5 className={styles.heading}>
                {t('Please sign in with your 2nd passphrase')}
              </h5>
            </header>
            <div className={styles.form}>
              <form onSubmit={this.handleSecondPassSubmit.bind(this)}>
                <PassphraseInput
                  error={this.state.secondPassphrase.error}
                  value={this.state.secondPassphrase.value}
                  onChange={this.validatePassphrase.bind(this, 'secondPassphrase')}
                  columns={{ xs: 6, sm: 4, md: 2 }}
                  isFocused={true}
                  className='sing-second-pass-input'
                />

                <PrimaryButton
                  disabled={firstPassHasError}
                  label={t('Next')}
                  className={`${styles.chooseNameBtn} sign-second-pass-btn`}
                  onClick={this.handleFirstPassSubmit.bind(this)}
                />
              </form>
            </div>
          </div>
        </TransitionWrapper>
      </section>
    );
  }
}
export default Choose;
