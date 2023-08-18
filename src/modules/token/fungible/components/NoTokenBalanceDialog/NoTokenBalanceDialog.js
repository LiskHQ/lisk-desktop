import React from 'react';
import { useHistory } from 'react-router';
import Dialog from 'src/theme/dialog/dialog';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import NoTokenBalance from './NoTokenBalance';

const NoTokenBalanceDialog = () => {
  const history = useHistory();
  const onRequestToken = () => {
    addSearchParamsToUrl(history, { modal: 'request' });
  };

  return (
    <Dialog hasClose size="sm">
      <NoTokenBalance onRequestToken={onRequestToken} />
    </Dialog>
  );
};

export default NoTokenBalanceDialog;
