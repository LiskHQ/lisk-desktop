import React from 'react';
import MultiStep from './../multiStep';
import Form from './form';
import { parseSearchParams } from './../../utils/searchParams';
import styles from './send.css';

class Send extends React.Component {
  constructor(props) {
    super(props);

    this.getSearchParams = this.getSearchParams.bind(this);
  }

  getSearchParams() {
    return parseSearchParams(this.props.history.location.search);
  }

  render() {
    const { recipient, amount, reference } = this.getSearchParams();

    return (
      <div className={styles.container}>
        <div className={`${styles.wrapper} send-box`}>
          <MultiStep
            key='send'
            className={styles.wrapper}>
            <Form
              address={recipient}
              amount={amount}
              reference={reference}
            />
            <div>this should remove after another component be added</div>
          </MultiStep>
        </div>
      </div>
    );
  }
}

export default Send;
