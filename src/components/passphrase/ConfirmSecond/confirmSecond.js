import React from 'react';
import { Button } from '../../toolbox/buttons/button';
import styles from './confirmSecond.css';
import { passphraseIsValid } from '../../../utils/form';
import TransitionWrapper from '../../toolbox/transitionWrapper';
import { FontIcon } from '../../fontIcon';
import { extractPublicKey } from '../../../utils/account';
// eslint-disable-next-line import/no-named-as-default
import SliderCheckbox from '../../toolbox/sliderCheckbox';
// eslint-disable-next-line import/no-named-as-default
import PassphraseInput from '../../passphraseInput';
import routes from '../../../constants/routes';

class confirmSecond extends React.Component {
  constructor() {
    super();
    this.state = {
      step: 'login',
      passphrase: {
        value: '',
        error: '',
      },
    };
  }
  onChange(name, value, error) {
    const { publicKey } = this.props.account;
    if (!error && extractPublicKey(value) !== publicKey) {
      error = this.props.t('Entered passphrase does not belong to the active account');
    }
    this.setState({
      [name]: {
        value,
        error: typeof error === 'string' ? error : undefined,
      },
    });
  }
  login() {
    this.setState({
      step: 'confirm',
    });
  }
  componentDidMount() {
    if (this.props.account.passphrase) {
      this.setState({ step: 'confirm' });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.account.secondPublicKey) {
      this.setState({ step: 'done' });
    }
  }
  confirm() {
    const { finalCallback, account } = this.props;
    const passphrase = this.state.passphrase.value || account.passphrase;
    finalCallback(passphrase);
    this.setState({
      step: 'pending',
    });
  }
  render() {
    const { hidden, t, history } = this.props;
    const status = hidden ? styles.hidden : '';
    const doneClass = (this.state.step === 'done' || this.state.step === 'pending') ? styles.done : '';
    return (<section className={`${styles.wrapper} ${status}`}>
      <header className={doneClass}>
        <TransitionWrapper current={this.state.step} step='login' animationName='slide'>
          <h2>
            {t('Please sign in with your first passphrase')}
          </h2>
        </TransitionWrapper>
        <TransitionWrapper current={this.state.step} step='confirm' animationName='slide'>
          <h2>
            {t('Great!\nYou’re almost finished')}
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
      </header>
      <div className={`${styles.content} ${doneClass}`}>
        <TransitionWrapper current={this.state.step} step='login'>
          <div className={styles.innerContent}>
            <PassphraseInput
              error={this.state.passphrase.error}
              value={this.state.passphrase.value}
              onChange={this.onChange.bind(this, 'passphrase')}
              columns={{ xs: 6, sm: 4, md: 2 }}
              isFocused={true}
              className='passphraseInput'
            />
            <footer>
              <Button
                label={this.props.t('Unlock account')}
                theme={styles}
                className={'unlock'}
                onClick={this.login.bind(this, 'passphrase')}
                disabled={!passphraseIsValid(this.state.passphrase)}
              />
            </footer>
          </div>
        </TransitionWrapper>
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
              onChange={this.confirm.bind(this)}
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
            onClick={() => history.push(`${routes.dashboard.path}`) }
          />
        </TransitionWrapper>
      </div>
    </section>);
  }
}
export default confirmSecond;
