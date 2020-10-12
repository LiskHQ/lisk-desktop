/* istanbul ignore file */
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';

import MultiStep from '../../shared/multiStep';
import { removeSearchParamsFromUrl } from '../../../utils/searchParams';
import processLaunchProtocol from '../../../actions/urlProcessor';

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
  }, []);

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
