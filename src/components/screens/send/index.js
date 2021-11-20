import React from 'react';
import { withRouter } from 'react-router-dom';

import { routes } from '@constants';
import { parseSearchParams } from '@utils/searchParams';
import MultiStep from '@shared/multiStep';
import TransactionSignature from '@shared/transactionSignature';
import Dialog from '@toolbox/dialog/dialog';
import Form from './form';
import Summary from './summary';
import TransactionStatus from './transactionStatus';
import styles from './send.css';

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
        <Form initialValue={initialValue} />
        <Summary />
        <TransactionSignature />
        <TransactionStatus history={history} />
      </MultiStep>
    </Dialog>
  );
};

export default withRouter(Send);
