import React from 'react';

import MultiStep from '../../shared/multiStep';
import routes from '../../../constants/routes';
import SelectName from './selectName/SelectName';
import Summary from './summary/summary';
import Status from './status/status';
import styles from './registerDelegate.css';

class RegisterDelegate extends React.Component {
  constructor(props) {
    super(props);

    this.goBackToDelegates = this.goBackToDelegates.bind(this);
  }

  // TODO update test coverage in PR #2199
  // istanbul ignore next
  goBackToDelegates() {
    this.props.history.push(routes.delegates.path);
  }

  render() {
    const {
      account,
      transactions,
      history,
      network,
      transactionBroadcasted,
      t,
    } = this.props;

    return (
      <section className={`${styles.wrapper}`}>
        <MultiStep
          className={styles.multiStep}
          prevPage={history.goBack}
          backButtonLabel={t('Back')}
        >
          <SelectName
            t={t}
            account={account}
            network={network}
          />
          <Summary
            t={t}
            account={account}
            network={network}
          />
          <Status
            t={t}
            goBackToDelegates={this.goBackToDelegates}
            transactionBroadcasted={transactionBroadcasted}
            transactions={transactions}
          />
        </MultiStep>
      </section>
    );
  }
}

export default RegisterDelegate;
