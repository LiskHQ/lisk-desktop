import React from 'react';
import MultiStep from './../multiStep';
import Form from './form';
import AccountInitialization from '../accountInitialization';
import { parseSearchParams } from './../../utils/searchParams';
import styles from './send.css';

class Send extends React.Component {
  constructor(props) {
    super(props);

    this.getSearchParams = this.getSearchParams.bind(this);
    this.goToWallet = this.goToWallet.bind(this);
  }

  getSearchParams() {
    return parseSearchParams(this.props.history.location.search);
  }

  goToWallet() {
    this.props.history.push('/wallet');
  }

  render() {
    const { recipient, amount, reference } = this.getSearchParams();

    return (
      <div className={styles.container}>
        <div className={`${styles.wrapper} send-box `}>
          <MultiStep
            key='send'
            finalCallback={this.goToWallet.bind(this)}
            className={styles.wrapper}>
            <AccountInitialization
              history={this.props.history}
              address={recipient}/>
            <Form
              address={recipient}
              amount={amount}
              reference={reference}
            />
          </MultiStep>
        </div>
      </div>
    );
  }
}

export default Send;
