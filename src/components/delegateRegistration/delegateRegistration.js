import React from 'react';
import { withRouter } from 'react-router';
import MultiStep from '../multiStep';
import SelectName from './selectName/SelectName';
import Summary from './summary/summary';
import Status from './status/status';
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
          <Summary
            t={t}
            account={account}
            delegateRegistered={delegateRegistered}/>
          <Status t={t} delegate={delegate}/>
        </MultiStep>
      </section>
    );
  }
}

export default withRouter(DelegateRegistration);
