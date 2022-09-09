import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Content from './content';
import Button from './button';
import styles from './flashMessage.css';

const FlashMessage = ({ onDismiss, className, shouldShow, children, hasCloseAction }) => {
  const [dismissed, setDismissed] = useState(false);

  const dismiss = () => {
    setDismissed(true);
    if (typeof onDismiss === 'function') onDismiss();
  };

  return (
    shouldShow &&
    !dismissed && (
      <div className={`${styles.wrapper} ${className}`}>
        {children}
        {hasCloseAction &&
          !(Array.isArray(children) && children.some((child) => child.type === Button)) && (
            <span className={styles.closeBtn} onClick={dismiss} />
          )}
      </div>
    )
  );
};

FlashMessage.propTypes = {
  className: PropTypes.string,
  shouldShow: PropTypes.bool,
  onDismiss: PropTypes.func,
  hasCloseAction: PropTypes.bool,
};

FlashMessage.defaultProps = {
  className: '',
  shouldShow: false,
  onDismiss: null,
  hasCloseAction: true,
};

FlashMessage.displayName = 'FlashMessage';
FlashMessage.Content = Content;
FlashMessage.Button = Button;

export default FlashMessage;
