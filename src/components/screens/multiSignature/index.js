

/* istanbul ignore file */
import React from 'react';
import { withRouter } from 'react-router-dom';

import MultiStep from '../../shared/multiStep';
import { removeSearchParamsFromUrl } from '../../../utils/searchParams';

import Editor from './editor';
import Summary from './summary';
import Result from './result';
import styles from './styles.css';

const MultiSignature = ({ history }) => {
  const closeModal = () => {
    removeSearchParamsFromUrl(history, ['modal'], true);
  };

  return (
    <MultiStep
      key="multi-signature"
      finalCallback={closeModal}
      className={styles.modal}
    >
      <Editor />
      <Summary />
      <Result />
    </MultiStep>
  );
};

export default withRouter(MultiSignature);
