import React from 'react';
import { withTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { PrimaryButton, TertiaryButton } from '../../toolbox/buttons/button';
import registerStyles from './register.css';
import styles from './confirmPassphrase.css';
import PassphraseRenderer from '../../shared/passphraseRenderer';

class ConfirmPassphrase extends React.Component {
  constructor() {
    super();
    this.state = {
      disabledButton: true,
      shouldVerify: false,
    };

    this.verifyChoices = this.verifyChoices.bind(this);
  }

  verifyChoices() {
    this.setState({ shouldVerify: true });
    this.timeout = setTimeout(() => this.setState({ shouldVerify: false }), 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    const { t, passphrase, prevStep } = this.props;
    const {
      answers, disabledButton, shouldVerify,
    } = this.state;

    return (
      <React.Fragment>
        <span className={`${registerStyles.stepsLabel}`}>
          {t('Step {{current}} / {{total}}', { current: 3, total: 4 })}
        </span>
        <div className={`${registerStyles.titleHolder} ${grid['col-xs-10']}`}>
          <h1>
            {t('Confirm your passphrase')}
          </h1>
          <p className={styles.text}>{t('Keep it safe as it is the only way to access your wallet.')}</p>
        </div>

        <div className={`${grid['col-sm-10']} ${styles.passphraseContainer}`}>
          <PassphraseRenderer
            showInfo
            passphrase={passphrase}
            toggleButtonStatus={status => this.setState({ disabledButton: status })}
            shouldVerify={shouldVerify}
            answers={answers}
            values={passphrase.split(' ')}
            nextStep={() => this.props.nextStep()}
            isConfirmation
          />
        </div>

        <div className={`${registerStyles.buttonsHolder} ${grid.row}`}>
          <span className={`${registerStyles.button}`}>
            <TertiaryButton
              className={registerStyles.backButton}
              onClick={prevStep}
            >
              {t('Go back')}
            </TertiaryButton>
          </span>
          <span className={`${registerStyles.button}`}>
            <PrimaryButton
              className={`${registerStyles.continueBtn} passphrase-is-correct-button`}
              onClick={this.verifyChoices}
              disabled={disabledButton}
            >
              {t('Confirm')}
            </PrimaryButton>
          </span>
        </div>
      </React.Fragment>
    );
  }
}

export default withTranslation()(ConfirmPassphrase);
