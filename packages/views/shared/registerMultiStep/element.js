import React from 'react';

export const Element = ({ children, type, ...rest }) => {
  if (typeof document !== 'undefined') {
    return <div {...rest}>{children}</div>;
  }
  try {
    // eslint-disable-next-line import/no-unresolved
    const { View } = require('react-native');
    const Type = type || View;
    return <Type {...rest}>{children}</Type>;
  } catch (e) {
    return {};
  }
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
  try {
    // eslint-disable-next-line import/no-unresolved
    const ReactButton = require('react-native').Button;
    const Type = type || ReactButton;
    return (
      <Type
        {...rest}
        onPress={onClick}
        title={typeof children === 'string' ? children : 'Button'}
      >
        {children}
      </Type>
    );
  } catch (e) {
    return {};
  }
};
