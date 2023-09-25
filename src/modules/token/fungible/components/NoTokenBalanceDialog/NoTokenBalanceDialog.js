import React from 'react';
import { useHistory, useLocation } from 'react-router';
import Dialog from 'src/theme/dialog/dialog';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import NoActionView from './NoActionView';

const NoTokenBalanceDialog = () => {
  const history = useHistory();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const message = queryParams.get('message');

  const onRequestToken = () => {
    addSearchParamsToUrl(history, { modal: 'request' });
  };

  return (
    <Dialog hasClose size="sm">
      <NoActionView message={message} onClick={onRequestToken} />
    </Dialog>
  );
};

export default NoTokenBalanceDialog;
