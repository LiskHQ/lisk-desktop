import React from 'react';
import TransitionWrapper from '../../../toolbox/transitionWrapper';
import Fees from '../../../../constants/fees';
import { fromRawLsk } from '../../../../utils/lsk';
import { PrimaryButton } from '../../../toolbox/buttons/button';
import Input from '../../../toolbox/inputs/input';
import { FontIcon } from '../../../fontIcon';

import stepStyles from '../steps.css';
import styles from './choose.css';

class Choose extends React.Component {
  constructor() {
    super();
    this.state = {
      step: 'confirm',
      delegateName: {
        value: '',
        error: '',
      },
    };
    this.delegateNameRegEx = new RegExp(/[a-zA-Z0-9!@$&_.]+/g); // !@$&_.
    this.delegateNameMaxChars = 20;
  }

  hasEnoughLSK() {
    return (fromRawLsk(this.props.account.balance) * 1
    > fromRawLsk(Fees.registerDelegate) * 1);
  }

  checkSufficientFunds(evt) {
    if (!this.hasEnoughLSK()) {
      evt.preventDefault();
      return;
    }
    this.setState({ step: 'choose' });
  }

  validateDelegateName(name, value) {
    let error;

    const charsNotAllowedInName = value.replace(this.delegateNameRegEx, '');
    if (charsNotAllowedInName.length > 0) {
      error = this.props.t(`Characters not allowed: "${charsNotAllowedInName}"`);
    }

    if (!error && value.length > this.delegateNameMaxChars) {
      error = this.props.t('Name too long');
    }

    this.setState({
      [name]: {
        value,
        error: typeof error === 'string' ? error : undefined,
      },
    });

    if (error) {
      return;
    }

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (value === this.state.delegateName.value) {
        this.props.checkDelegateUsernameAvailable(this.state.delegateName.value);
      }
    }, 250);
  }

  handleDelegateNameSubmit(evt) {
    evt.preventDefault();
    this.props.submitDelegate(this.state);
  }

  render() {
    const { t, account } = this.props;
    const hasEnoughLSK = this.hasEnoughLSK();
    const isDelegate = account.isDelegate;
    const delegateNameHasError = (typeof this.state.delegateName.error === 'string' &&
      this.state.delegateName.error !== '');
    const delegateNameDuplicated = !delegateNameHasError
      && !this.props.delegate.delegateNameQueried &&
      this.props.delegate.delegateNameInvalid;
    const disableSubmitButton = delegateNameHasError ||
      delegateNameDuplicated ||
      this.state.delegateName.value === '';
    const showCheckingAvailability = this.props.delegate.delegateNameQueried &&
      !delegateNameDuplicated;
    const showInfoNameAvailable = !delegateNameHasError &&
      this.state.delegateName.value !== '' &&
      !delegateNameDuplicated;
    const showInfoValidation = !showInfoNameAvailable &&
      !delegateNameHasError &&
      !delegateNameDuplicated &&
      !showCheckingAvailability;

    return (
      <section>
        <TransitionWrapper current={this.state.step} step='confirm'>
          <div className={stepStyles.container}>
            <div className={stepStyles.firstContainer}>
              <header>
                <h5 className={stepStyles.heading}>
                  {t('Become a delegate')}
                </h5>
              </header>
              <p className={stepStyles.description}>
                {t('Delegates have great responsibility within the Lisk system, securing the blockchain. Becoming a delegate requires the registration of a name. The top 101 delegates are eligible to forge.')}
              </p>
            </div>
            <div className={stepStyles.secondContainer}>
              <form className={stepStyles.form} onSubmit={this.checkSufficientFunds.bind(this)}>
                <PrimaryButton
                  disabled={!hasEnoughLSK || isDelegate}
                  label={t('Choose a name')}
                  className={`${stepStyles.chooseNameBtn} choose-name`}
                  onClick={this.checkSufficientFunds.bind(this)}
                />
                {!hasEnoughLSK ? <p className={stepStyles.error}>
                  {t('Insufficient funds (Fee: {{fee}} LSK)', { fee: fromRawLsk(Fees.registerDelegate) })}
                </p> : null }
                {isDelegate ? <p className={stepStyles.error}>
                  {t('You have already registered as a delegate.')}
                </p> : null }
              </form>
            </div>
          </div>
        </TransitionWrapper>

        <TransitionWrapper current={this.state.step} step='choose'>
          <div className={stepStyles.container}>
            <div className={stepStyles.firstContainer}>
              <header>
                <h5 className={stepStyles.heading}>
                  {t('Choose your name')}
                </h5>
              </header>
            </div>
            <div className={`${stepStyles.secondContainer} ${stepStyles.containerWithBg}`}>
              <form className={`${stepStyles.form}`}
                onSubmit={this.validateDelegateName.bind(this, 'delegateName')}>
                <Input
                  placeholder={this.props.t('Write to check availability')}
                  required={true}
                  shouldfocus="true"
                  className={`${styles.delegateNameInput} delegate-name`}
                  onChange={this.validateDelegateName.bind(this, 'delegateName')}
                  error={this.state.delegateName.error}
                  value={this.state.delegateName.value} />
                {delegateNameDuplicated ? <p className={`${stepStyles.error} ${stepStyles.errorInline} error-name-duplicate`}>
                  {t('Name is already taken!')}
                </p> : null }
                {showCheckingAvailability ? <p className={`${stepStyles.info} info`}>
                  <FontIcon value='more' />
                  {t('checking availability')}
                </p> : null }
                {showInfoNameAvailable ? <p className={`${stepStyles.info} info`}>
                  <FontIcon value='checkmark' />
                  {t('Name is available')}
                </p> : null }
                {showInfoValidation ? <p className={stepStyles.info}>
                  {t('Max 20 characters a-z 0-1, no special characters except “!@$&_.”')}
                </p> : null }
                <PrimaryButton
                  disabled={disableSubmitButton}
                  label={t('Next')}
                  className={`${stepStyles.chooseNameBtn} submit-delegate-name`}
                  onClick={() =>
                    this.props.nextStep({ delegateName: this.state.delegateName.value })}
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
