import React from 'react';
import { withRouter } from 'react-router-dom';
import MultiStep from '../../shared/multiStep';
import Editor from './editor';
import Summary from './summary';
import Result from './result';
import { removeSearchParamsFromUrl } from '../../../utils/searchParams';

import styles from './styles.css';

const VotingQueue = ({ history }) => {
  // istanbul ignore next
  const closeModal = () => {
    removeSearchParamsFromUrl(history, ['modal'], true);
  };

  return (
    <MultiStep
      key="voting-queue"
      finalCallback={closeModal}
      className={styles.modal}
    >
      <Editor />
      <Summary />
      <Result />
    </MultiStep>
  );
};

export default withRouter(VotingQueue);
