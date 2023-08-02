import React from 'react';
import Button from './Button';

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
