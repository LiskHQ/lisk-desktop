import React from 'react';
import { withRouter } from 'react-router';
import MultiStep from '../multiStep';
import SelectName from './selectName/selectName';
import DelegateRegistrationSummary from './summary/delegateRegistrationSummary';
import styles from './delegateRegistration.css';

class DelegateRegistration extends React.Component {
  constructor(props) {
    super(props);

    this.submitDelegate = this.submitDelegate.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  submitDelegate({ delegateName, passphrase, secondPassphrase }) {
    this.props.delegateRegistered({
      account: this.props.account.info.LSK,
      username: delegateName,
      passphrase: passphrase.value,
      secondPassphrase: secondPassphrase.value,
    });
  }

  goBack() {
    this.props.history.goBack();
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
          finalCallback={this.submitDelegate}
          backButtonLabel={t('Back')}>
          <SelectName
            t={t}
            account={account}
            delegate={delegate}
            delegatesFetched={delegatesFetched}/>
          <DelegateRegistrationSummary
            t={t}
            account={account}/>
          <SelectName />
        </MultiStep>
      </section>
    );
  }
}

export default withRouter(DelegateRegistration);
