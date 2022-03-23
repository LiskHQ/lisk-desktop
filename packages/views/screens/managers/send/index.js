import React from 'react';
import { withRouter } from 'react-router-dom';

import routes from '@screens/router/routes';
import { parseSearchParams } from '@common/utilities/searchParams';
import MultiStep from '@shared/multiStep';
import TransactionSignature from '@shared/transactionSignature';
import Dialog from '@basics/dialog/dialog';
import Form from './form';
import Summary from './summary';
import Status from './status';
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
        <Status history={history} />
      </MultiStep>
    </Dialog>
  );
};

export default withRouter(Send);
