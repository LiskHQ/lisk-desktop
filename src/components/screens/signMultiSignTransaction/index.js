/* istanbul ignore file */
import React from 'react';
import { withRouter } from 'react-router-dom';
import MultiStep from '../../shared/multiStep';
import { removeSearchParamsFromUrl } from '../../../utils/searchParams';
import Dialog from '../../toolbox/dialog/dialog';

import ImportData from './importData';
import ReviewSign from './reviewSign';
import Share from './share';
import styles from './styles.css';

const MultiSignature = ({ history }) => {
  const closeModal = () => {
    removeSearchParamsFromUrl(history, ['modal'], true);
  };

  return (
    <Dialog hasClose>
      <MultiStep
        key="sign-multi-signature-transaction"
        finalCallback={closeModal}
        className={styles.modal}
      >
        <ImportData />
        <ReviewSign />
        <Share />
      </MultiStep>
    </Dialog>

  );
};

export default withRouter(MultiSignature);
