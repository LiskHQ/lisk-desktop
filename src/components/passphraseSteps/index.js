import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { extractPublicKey } from '../../utils/api/account';
import { Button } from './../toolbox/buttons/button';
// eslint-disable-next-line import/no-named-as-default
import PassphraseInput from '../passphraseInput';
import { passphraseIsValid, authStatePrefill } from '../../utils/form';
import styles from './passphraseSteps.css';

class PassphraseSteps extends React.Component {
  constructor() {
    super();

    this.state = {
      done: {
        passphrase: false,
        secondPassphrase: false,
      },
      ...authStatePrefill(),
    };
  }

  componentDidMount() {
    if (this.props.account.secondSignature) {
      this.setState({
        secondPassphrase: {
          value: '',
          error: '',
        },
      });
    }

    if (this.props.account.passphrase && !this.props.account.secondSignature) {
      this.props.nextStep({
        ...this.props,
        ...authStatePrefill(this.props.account),
      });
    }
  }

  hasCorrectPassphrases() {
    const firstPPAndDone = !this.props.account.passphrase && this.state.done.passphrase;
    const secondPPAndDone = this.props.account.secondSignature && this.state.done.secondPassphrase;
    const onlyFirstPPAndDone = firstPPAndDone && !this.props.account.secondSignature;
    const onlySecondPPAndDone = secondPPAndDone && !!this.props.account.passphrase;

    return onlyFirstPPAndDone || onlySecondPPAndDone || (firstPPAndDone && secondPPAndDone);
  }

  componentDidUpdate() {
    if (this.hasCorrectPassphrases()) {
      this.props.nextStep({
        ...this.props,
        passphrase: this.state.passphrase,
        secondPassphrase: this.state.secondPassphrase,
      });
    }
  }

  onChange(name, value, error) {
    if (!error) {
      const publicKeyMap = {
        passphrase: 'publicKey',
        secondPassphrase: 'secondPublicKey',
      };

      const expectedPublicKey = this.props.account[publicKeyMap[name]];

      if (expectedPublicKey && expectedPublicKey !== extractPublicKey(value)) {
        error = this.props.t('Entered passphrase does not belong to the active account');
      }
    }

    this.setState({
      [name]: {
        value,
        error: typeof error === 'string' ? error : undefined,
      },
    });
  }

  setDone(step) {
    const done = Object.assign(this.state.done, { [step]: true });
    this.setState({ done });
  }

  shouldShowSecondPassphraseInput() {
    return this.props.account.secondSignature &&
      (this.state.done.passphrase || this.props.account.passphrase);
  }

  shouldShowFirstPassphraseInput() {
    return !this.props.account.passphrase && !this.state.done.passphrase;
  }

  render() {
    return <div className='boxPadding send'>
      {this.shouldShowFirstPassphraseInput()
        ? <div>
          <div className={styles.header}>
            <header className={styles.headerWrapper}>
              <h2>{this.props.t('Enter your 1st passphrase')}</h2>
            </header>
          </div>
          <PassphraseInput
            className='passphrase'
            error={this.state.passphrase.error}
            value={this.state.passphrase.value}
            onChange={this.onChange.bind(this, 'passphrase')}
            columns={{ xs: 6, sm: 4, md: 6 }}
            theme={styles}
            isFocused={true}
          />
          <footer>
            <section className={grid.row} >
              <div className={grid['col-xs-4']}>
                <Button
                  label={this.props.t('Back')}
                  onClick={() => this.props.prevStep()}
                  type='button'
                  theme={styles}
                />
              </div>
              <div className={grid['col-xs-8']}>
                <Button
                  className='first-passphrase-next'
                  label={this.props.t('Next')}
                  theme={styles}
                  onClick={this.setDone.bind(this, 'passphrase')}
                  disabled={!passphraseIsValid(this.state.passphrase)}
                />
              </div>
            </section>
          </footer>
        </div>
        : null
      }
      {this.shouldShowSecondPassphraseInput()
        ? <div>
          <div className={styles.header}>
            <header className={styles.headerWrapper}>
              <h2>{this.props.t('Enter your 2nd passphrase')}</h2>
            </header>
          </div>
          <PassphraseInput
            className='second-passphrase'
            error={this.state.secondPassphrase.error}
            value={this.state.secondPassphrase.value}
            onChange={this.onChange.bind(this, 'secondPassphrase')}
            columns={{ xs: 6, sm: 4, md: 6 }}
            theme={styles}
            isFocused={true}
          />
          <footer>
            <section className={grid.row} >
              <div className={grid['col-xs-4']}>
                <Button
                  label={this.props.t('Back')}
                  onClick={() => this.props.prevStep()}
                  type='button'
                  theme={styles}
                />
              </div>
              <div className={grid['col-xs-8']}>
                <Button
                  className='second-passphrase-next'
                  label={this.props.t('Next')}
                  theme={styles}
                  onClick={this.setDone.bind(this, 'secondPassphrase')}
                  disabled={!passphraseIsValid(this.state.secondPassphrase)}
                />
              </div>
            </section>
          </footer>
        </div>
        : null
      }
    </div>;
  }
}


const mapStateToProps = state => ({
  account: state.account,
});

export default connect(mapStateToProps)(translate()(PassphraseSteps));

