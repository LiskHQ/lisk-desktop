import React from 'react';

import MultiStep from '../multiStep';
import SelectName from './selectName/SelectName';
import Summary from './summary/summary';
import Status from './status/status';
import routes from '../../constants/routes';
import styles from './delegateRegistration.css';

class DelegateRegistration extends React.Component {
  constructor(props) {
    super(props);

    this.goBack = this.goBack.bind(this);
    this.goBackToDelegates = this.goBackToDelegates.bind(this);
    this.submitDelegateRegistration = this.submitDelegateRegistration.bind(this);
  }

  // istanbul ignore next
  goBack() {
    this.props.history.goBack();
  }

  // istanbul ignore next
  goBackToDelegates() {
    this.props.history.push(routes.delegates.path);
  }

  // istanbul ignore next
  submitDelegateRegistration(userInformation) {
    this.props.delegateRegistered(userInformation);
  }

  render() {
    const {
      account,
      delegate,
      delegatesFetched,
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
          <Summary
            t={t}
            account={account}
            submitDelegateRegistration={this.submitDelegateRegistration}/>
          <Status
            t={t}
            goBackToDelegates={this.goBackToDelegates}
            submitDelegateRegistration={this.submitDelegateRegistration}
            delegate={delegate}/>
        </MultiStep>
      </section>
    );
  }
}

export default DelegateRegistration;
