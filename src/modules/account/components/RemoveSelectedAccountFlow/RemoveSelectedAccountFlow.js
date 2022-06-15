import React from 'react';
import { withRouter } from 'react-router';
import RemoveAccount from '../RemoveAccount/RemoveAccount';

const RemoveSelectedAccountFlow = ({ history }) => {
  const { address } = history.location.state.params;

  return (
    <RemoveAccount address={address} />
  );
};

export default withRouter(RemoveSelectedAccountFlow);
