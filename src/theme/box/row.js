import PropTypes from 'prop-types';
import React from 'react';
import styles from './box.css';

const Row = ({ children, className, isClickable, ...rest }) => (
  <section
    {...rest}
    className={`${styles.row} ${className} ${isClickable ? styles.clickableRow : ''}`}
  >
    {children}
  </section>
);

Row.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  isClickable: PropTypes.bool,
};

Row.defaultProps = {
  className: '',
  isClickable: false,
};

Row.displayName = 'BoxRow';

export default Row;
