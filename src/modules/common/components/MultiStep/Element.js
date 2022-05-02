import React from 'react';

const Element = ({ children, type, ...rest }) => {
  if (typeof document !== 'undefined') {
    return <div {...rest}>{children}</div>;
  }
  return null;
};

export default Element;
