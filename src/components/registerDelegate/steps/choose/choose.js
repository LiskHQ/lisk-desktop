import React from 'react';
import TransitionWrapper from '../../../toolbox/transitionWrapper';
import Fees from '../../../../constants/fees';
import { fromRawLsk } from '../../../../utils/lsk';
import { PrimaryButton } from '../../../toolbox/buttons/button';
import { extractPublicKey } from '../../../../utils/api/account';
// import { handleChange } from '../../../../utils/form';
// eslint-disable-next-line import/no-named-as-default
import PassphraseInput from '../../../passphraseInput';
import Input from '../../../toolbox/inputs/input';

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
      delegateName: {
        value: '',
        error: '',
      },
    };
    this.delegateNameRegEx = new RegExp(/[a-zA-Z0-9!@$&_.]+/g);
    this.delegateNameMaxChars = 20; // !@$&_.
  }

  hasEnoughLSK() {
    return (fromRawLsk(this.props.account.balance) * 1
    > fromRawLsk(Fees.registerDelegate) * 1);
  }

  checkSufficientFunds() {
    // TODO: uncomment
    /*
    * evt
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
    const publicKeyMap = {
      passphrase: 'publicKey',
      secondPassphrase: 'secondPublicKey',
    };
    const expectedPublicKey = this.props.account[publicKeyMap[name]];

    if (expectedPublicKey && expectedPublicKey !== extractPublicKey(value)) {
      error = this.props.t('Entered passphrase does not belong to the active account');
    }
    this.setState({
      [name]: {
        value,
        error: typeof error === 'string' ? error : undefined,
      },
    });
  }

  validateDelegateName(name, value) {
    let error;

    const nameMatchRegEx = value.match(this.delegateNameRegEx);
    if (!value ||
        (typeof value !== 'string') ||
        nameMatchRegEx.length > 1 ||
        nameMatchRegEx[0].length !== value.length) {
      error = this.props.t('Max 20 characters a-z 0-1, no special characters except “!@$&_.”');
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
    this.props.signWithSecondPass(this.state.secondPassphrase.value);
    this.setState({ step: 'confirm' });
  }

  handleDelegateNameSubmit(evt) {
    evt.preventDefault();
    this.props.submitDelegate(this.state);
  }

  render() {
    const { t } = this.props;
    const hasEnoughLSK = true; // TODO: this.hasEnoughLSK();
    const isDelegate = false; // TODO: this.props.account.isDelegate;
    const firstPassHasError = (!typeof this.state.passphrase.value === 'string' ||
      this.state.passphrase.error !== undefined);
    const seccondPassHasError = (!typeof this.state.secondPassphrase.value === 'string' ||
      this.state.secondPassphrase.error !== undefined);
    const delegateNameHasError = (!typeof this.state.delegateName.value === 'string' ||
      this.state.delegateName.error !== undefined);
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
                  disabled={seccondPassHasError}
                  label={t('Next')}
                  className={`${styles.chooseNameBtn} sign-second-pass-btn`}
                  onClick={this.handleSecondPassSubmit.bind(this)}
                />
              </form>
            </div>
          </div>
        </TransitionWrapper>

        <TransitionWrapper current={this.state.step} step='confirm'>
          <div className={styles.container}>
            <header>
              <h5 className={styles.heading}>
                {t('Choose your name')}
              </h5>
            </header>
            <div className={styles.form}>
              <form onSubmit={this.handleDelegateNameSubmit.bind(this)}>
                <Input label={this.props.t('Delegate name')} required={true}
                  autoFocus={true}
                  className='delegate-name'
                  onChange={this.validateDelegateName.bind(this, 'delegateName')}
                  error={this.state.delegateName.error}
                  value={this.state.delegateName.value} />

                <PrimaryButton
                  disabled={delegateNameHasError}
                  label={t('Next')}
                  className={`${styles.chooseNameBtn} submit-delegate-name`}
                  onClick={this.handleDelegateNameSubmit.bind(this)}
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
