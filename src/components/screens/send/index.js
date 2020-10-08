import React from 'react';
import { withRouter } from 'react-router-dom';
import MultiStep from '../../shared/multiStep';
import Form from './form';
import Summary from './summary';
import TransactionStatus from './transactionStatus';
import routes from '../../../constants/routes';
import Dialog from '../../toolbox/dialog/dialog';
import styles from './send.css';
import { parseSearchParams } from '../../../utils/searchParams';

const Send = ({ history }) => {
  // istanbul ignore next
  const backToWallet = () => {
    history.push(routes.wallet.path);
  };
  const initialValue = parseSearchParams(history.location.search);

  return (
    <Dialog hasClose>
      <MultiStep
        key="send"
        finalCallback={backToWallet}
        className={styles.wrapper}
      >
        <Summary />
        <Form initialValue={initialValue} />
        <TransactionStatus history={history} />
      </MultiStep>
    </Dialog>
  );
};

export default withRouter(Send);
