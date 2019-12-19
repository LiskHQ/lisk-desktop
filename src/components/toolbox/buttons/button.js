import PropTypes from 'prop-types';
import React from 'react';
import primaryButtonTheme from './css/primaryButton.css';
import secondaryButtonTheme from './css/secondaryButton.css';
import styles from './css/size.css';
import tertiaryButtonTheme from './css/tertiaryButton.css';
import warningButtonTheme from './css/warningButton.css';
import withTheme from '../../../utils/withTheme';

const TBButton = ({
  theme, className, size, ...props
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

TBButton.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['l', 'm', 's', 'xs']),
};

TBButton.defaultProps = {
  className: '',
  size: 'l',
};

TBButton.displayName = 'Button';

const PrimaryButton = withTheme('PrimaryButton', primaryButtonTheme)(TBButton);
const SecondaryButton = withTheme('SecondarytButton', secondaryButtonTheme)(TBButton);
const TertiaryButton = withTheme('TertiaryButton', tertiaryButtonTheme)(TBButton);
const WarningButton = withTheme('WarningButton', warningButtonTheme)(TBButton);
const Button = withTheme('Button', primaryButtonTheme)(TBButton);

export {
  Button,
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
  WarningButton,
};
export default Button;
