import React from 'react';

import MultiStep from '../multiStep';
import SelectName from './selectName/SelectName';
import Summary from './summary/summary';
import Status from './status/status';
import styles from './delegateRegistration.css';

class DelegateRegistration extends React.Component {
  render() {
    const {
      account,
      delegate,
      delegatesFetched,
      delegateRegistered,
      history,
      t,
    } = this.props;

    return (
      <section className={`${styles.wrapper}`}>
        <MultiStep
          className={styles.multiStep}
          prevPage={history.goBack}
          backButtonLabel={t('Back')}>
          <SelectName
            t={t}
            account={account}
            delegate={delegate}
            delegatesFetched={delegatesFetched}/>
          <Summary
            t={t}
            account={account}
            submitDelegateRegistration={delegateRegistered}/>
          <Status
            t={t}
            goBackToDelegates={history.push}
            submitDelegateRegistration={delegateRegistered}
            delegate={delegate}/>
        </MultiStep>
      </section>
    );
  }
}

export default DelegateRegistration;
