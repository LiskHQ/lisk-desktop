import PropTypes from 'prop-types';
import React from 'react';
import ProgressBar from 'src/theme/ProgressBar/progressBar';
import styles from './box.css';

const Box = ({ main, width, className, children, isLoading }) => {
  const hasHeader =
    Array.isArray(children) &&
    children.some(
      (child) => child && (child.type === 'header' || child.type.displayName === 'BoxHeader')
    );
  return (
    <div
      className={`
      ${styles.wrapper}
      ${hasHeader ? styles.withHeader : ''}
      ${main ? styles.main : ''}
      ${styles[width]}
      ${className}`}
    >
      {isLoading ? (
        <div className={styles.loadingOverlay}>
          <ProgressBar type="linear" mode="indeterminate" theme={styles} className="loading" />
        </div>
      ) : null}
      {children}
    </div>
  );
};

Box.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  width: PropTypes.oneOf(['full', 'medium']),
  isLoading: PropTypes.bool,
};

Box.defaultProps = {
  className: '',
  width: 'full',
  isLoading: false,
};

Box.displayName = 'Box';

export default Box;
