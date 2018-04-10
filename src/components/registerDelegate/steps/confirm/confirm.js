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

import stepStyles from '../steps.css';
import styles from './confirm.css';


class Confirm extends React.Component {
  constructor() {
    super();
    this.state = {
      step: 'confirm',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.delegate.delegateRegisteredSuccess) {
      this.setState({ step: 'success' });
    }
  }

  handleConfirmation() {
    this.setState({ step: 'submitting' });
    this.props.submitDelegate(this.props);
  }

  handleRegistrationSuccess() {
    const dashboarRoute = `${routes.main.path}${routes.dashboard.path}`;
    this.props.history.replace(dashboarRoute);
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
            <p className={stepStyles.description}>
              {t('Your delegate name is being registered')}
            </p>
            <footer>
            </footer>
          </div>
        </TransitionWrapper>

        <TransitionWrapper current={this.state.step} step='success'>
          <div className={stepStyles.container}>
            <header>
              <h5 className={stepStyles.heading}>
                {t('Success!')}
              </h5>
            </header>
            <p className={stepStyles.description}>
              {t('Your registration is secured on the blockchain')}
            </p>
            <div className={stepStyles.form}>
              <form onSubmit={this.handleRegistrationSuccess.bind(this)}>
                <PrimaryButton
                  disabled={false}
                  label={t('Go to your Dashboard')}
                  className={`${stepStyles.chooseNameBtn} registration-success`}
                  onClick={this.handleRegistrationSuccess.bind(this)}
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
