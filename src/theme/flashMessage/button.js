import React from 'react';
import PropTypes from 'prop-types';
import { SecondaryButton } from '../buttons';
import styles from './flashMessage.css';

const Button = ({ children, className, onClick, ...props }) =>
  children && (
    <SecondaryButton
      className={`${styles.button} ${className} light button`}
      size="s"
      onClick={onClick}
      {...props}
    >
      {children}
    </SecondaryButton>
  );

Button.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  className: PropTypes.string,
};

Button.defaultProps = {
  className: '',
  onClick: null,
};

Button.displayName = 'FlashMessage.Button';

export default Button;
