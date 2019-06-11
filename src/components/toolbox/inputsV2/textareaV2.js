import React from 'react';
import PropTypes from 'prop-types';
import styles from './inputV2.css';

const TextareaV2 = ({
  setRef, className, size, ...props
}) => <textarea ref={setRef} {...props} className={`${styles.input} ${className} ${styles[size]}`} />;

TextareaV2.propTypes = {
  size: PropTypes.oneOf(['xs', 's', 'm', 'l']),
  setRef: PropTypes.func,
  className: PropTypes.string,
};


TextareaV2.defaultProps = {
  size: 'l',
  className: '',
  setRef: null,
};

export default TextareaV2;
