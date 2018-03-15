import React from 'react';
import { Button } from '../../toolbox/buttons/button';
import styles from './confirmSecond.css';
import { passphraseIsValid } from '../../../utils/form';
import TransitionWrapper from '../../toolbox/transitionWrapper';
import { FontIcon } from '../../fontIcon';
// eslint-disable-next-line import/no-named-as-default
import SliderCheckbox from '../../toolbox/sliderCheckbox';
// eslint-disable-next-line import/no-named-as-default
import PassphraseInput from '../../passphraseInput';

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
  confirm() {
    const { finalCallback, account } = this.props;
    const passphrase = this.state.passphrase.value || account.passphrase;
    finalCallback(passphrase);
    this.setState({
      step: 'done',
    });
  }
  render() {
    const { hidden, t, history } = this.props;
    const status = hidden ? styles.hidden : '';
    const doneClass = this.state.step === 'done' ? styles.done : '';
    return (<section className={`${styles.wrapper} ${status}`}>
      <header>
        <TransitionWrapper current={this.state.step} step='login'>
          <h2>
            {t('Please sign in with your first passphrase')}
          </h2>
        </TransitionWrapper>
        <TransitionWrapper current={this.state.step} step='confirm'>
          <h2>
            {t('Great!\nYou’re almost finished')}
          </h2>
        </TransitionWrapper>
        <TransitionWrapper current={this.state.step} step='done'>
          <article className={styles.resultContainer}>
            <FontIcon className={styles.headerIcon} value="checkmark"></FontIcon>
            <h2 className={styles.resultHeader}>
              {t('Success!')}
            </h2>
            <div className='subTitle'>{t('Your registration is secured on the blockchain.')}</div>
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
              columns={{ xs: 2, sm: 4, md: 2 }}
              isFocused={true}
            />
            <footer>
              <Button
                label={this.props.t('Unlock account')}
                theme={styles}
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
              <div>{t('This is not reversible.')}</div>
            </h5>
            <SliderCheckbox
              theme={styles}
              className={`${styles.smallSlider} i-understand-checkbox`}
              label={t('I Confirm (Fee: 5 LSK)')}
              clickable={true}
              onChange={this.confirm.bind(this)}
              input={{
                value: 'introduction-step',
              }}/>
          </div>
        </TransitionWrapper>
        <TransitionWrapper current={this.state.step} step='done'>
          <Button
            label={this.props.t('Go back to Dashboard')}
            className={styles.resultButton}
            onClick={() => history.push('/main/dashboard') }
          />
        </TransitionWrapper>
      </div>
    </section>);
  }
}
export default confirmSecond;
