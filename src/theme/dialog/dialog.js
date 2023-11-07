import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { removeSearchParamsFromUrl } from 'src/utils/searchParams';
import Icon from '../Icon';
import Title from './title';
import Description from './description';
import Options from './options';
import styles from './dialog.css';

const Dialog = ({
  children,
  hasClose,
  onCloseIcon,
  hasBack,
  className,
  history,
  size,
  customBackBtn,
}) => {
  const onCloseClick = () => {
    onCloseIcon?.();
    removeSearchParamsFromUrl(history, ['modal'], true);
  };
  const onBackClick = () => history.goBack();

  return (
    <div
      data-testid="dialog-container"
      className={`${styles.wrapper} ${className ?? ''} ${size ? styles[size] : ''}`}
    >
      {hasBack && (
        <Icon
          name={customBackBtn ?? 'arrowLeftTailed'}
          className={`${styles.backBtn} dialog-back-button`}
          onClick={onBackClick}
          noTheme={!!customBackBtn}
        />
      )}
      {hasClose && (
        <span
          data-testid="dialog-close-button"
          onClick={onCloseClick}
          className={`${styles.closeBtn} dialog-close-button`}
        />
      )}
      {children}
    </div>
  );
};

Dialog.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  hasClose: PropTypes.bool,
};

Dialog.defaultProps = {
  hasClose: false,
};

Dialog.Title = Title;
Dialog.Description = Description;
Dialog.Options = Options;

export default withRouter(Dialog);
