import React from 'react';
import MultiStep from '../../../shared/multiStep';
import Form from './form';
import Summary from './summary';
import TransactionStatus from './transactionStatus';
import routes from '../../../../constants/routes';
import styles from './send.css';

class Send extends React.Component {
  constructor(props) {
    super(props);

    this.backToWallet = this.backToWallet.bind(this);
  }

  // istanbul ignore next
  backToWallet() {
    this.props.history.push(routes.wallet.path);
  }

  render() {
    const { history } = this.props;

    return (
      <div className={styles.container}>
        <div className={`${styles.wrapper} send-box`}>
          <MultiStep
            key="send"
            finalCallback={this.backToWallet}
            className={styles.wrapper}
          >
            <Form history={history} />
            <Summary />
            <TransactionStatus history={history} />
          </MultiStep>
        </div>
      </div>
    );
  }
}

export default Send;
