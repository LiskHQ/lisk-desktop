import React from 'react';

const PrivateWrapper = ({ isAuthenticated, children }) => (
  isAuthenticated && <span>{ children }</ span>
);

export default PrivateWrapper;
