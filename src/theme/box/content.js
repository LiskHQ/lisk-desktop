import PropTypes from 'prop-types';
import React from 'react';
import styles from './box.css';

const Content = ({ children, className, ...rest }) => (
  <div {...rest} className={`${styles.content} ${className}`}>
    {children}
  </div>
);

Content.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Content.defaultProps = {
  className: '',
};

Content.displayName = 'BoxContent';

export default Content;
