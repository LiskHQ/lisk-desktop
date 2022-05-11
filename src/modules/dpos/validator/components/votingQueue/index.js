/* istanbul ignore file */
import React, { useEffect } from 'react';

import TransactionSignature from '@transaction/components/TransactionSignature';
import { removeSearchParamsFromUrl } from 'src/utils/searchParams';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import Form from '../voteForm';
import Summary from '../voteSummary';
import Status from '../voteStatus';
import styles from './styles.css';

const VotingQueue = ({ history, processLaunchProtocol }) => {
  const closeModal = () => {
    removeSearchParamsFromUrl(history, ['modal'], true);
  };

  useEffect(() => {
    processLaunchProtocol(history.location.search);

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

export default VotingQueue;
