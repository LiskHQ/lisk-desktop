import { themr } from 'react-css-themr';
import PropTypes from 'prop-types';
import React from 'react';
import primaryButtonTheme from './css/primaryButton.css';
import secondaryButtonTheme from './css/secondaryButton.css';
import tertiaryButtonTheme from './css/tertiaryButton.css';
import warningButtonTheme from './css/warningButton.css';
import styles from './css/size.css';

class TBButton extends React.Component {
  render() {
    const {
      theme, className, size, ...props
    } = this.props;
    return (
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
  }
}

TBButton.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['l', 'm', 's', 'xs']),
};

TBButton.defaultProps = {
  className: '',
  size: 'l',
};

const PrimaryButton = themr('primaryButton', primaryButtonTheme)(TBButton);
const SecondaryButton = themr('secondarytButton', secondaryButtonTheme)(TBButton);
const TertiaryButton = themr('tertiaryButton', tertiaryButtonTheme)(TBButton);
const WarningButton = themr('tertiaryButton', warningButtonTheme)(TBButton);
const Button = themr('button', primaryButtonTheme)(TBButton);

export {
  Button,
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
  WarningButton,
};
export default Button;
