import React from 'react';
import { useHistory, useLocation } from 'react-router';
import i18n from 'src/utils/i18n/i18n';
import Dialog from 'src/theme/dialog/dialog';
import routes from 'src/routes/routes';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import NoActionView from './NoActionView';

const modes = (history) => ({
  EMPTY_ACCOUNT_LIST: {
    message: i18n.t(
      'Please add an account to your wallet before connecting external applications.'
    ),
    illustrationName: 'emptyValidatorsIllustration',
    buttonTitle: 'Add account',
    onClick: () => history.push(routes.addAccountOptions.path),
  },
  NO_CURRENT_ACCOUNT: {
    message: i18n.t(
      'Please select a current account on your wallet before connecting external applications.'
    ),
    illustrationName: 'emptyValidatorsIllustration',
    buttonTitle: 'Select account',
    onClick: () => addSearchParamsToUrl(history, { modal: 'switchAccount' }),
  },
});

const NoAccountDialog = () => {
  const history = useHistory();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get('mode');

  const currentMode = modes(history)[mode] || modes(history).EMPTY_ACCOUNT_LIST;

  return (
    <Dialog hasClose size="sm">
      <NoActionView
        message={currentMode.message}
        illustrationName={currentMode.illustrationName}
        buttonTitle={currentMode.buttonTitle}
        onClick={currentMode.onClick}
      />
    </Dialog>
  );
};

export default NoAccountDialog;
