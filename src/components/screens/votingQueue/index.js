/* istanbul ignore file */
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';

import TransactionSignature from '@shared/transactionSignature';
import { removeSearchParamsFromUrl } from '@utils/searchParams';
import { processLaunchProtocol } from '@actions';
import MultiStep from '@shared/multiStep';

import Editor from './editor';
import Summary from './summary';
import Result from './result';
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
      <Editor />
      <Summary />
      <TransactionSignature />
      <Result />
    </MultiStep>
  );
};

export default withRouter(VotingQueue);
