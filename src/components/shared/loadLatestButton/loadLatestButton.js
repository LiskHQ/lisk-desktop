import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { PrimaryButton } from '@toolbox/buttons';
import Icon from '@toolbox/icon';
import styles from './loadLatestButton.css';

const shouldShow = {
  block: (updateHeight, latestBlocks) => (
    latestBlocks.length > 0
    && latestBlocks[0].height > (updateHeight + 2)
  ),
  transaction: (updateHeight, latestBlocks) => (
    latestBlocks.length > 0
    && latestBlocks[0].height > updateHeight
    && latestBlocks[0].numberOfTransactions > 0
  ),
};

const LoadLatestButton = ({
  children, onClick, entity, latestBlocks,
}) => {
  const [updateHeight, setUpdateHeight] = useState(
    latestBlocks.length ? latestBlocks[0].height : 0,
  );

  const handleClick = () => {
    setUpdateHeight(latestBlocks[0].height);
    onClick();
  };

  return shouldShow[entity](updateHeight, latestBlocks)
    ? (
      <PrimaryButton onClick={handleClick} className={styles.button}>
        <Icon name="refresh" className={styles.icon} />
        <span>{children}</span>
      </PrimaryButton>
    )
    : null;
};

LoadLatestButton.propTypes = {
  entity: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default LoadLatestButton;
