import PropTypes from 'prop-types';
import React from 'react';
import Content from './content';
import EmptyState from '../../emptyState';
import Footer from './footer';
import FooterButton from './footerButton';
import Header from './header';
import ProgressBar from '../progressBar/progressBar';
import Row from './row';
import Tabs from '../tabs';
import styles from './box.css';

const Box = ({
  main, width, className, children, isLoading,
}) => {
  const hasHeader = Array.isArray(children) && children.some(child => (
    child && (child.type === 'header' || child.type.displayName === 'Box.Header')
  ));
  return (
    <div className={`
      ${styles.wrapper}
      ${hasHeader ? styles.withHeader : ''}
      ${main ? styles.main : ''}
      ${styles[width]}
      ${className}`}
    >
      {isLoading
        ? (
          <div className={styles.loadingOverlay}>
            <ProgressBar type="linear" mode="indeterminate" theme={styles} className="loading" />
          </div>
        )
        : null}
      { children }
    </div>
  );
};

Box.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  className: PropTypes.string,
  width: PropTypes.oneOf(['full', 'medium']),
  isLoading: PropTypes.bool,
};

Box.defaultProps = {
  className: '',
  width: 'full',
  isLoading: false,
};

Box.Content = Content;
Box.EmptyState = EmptyState;
Box.EmptyState.displayName = 'Box.EmptyState';
Box.Footer = Footer;
Box.FooterButton = FooterButton;
Box.Header = Header;
Box.Row = Row;
Box.Tabs = Tabs;
Box.Tabs.displayName = 'Box.Tabs';

export default Box;
