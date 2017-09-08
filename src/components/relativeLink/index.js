import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

const RelativeLink = ({ location, to, children, className }) => {
  const path = `${location.pathname}/${to}`.replace('//', '/');
  return (
    <Link className={className} to={path}>{ children }</Link>
  );
};

export default withRouter(RelativeLink);
