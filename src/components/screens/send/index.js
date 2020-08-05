import React from 'react';
import { withRouter } from 'react-router-dom';
import MultiStep from '../../shared/multiStep';
import Form from './form';
import Summary from './summary';
import TransactionStatus from './transactionStatus';
import routes from '../../../constants/routes';
import Dialog from '../../toolbox/dialog/dialog';
import styles from './send.css';

const Send = ({ initialValue, history }) => {
  // istanbul ignore next
  const backToWallet = () => {
    history.push(routes.wallet.path);
  };

  return (
    <Dialog hasClose>
      <MultiStep
        key="send"
        finalCallback={backToWallet}
        className={styles.wrapper}
      >
        <Form initialValue={initialValue} />
        <Summary />
        <TransactionStatus history={history} />
      </MultiStep>
    </Dialog>
  );
};

export default withRouter(Send);
