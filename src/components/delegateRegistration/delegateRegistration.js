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

    this.goBackToDelegates = this.goBackToDelegates.bind(this);
  }

  // TODO this will be cover in PR #2186
  /* istanbul ignore next */
  goBackToDelegates() {
    this.props.history.push(routes.delegates.path);
  }

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
          { /* TODO submitDelegateRegistration this will be update in PR #2186 */}
          <Summary
            t={t}
            account={account}
            submitDelegateRegistration={delegateRegistered}/>
          { /* TODO submitDelegateRegistration this will be update in PR #2186 */}
          <Status
            t={t}
            goBackToDelegates={this.goBackToDelegates}
            submitDelegateRegistration={delegateRegistered}
            delegate={delegate}/>
        </MultiStep>
      </section>
    );
  }
}

export default DelegateRegistration;
