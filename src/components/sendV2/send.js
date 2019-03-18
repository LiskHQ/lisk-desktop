import React from 'react';
import MultiStep from './../multiStep';
import Form from './form';
import Summary from './summary';
import TransactionStatus from './transactionStatus';
import { parseSearchParams } from './../../utils/searchParams';
import routes from '../../constants/routes';
import styles from './send.css';

class Send extends React.Component {
  constructor(props) {
    super(props);

    const { recipient, amount, reference } = parseSearchParams(this.props.history.location.search);

    this.state = {
      fields: {
        recipient: { address: recipient || '' },
        amount: { value: amount || '' },
        reference: { value: reference || '' },
      },
    };

    this.backToWallet = this.backToWallet.bind(this);
  }

  backToWallet() {
    this.props.history.push(routes.wallet.path);
  }

  render() {
    const { fields } = this.state;

    return (
      <div className={styles.container}>
        <div className={`${styles.wrapper} send-box`}>
          <MultiStep
            key='send'
            finalCallback={this.backToWallet}
            className={styles.wrapper}>
            <Form fields={fields} />
            <Summary />
            <TransactionStatus history={this.props.history}/>
          </MultiStep>
        </div>
      </div>
    );
  }
}

export default Send;
