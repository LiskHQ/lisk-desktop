import React from 'react';
import { Button } from './element';

/**
 * Returns a Button if customButton if not defined and customButton if it's
 * a React component
 * @param {Object} props
 * @param {Object} props.children - THe react children of the mounted element
 * @param {Object?} props.customButton if passed, if should be valid React element
 * @param {Array} props.rest the rest of the props
 */
const NavigatorButton = ({ children, customButton, ...rest }) => {
  if (customButton === undefined) {
    return <Button {...rest}>{children}</Button>;
  }
  const CustomButton = customButton;
  return (
    <CustomButton onPress={rest.onClick} {...rest}>
      {children}
    </CustomButton>
  );
};

export default NavigatorButton;
