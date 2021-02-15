import React from 'react';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
  const address = useSelector(state => state.account.info.LSK.address);
  const isAccountInitialized = useSelector(state => state.account.isAccountInitialised);
  const isInitialization = initialValue.initialization;

  if (isInitialization) {
    return (
      <Dialog hasClose={!isInitialization || isAccountInitialized}>
        <MultiStep
          key="send"
          finalCallback={backToWallet}
          className={styles.wrapper}
        >
          <Summary
            isInitialization={isInitialization}
            fields={{
              recipient: { address },
              fee: { value: 1e7 },
              amount: { value: 0.1 },
              reference: { value: 'Account Initialization' },
            }}
          />
          <Summary />
          <TransactionStatus history={history} />
        </MultiStep>
      </Dialog>
    );
  }

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
