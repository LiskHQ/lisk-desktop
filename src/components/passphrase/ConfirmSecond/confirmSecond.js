import React from 'react';
import { PrimaryButton, Button } from '../../toolbox/buttons/button';
import styles from './confirmSecond.css';
import TransitionWrapper from '../../toolbox/transitionWrapper';
import { FontIcon } from '../../fontIcon';
// eslint-disable-next-line import/no-named-as-default
import SliderCheckbox from '../../toolbox/sliderCheckbox';
import routes from '../../../constants/routes';
import Piwik from '../../../utils/piwik';

class ConfirmSecond extends React.Component {
  constructor() {
    super();
    this.state = {
      step: 'confirm',
      passphrase: {
        value: '',
        error: '',
      },
      error: false,
    };
    this.onRedirectToDashboard = this.onRedirectToDashboard.bind(this);
    this.redirectToFirstStep = this.redirectToFirstStep.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  componentDidMount() {
    if (this.props.account.passphrase) {
      this.setState({ step: 'confirm' });
    }
  }

  componentWillUnmount() {
    this.props.secondPassphraseRegisteredFailureReset();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.account.info && nextProps.account.info.LSK.secondPublicKey && !nextProps.error) {
      this.setState({ step: 'done' });
    } else if (nextProps.step) {
      this.setState({
        step: nextProps.step,
        error: nextProps.error,
      });
    }
  }

  /* istanbul ignore next */
  onRedirectToDashboard() {
    Piwik.trackingEvent('Passphrase_ConfirmSecond', 'button', 'Redirect to dashboard');
    this.props.history.push(`${routes.dashboard.path}`);
  }

  confirm() {
    Piwik.trackingEvent('Passphrase_ConfirmSecond', 'button', 'Confirm');
    const { finalCallback, account } = this.props;
    const passphrase = this.state.passphrase.value || account.passphrase;
    finalCallback(passphrase);
    this.setState({
      step: 'pending',
    });
  }

  redirectToFirstStep() {
    Piwik.trackingEvent('Passphrase_ConfirmSecond', 'button', 'Redirect to first step');
    this.props.secondPassphraseRegisteredFailureReset();
    this.props.history.goBack();
  }

  render() {
    const { hidden, t } = this.props;
    const status = hidden ? styles.hidden : '';
    const doneClass = (this.state.step === 'done' ||
      this.state.step === 'pending' ||
      this.state.step === 'second-passphrase-register-failure') ? styles.done : '';
    return (<section className={`${styles.wrapper} ${status}`}>
      <header className={doneClass}>
        <TransitionWrapper current={this.state.step} step='confirm' animationName='slide'>
          <h2>
            {t('Great!\nYou’re almost done')}
          </h2>
        </TransitionWrapper>
        <TransitionWrapper current={this.state.step} step='pending' animationName='slide'>
          <div id='pendingContainer'><FontIcon className={styles.pendingIcon} value="logo-icon"></FontIcon></div>
        </TransitionWrapper>
        <TransitionWrapper current={this.state.step} step='done' animationName='slide'>
          <article className={`${styles.resultContainer} doneContainer`}>
            <FontIcon className={styles.headerIcon} value="checkmark"></FontIcon>
            <h2 className={styles.resultHeader}>
              {t('Success!')}
            </h2>
            <div className='subTitle'>
              {t('Your registration is secured on the blockchain.')}
            </div>
          </article>
        </TransitionWrapper>
        <TransitionWrapper current={this.state.step} step='second-passphrase-register-failure'>
          <article className={`${styles.resultContainer} failContainer`}>
              <FontIcon className={`${styles.headerIcon} ${styles.iconError}`} value='add'></FontIcon>
              <h2 className={styles.resultHeader}>
                {t('Transaction failed')}
              </h2>
              <div className='subTitle'>
                {this.state.error}
              </div>
              <form onSubmit={this.redirectToFirstStep}>
                <PrimaryButton
                  disabled={false}
                  label={t('Try again')}
                  className={`${styles.tryButton} try-again`}
                  onClick={this.redirectToFirstStep}
                />
              </form>
          </article>
        </TransitionWrapper>
      </header>
      {this.state.error ? null :
      <div className={`${styles.content} ${doneClass}`}>
        <TransitionWrapper current={this.state.step} step='confirm'>
          <div className={styles.innerContent}>
            <h5>
              {t('Confirm to register your second passphrase on the blockchain.')}
              <br/>
              {t('This is not reversible.')}
            </h5>
            <SliderCheckbox
              theme={styles}
              className={`${styles.smallSlider} confirm-checkbox`}
              label={t('I confirm (Fee: 5 LSK)')}
              clickable={true}
              onChange={this.confirm}
              input={{
                value: 'introduction-step',
              }}/>
          </div>
        </TransitionWrapper>
        <TransitionWrapper current={this.state.step} step='pending'>
          <h5>
            {t('Your second passphrase registration is being processed and will be confirmed.')}
            <br/>
            {t('This process should take only 10 seconds but may take up to 15 minutes.')}
          </h5>
        </TransitionWrapper>
        <TransitionWrapper current={this.state.step} step='done'>
          <Button
            label={this.props.t('Go back to Dashboard')}
            className={`${styles.resultButton} get-to-your-dashboard-button`}
            onClick={this.onRedirectToDashboard}
          />
        </TransitionWrapper>
      </div>}
    </section>);
  }
}
export default ConfirmSecond;
