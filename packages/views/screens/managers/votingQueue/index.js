/* istanbul ignore file */
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';

import TransactionSignature from '@transaction/components/transactionSignature';
import { removeSearchParamsFromUrl } from '@screens/router/searchParams';
import { processLaunchProtocol } from '@common/store/actions';
import MultiStep from '@shared/multiStep';

import Form from './form';
import Summary from './summary';
import Status from './status';
import styles from './styles.css';

const VotingQueue = ({ history }) => {
  const dispatch = useDispatch();
  const closeModal = () => {
    removeSearchParamsFromUrl(history, ['modal'], true);
  };

  useEffect(() => {
    dispatch(processLaunchProtocol(history.location.search));

    // remove the search params from the url after applying the values to the voting queue
    removeSearchParamsFromUrl(history, ['votes', 'unvotes']);
  }, []);

  return (
    <MultiStep
      key="voting-queue"
      finalCallback={closeModal}
      className={styles.modal}
    >
      <Form />
      <Summary />
      <TransactionSignature />
      <Status />
    </MultiStep>
  );
};

export default withRouter(VotingQueue);
