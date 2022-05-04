import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { PrimaryButton } from 'src/theme/buttons';
import Icon from 'src/theme/Icon';
import styles from './loadLatestButton.css';

const shouldShow = {
  block: (updateHeight, latestBlocks) =>
    latestBlocks.length > 0
    && updateHeight > 0
    && latestBlocks[0].height > updateHeight + 2,
  transaction: (updateHeight, latestBlocks) =>
    latestBlocks.length > 0
    && updateHeight > 0
    && latestBlocks[0].height > updateHeight
    && latestBlocks[0].numberOfTransactions > 0,
};

const LoadLatestButton = ({
  children,
  buttonClassName,
  onClick,
  entity,
  latestBlocks,
}) => {
  const [updateHeight, setUpdateHeight] = useState(
    latestBlocks.length ? latestBlocks[0].height : 0,
  );

  const handleClick = () => {
    setUpdateHeight(latestBlocks[0].height);
    onClick();
  };

  useEffect(() => {
    if (latestBlocks.length > 0 && updateHeight === 0) {
      setUpdateHeight(latestBlocks[0].height);
    }
  }, [latestBlocks.length]);

  return shouldShow[entity]
    && shouldShow[entity](updateHeight, latestBlocks) ? (
      <PrimaryButton
        onClick={handleClick}
        className={`${styles.button} ${buttonClassName || ''} load-latest`}
      >
        <Icon name="refresh" className={styles.icon} />
        <span>{children}</span>
      </PrimaryButton>
    ) : null;
};

LoadLatestButton.propTypes = {
  entity: PropTypes.oneOf(['block', 'transaction']),
  onClick: PropTypes.func.isRequired,
};

export default LoadLatestButton;
