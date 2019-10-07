/* istanbul ignore file */
import { Redirect, withRouter } from 'react-router';
import React from 'react';
import routes from '../../../constants/routes';

const Monitor = () => (
  // TODO replace route with /monitor/transactions when implemented
  <Redirect push to={routes.blocks.path} />
);

export default withRouter(Monitor);
