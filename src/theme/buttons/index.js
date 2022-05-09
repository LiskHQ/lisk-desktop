import PropTypes from 'prop-types';
import React from 'react';
import primaryButtonTheme from './css/primaryButton.css';
import secondaryButtonTheme from './css/secondaryButton.css';
import styles from './css/size.css';
import tertiaryButtonTheme from './css/tertiaryButton.css';
import warningButtonTheme from './css/warningButton.css';

const getButtonWithTheme = (theme) => {
  const Button = ({
    className, size, ...props
  }) => (
    <button
      {...props}
      className={[
        theme.button,
        className,
        styles.button,
        styles[size],
      ].join(' ')}
    />
  );

  Button.propTypes = {
    className: PropTypes.string,
    size: PropTypes.oneOf(['l', 'm', 's', 'xs']),
  };

  Button.defaultProps = {
    className: '',
    size: 'l',
  };
  return Button;
};

const Button = getButtonWithTheme(primaryButtonTheme);
const PrimaryButton = getButtonWithTheme(primaryButtonTheme);
const SecondaryButton = getButtonWithTheme(secondaryButtonTheme);
const TertiaryButton = getButtonWithTheme(tertiaryButtonTheme);
const WarningButton = getButtonWithTheme(warningButtonTheme);

export {
  Button,
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
  WarningButton,
};
export default Button;
