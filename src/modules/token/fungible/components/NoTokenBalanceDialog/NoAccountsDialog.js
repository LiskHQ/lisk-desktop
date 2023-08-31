import React from 'react';
import { useHistory } from 'react-router';
import Dialog from 'src/theme/dialog/dialog';
import routes from 'src/routes/routes';
import NoActionView from './NoActionView';

const NoAccountDialog = () => {
  const history = useHistory();

  const onNavigateToAddAccount = () => {
    history.push(routes.addAccountOptions.path);
  };

  return (
    <Dialog hasClose size="sm">
      <NoActionView
        message="Please add an account to your wallet before connecting external applications."
        illustrationName="emptyValidatorsIllustration"
        buttonTitle="Add account"
        onClick={onNavigateToAddAccount}
      />
    </Dialog>
  );
};

export default NoAccountDialog;
