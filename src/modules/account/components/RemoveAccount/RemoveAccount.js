import React, { useRef } from 'react';
import { withRouter } from 'react-router';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import MultiStep from 'src/modules/common/components/MultiStep';
import ManageAccounts from '@account/components/ManageAccounts';
import SetPasswordSuccess from '@auth/components/SetPasswordSuccess';
import styles from './RemoveAccount.css';

const RemoveAccount = () => {
  const multiStepRef = useRef(null);

  return (
    <>
      <div className={`${styles.removeAccount} ${grid.row}`}>
        <MultiStep
          navStyles={{ multiStepWrapper: styles.wrapper }}
          ref={multiStepRef}
        >
          <ManageAccounts />
          <SetPasswordSuccess />
        </MultiStep>
      </div>
    </>
  );
};

export default withRouter(RemoveAccount);
