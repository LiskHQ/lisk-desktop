import React from 'react';
import PropTypes from 'prop-types';
import DialogHolder from './holder';
import Title from './title';
import Description from './description';
import Options from './options';
import styles from './dialog.css';

const Dialog = ({ children, hasClose, className }) => (
  <div className={`${styles.wrapper} ${className}`}>
    {hasClose && (
      <span
        onClick={DialogHolder.hideDialog}
        className={`${styles.closeBtn} dialog-close-button`}
      />
    )}
    {children}
  </div>
);

Dialog.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  hasClose: PropTypes.bool,
};

Dialog.defaultProps = {
  hasClose: false,
};

Dialog.Title = Title;
Dialog.Description = Description;
Dialog.Options = Options;

export default Dialog;
