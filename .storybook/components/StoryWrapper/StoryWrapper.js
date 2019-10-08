import React from 'react';
import PropTypes from 'prop-types';
import styles from './StoryWrapper.css';

const StoryWrapper = ({ className, children, ...props }) =>
  <div className={`${className} ${styles.wrapper}`} {...props}>{children}</div>;

StoryWrapper.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
}

StoryWrapper.defaultProps = {
  className: '',
  children: '',
}

export default StoryWrapper;
