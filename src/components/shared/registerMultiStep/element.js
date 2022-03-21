import React from 'react';

export const Element = ({ children, type, ...rest }) => {
  if (typeof document !== 'undefined') {
    return <div {...rest}>{children}</div>;
  }
  return null;
};

export const Button = ({
  children, type, onClick, ...rest
}) => {
  if (typeof document !== 'undefined') {
    return (
      <button {...rest} onClick={onClick}>
        {children}
      </button>
    );
  }
  return null;
};
