import PropTypes from 'prop-types';
import React from 'react';
import styles from './box.css';

const Row = ({ children, className, ...rest }) => (
  <section {...rest} className={`${styles.row} ${className}`}>{children}</section>
);

Row.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Row.defaultProps = {
  className: '',
};

export default Row;
