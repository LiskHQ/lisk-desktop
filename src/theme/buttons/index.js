import PropTypes from 'prop-types';
import React from 'react';
import { ReactComponent as CircularLoader } from '@setup/react/assets/images/icons/loading-rounded.svg';
import primaryButtonTheme from './css/primaryButton.css';
import secondaryButtonTheme from './css/secondaryButton.css';
import styles from './css/size.css';
import tertiaryButtonTheme from './css/tertiaryButton.css';
import warningButtonTheme from './css/warningButton.css';
import baseStyles from './css/base.css';
import outlineButtonTheme from './css/outlineButton.css';

const getButtonWithTheme = (theme) => {
  const Button = ({ className, size, isLoading, ...props }) => (
    <button
      {...props}
      disabled={props.disabled || isLoading}
      className={[theme.button, className, styles.button, styles[size]].join(' ')}
    >
      {isLoading ? (
        <div className={baseStyles.loadingWrapper}>
          <CircularLoader data-testid="circular-loader" />
        </div>
      ) : (
        props.children
      )}
    </button>
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
const OutlineButton = getButtonWithTheme(outlineButtonTheme);

export { Button, PrimaryButton, SecondaryButton, TertiaryButton, WarningButton, OutlineButton };
export default Button;
