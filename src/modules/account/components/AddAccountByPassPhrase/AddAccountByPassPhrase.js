/* eslint-disable max-lines */
import React from 'react';
import { withRouter } from 'react-router';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import SetPasswordForm from 'src/modules/auth/components/SetPasswordForm/SetPasswordForm';
import MultiStep from 'src/modules/common/components/MultiStep';
import AddAccountForm from '../AddAccountForm';
import styles from './AddAccountByPassPhrase.css';

const AddAccountByPassPhrase = ({ history }) => {
  const onSetPassword = () => {
    history.push({ path: '/account/add', search: '?modal=accountCreated' });
  };

  return (
    <>
      <div className={`${styles.addAccount} ${grid.row}`}>
        <MultiStep
          navStyles={{ multiStepWrapper: styles.wrapper }}
          progressBar={null}
        >
          <AddAccountForm />
          <SetPasswordForm onSubmit={onSetPassword} />
        </MultiStep>
      </div>
    </>
  );
};

export default withRouter(AddAccountByPassPhrase);
