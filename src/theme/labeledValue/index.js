import PropTypes from 'prop-types';
import React from 'react';
import styles from './labeledValue.css';

const LabeledValue = ({ label, children, className, ...props }) => (
  <div className={[styles.wrapper, className].join(' ')} {...props}>
    <label>{label}</label>
    <span>{children}</span>
  </div>
);

LabeledValue.propTypes = {
  label: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
};

LabeledValue.defaultProps = {
  label: '',
  children: null,
  className: '',
};

export default LabeledValue;
