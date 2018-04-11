import React from 'react';
import TransitionWrapper from '../../../toolbox/transitionWrapper';
import Fees from '../../../../constants/fees';
import { fromRawLsk } from '../../../../utils/lsk';
import { PrimaryButton } from '../../../toolbox/buttons/button';
import Input from '../../../toolbox/inputs/input';

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

  componentWillReceiveProps(nextProps) {
    if (nextProps.delegate.delegateNameQueried) {
      if (nextProps.delegate.delegateNameInvalid) {
        this.setState({ delegateName: { error: this.props.t('Usernane already exists') } });
      } else {
        this.props.nextStep({ delegateName: this.state.delegateName.value });
      }
    }
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
    this.setState({ step: 'choose' });
    // this.props.nextStep({});
  }

  validateDelegateName(name, value) {
    let error;

    const nameMatchRegEx = value.match(this.delegateNameRegEx);
    if (!value ||
        (typeof value !== 'string') ||
        nameMatchRegEx.length > 1 ||
        nameMatchRegEx[0].length !== value.length ||
        value.length > this.delegateNameMaxChars) {
      error = this.props.t('Max 20 characters a-z 0-1, no special characters except “!@$&_.”');
    }
    this.setState({
      [name]: {
        value,
        error: typeof error === 'string' ? error : undefined,
      },
    });
  }

  handleDelegateNameSubmit(evt) {
    evt.preventDefault();
    this.props.submitDelegate(this.state);
  }

  render() {
    const { t } = this.props;
    const hasEnoughLSK = true; // TODO: this.hasEnoughLSK();
    const isDelegate = false; // TODO: this.props.account.isDelegate;
    const delegateNameHasError = (!typeof this.state.delegateName.value === 'string' ||
      this.state.delegateName.error !== undefined);
    return (
      <section>
        <TransitionWrapper current={this.state.step} step='confirm'>
          <div className={stepStyles.container}>
            <header>
              <h5 className={stepStyles.heading}>
                {t('Be a delegate')}
              </h5>
            </header>
            <p className={stepStyles.description}>
              {t('Delegates have great responsibility within the Lisk system, securing the blockchain. Becoming a delegate requires the registration of a name. The top 101 delegates are eligible to forge.')}
            </p>
            <div className={stepStyles.form}>
              <form onSubmit={this.checkSufficientFunds.bind(this)}>
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
            <header>
              <h5 className={stepStyles.heading}>
                {t('Choose your name')}
              </h5>
            </header>
            <div className={`${stepStyles.form} ${stepStyles.formWithBg}`}>
              <form onSubmit={() =>
                this.props.checkDelegateUsernameAvailable(this.state.delegateName.value)}>
                <Input
                  placeholder={this.props.t('Write to check availability')}
                  required={true}
                  autoFocus={true}
                  className={`${styles.delegateNameInput} delegate-name`}
                  onChange={this.validateDelegateName.bind(this, 'delegateName')}
                  error={this.state.delegateName.error}
                  value={this.state.delegateName.value} />
                <PrimaryButton
                  disabled={delegateNameHasError}
                  label={t('Next')}
                  className={`${stepStyles.chooseNameBtn} submit-delegate-name`}
                  onClick={() =>
                    this.props.checkDelegateUsernameAvailable(this.state.delegateName.value)}
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
