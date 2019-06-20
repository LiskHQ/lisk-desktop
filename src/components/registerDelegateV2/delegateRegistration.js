import React from 'react';
import { withRouter } from 'react-router';
import MultiStep from '../multiStep';
import SelectName from './selectName/selectName';
import DelegateRegistrationSummary from './summary/delegateRegistrationSummary';
import styles from './delegateRegistration.css';

class DelegateRegistration extends React.Component {
  constructor(props) {
    super(props);

    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    this.props.history.goBack();
  }

  render() {
    const {
      account,
      delegate,
      delegatesFetched,
      delegateRegistered,
      t,
    } = this.props;

    return (
      <section className={`${styles.wrapper}`}>
        <MultiStep
          className={styles.multiStep}
          prevPage={this.goBack}
          backButtonLabel={t('Back')}>
          <SelectName
            t={t}
            account={account}
            delegate={delegate}
            delegatesFetched={delegatesFetched}/>
          <DelegateRegistrationSummary
            t={t}
            account={account}
            delegateRegistered={delegateRegistered}/>
        </MultiStep>
      </section>
    );
  }
}

export default withRouter(DelegateRegistration);
