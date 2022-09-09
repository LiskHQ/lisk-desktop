import React from 'react';
import PropTypes from 'prop-types';
import styles from '../Input/input.css';

const Textarea = ({ setRef, className, size, ...props }) => (
  <textarea ref={setRef} {...props} className={`${styles.input} ${className} ${styles[size]}`} />
);

Textarea.propTypes = {
  size: PropTypes.oneOf(['xs', 's', 'm', 'l']),
  setRef: PropTypes.func,
  className: PropTypes.string,
};

Textarea.defaultProps = {
  size: 'l',
  className: '',
  setRef: null,
};

export default Textarea;
