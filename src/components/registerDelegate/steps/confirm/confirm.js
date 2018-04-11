import React from 'react';
import routes from '../../../../constants/routes';
import { extractAddress } from '../../../../utils/api/account';
import { fromRawLsk } from '../../../../utils/lsk';

import TransitionWrapper from '../../../toolbox/transitionWrapper';
import Fees from '../../../../constants/fees';
import AccountVisual from '../../../accountVisual';
import { PrimaryButton } from '../../../toolbox/buttons/button';
// eslint-disable-next-line import/no-named-as-default
import SliderCheckbox from '../../../toolbox/sliderCheckbox';
import { FontIcon } from '../../../fontIcon';

import stepStyles from '../steps.css';
import styles from './confirm.css';


class Confirm extends React.Component {
  constructor() {
    super();
    this.state = {
      step: 'register-success',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.delegate.registerStep) {
      this.setState({ step: nextProps.delegate.registerStep });
    }
  }

  handleConfirmation() {
    this.setState({ step: 'submitting' });
    this.props.submitDelegate(this.props);
  }

  redirectToDashboard() {
    const dashboarRoute = `${routes.dashboard.path}`;
    this.props.history.replace(dashboarRoute);
  }

  redirectToFirstStep() {
    this.props.prevStep({ reset: true });
  }

  render() {
    const { t, delegateName, passphrase } = this.props;
    const addressForVisual = extractAddress(passphrase.value);

    return (
      <section>
        <TransitionWrapper current={this.state.step} step='confirm'>
          <div className={stepStyles.container}>
            <header>
              <h5 className={stepStyles.heading}>
                {t('Confirm your name')}
              </h5>
            </header>
            <p className={stepStyles.description}>
              {t('Names are unique. Once you register the name, it can\'t be changed.')}
            </p>
            <figure className={styles.accountVisual}>
              <AccountVisual address={addressForVisual} size={100} />
            </figure>
            <div className={stepStyles.form}>
              <form onSubmit={this.props.submitDelegate}>
                <p className={styles.delegateName}>{delegateName}</p>
                <SliderCheckbox
                  theme={styles}
                  className={`${styles.confirmInput} confirm-delegate-registration`}
                  label={t('Confirm (Fee: {{fee}} LSK)', { fee: fromRawLsk(Fees.registerDelegate) })}
                  clickable={true}
                  onChange={this.handleConfirmation.bind(this)}
                  input={{
                    value: 'submitting',
                  }}/>
              </form>
            </div>
            <footer>
            </footer>
          </div>
        </TransitionWrapper>
        <TransitionWrapper current={this.state.step} step='submitting'>
          <div className={stepStyles.container}>

            <FontIcon className={stepStyles.headerIcon} value="logo-icon"></FontIcon>
            <p className={stepStyles.description}>
              {t('Your delegate name is being registered')}
            </p>
            <footer>
            </footer>
          </div>
        </TransitionWrapper>

        <TransitionWrapper current={this.state.step} step='register-success'>
          <div className={stepStyles.container}>
            <header>
              <FontIcon className={stepStyles.headerIcon} value='checkmark'></FontIcon>
              <h5 className={stepStyles.heading}>
                {t('Success!')}
              </h5>
            </header>
            <p className={stepStyles.description}>
              {t('Your registration is secured on the blockchain')}
            </p>
            <div className={stepStyles.form}>
              <form onSubmit={this.redirectToDashboard.bind(this)}>
                <PrimaryButton
                  disabled={false}
                  label={t('Go to your Dashboard')}
                  className={`${stepStyles.chooseNameBtn} registration-success`}
                  onClick={this.redirectToDashboard.bind(this)}
                />
              </form>
            </div>
          </div>
        </TransitionWrapper>

        <TransitionWrapper current={this.state.step} step='register-failure'>
          <div className={stepStyles.container}>
            <header>
              <FontIcon className={`${stepStyles.headerIcon} ${stepStyles.iconError}`} value='add'></FontIcon>
              <h5 className={stepStyles.heading}>
                {t('Connecting to network')}
              </h5>
            </header>
            <p className={stepStyles.description}>
              {t('Could not reach the network. Please try again.')}
            </p>
            <div className={stepStyles.form}>
              <form onSubmit={this.redirectToFirstStep.bind(this)}>
                <PrimaryButton
                  disabled={false}
                  label={t('Try again')}
                  className={`${stepStyles.chooseNameBtn} registration-failure`}
                  onClick={this.redirectToFirstStep.bind(this)}
                />
              </form>
            </div>
          </div>
        </TransitionWrapper>
      </section>
    );
  }
}
export default Confirm;
