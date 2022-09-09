import React from 'react';
import { withRouter } from 'react-router';
import { selectSearchParamValue } from 'src/utils/searchParams';
import RemoveAccount from '../RemoveAccount/RemoveAccount';

const RemoveSelectedAccountFlow = ({ history }) => {
  const address = selectSearchParamValue(history.location.search, 'address');
  return <RemoveAccount address={address} />;
};

export default withRouter(RemoveSelectedAccountFlow);
