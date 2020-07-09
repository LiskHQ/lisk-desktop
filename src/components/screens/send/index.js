import React from 'react';
import { useHistory } from 'react-router-dom';
import MultiStep from '../../shared/multiStep';
import Form from './form';
import Summary from './summary';
import TransactionStatus from './transactionStatus';
import routes from '../../../constants/routes';
import Dialog from '../../toolbox/dialog/dialog';
import styles from './send.css';

const Send = ({ initialValue }) => {
  const history = useHistory();
  // istanbul ignore next
  const backToWallet = () => {
    history.push(routes.wallet.path);
  };

  return (
    <Dialog hasClose className={styles.dialogWrapper}>
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

export default Send;
