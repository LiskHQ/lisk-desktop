import React from 'react';
import { withRouter } from 'react-router';
import Dialog from 'src/theme/dialog/dialog';
import MultiStep from 'src/modules/common/components/MultiStep';
import { removeSearchParamsFromUrl } from 'src/utils/searchParams';
import styles from './SetPasswordMultiStep.css';
import SetPasswordForm from '../SetPasswordForm';
import SetPasswordSuccess from '../setPasswordSuccess';

function SetPasswordMultiStep({ history }) {
  const onDismissSuccessPage = () => {
    removeSearchParamsFromUrl(history, ['modal'], true);
  };

  return (
    <Dialog hasClose className={styles.wrapper}>
      <MultiStep
        navStyles={{ multiStepWrapper: styles.multiStepWrapper }}
      >
        <SetPasswordForm />
        <SetPasswordSuccess onClose={onDismissSuccessPage} />
      </MultiStep>
    </Dialog>
  );
}

export default withRouter(SetPasswordMultiStep);
