import React from 'react';

const Button = ({ children, type, onClick, ...rest }) => {
  if (typeof document !== 'undefined') {
    return (
      <button {...rest} onClick={onClick}>
        {children}
      </button>
    );
  }
  return null;
};

export default Button;
