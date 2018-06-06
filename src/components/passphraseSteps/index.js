import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { extractPublicKey } from '../../utils/account';
import { Button } from './../toolbox/buttons/button';
// eslint-disable-next-line import/no-named-as-default
import PassphraseInput from '../passphraseInput';
import { passphraseIsValid, authStatePrefill } from '../../utils/form';
import styles from './passphraseSteps.css';

class PassphraseSteps extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      done: {
        passphrase: false,
        secondPassphrase: false,
      },
      ...authStatePrefill(this.props.account),
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
        skipped: true,
      });
    }

    if (typeof this.props.onMount === 'function') {
      this.props.onMount(true, 'PassphraseSteps');
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
        skipped: false,
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

  getCurrentStep() {
    if (this.props.account.secondSignature &&
      (this.state.done.passphrase || this.props.account.passphrase)) {
      return 'secondPassphrase';
    }

    return 'passphrase';
  }

  render() {
    const values = {
      columns: { xs: 6, sm: 4, md: 6 },
      passphrase: {
        key: 'passphrase',
        header: this.props.t('Enter your passphrase'),
        state: this.state.passphrase,
        className: 'passphrase',
        buttonClassName: 'first-passphrase-next',
      },
      secondPassphrase: {
        key: 'secondPassphrase',
        header: this.props.t('Enter your 2nd passphrase'),
        state: this.state.secondPassphrase,
        className: 'second-passphrase',
        buttonClassName: 'second-passphrase-next',
      },
      footer: {
        firstGrid: grid['col-xs-4'],
        secondGrid: grid['col-xs-8'],
      },
    };

    let updatedValues = { ...values };
    let updatedStyles = { ...styles };

    if (this.props.values) {
      const columns = { ...updatedValues.columns, ...this.props.values.columns };
      const footer = { ...updatedValues.footer, ...this.props.values.footer };
      const passphrase = { ...updatedValues.passphrase, ...this.props.values.passphrase };
      const secondPassphrase = {
        ...updatedValues.secondPassphrase,
        ...this.props.values.secondPassphrase,
      };
      updatedValues = {
        columns, passphrase, secondPassphrase, footer,
      };
    }

    if (this.props.styles) {
      updatedStyles = { ...updatedStyles, ...this.props.styles };
    }

    return <div className={`${updatedStyles.wrapper}`}>
      <header className={updatedStyles.headerWrapper}>
        <h2>{updatedValues[this.getCurrentStep()].header}</h2>
      </header>
      <PassphraseInput
        className={updatedValues[this.getCurrentStep()].className}
        error={values[this.getCurrentStep()].state.error}
        value={values[this.getCurrentStep()].state.value}
        onChange={this.onChange.bind(this, values[this.getCurrentStep()].key)}
        columns={updatedValues.columns}
        theme={updatedStyles}
        isFocused={true}
      />
      <footer>
        <section className={grid.row} >
          <div className={updatedValues.footer.firstGrid}>
            <Button
              label={this.props.t('Back')}
              onClick={() => this.props.prevStep({
                recipient: this.props.recipient,
                amount: this.props.amount,
                reset: this.props.accountInit,
              })}
              type='button'
              theme={updatedStyles}
            />
          </div>
          <div className={updatedValues.footer.secondGrid}>
            <Button
              className={values[this.getCurrentStep()].buttonClassName}
              label={this.props.t('Next')}
              theme={updatedStyles}
              onClick={this.setDone.bind(this, values[this.getCurrentStep()].key)}
              disabled={!passphraseIsValid(values[this.getCurrentStep()].state)}
            />
            <div className='subTitle'>{this.props.subTitle}</div>
          </div>
        </section>
      </footer>
    </div>;
  }
}


const mapStateToProps = state => ({
  account: state.account,
});

export default connect(mapStateToProps)(translate()(PassphraseSteps));

