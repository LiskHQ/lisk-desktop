import React from 'react';
import PropTypes from 'prop-types';
import styles from './StoryWrapper.css';
import ThemeContext from '../../../src/contexts/theme';

const StoryWrapper = ({ className, children, ...props }) =>
  <ThemeContext.Provider value="light"><div className={`${className} ${styles.wrapper}`} {...props}>{children}</div></ThemeContext.Provider>;

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
