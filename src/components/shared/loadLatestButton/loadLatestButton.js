import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { PrimaryButton } from '@toolbox/buttons';
import Icon from '@toolbox/icon';
import styles from './loadLatestButton.css';

const shouldShow = {
  block: (updateHeight, latestBlocks) => (
    latestBlocks.length > 0
    && latestBlocks[0].height > updateHeight
  ),
  transaction: () => (updateHeight, latestBlocks) => (
    latestBlocks.length > 0
    && latestBlocks[0].height > updateHeight
    && latestBlocks[0].numberOfTransactions > 0
  ),
};

const LoadLatestButton = ({ children, onClick, entity }) => {
  const { latestBlocks } = useSelector(state => state.blocks);
  const [updateHeight, setUpdateHeight] = useState(
    latestBlocks.length ? latestBlocks[0].height : 0,
  );

  const handleClick = () => {
    setUpdateHeight(latestBlocks[0].height);
    onClick();
  };

  return shouldShow[entity](latestBlocks, updateHeight)
    ? (
      <PrimaryButton onClick={handleClick} className={styles.button}>
        <Icon name="arrowUpCircle" className={styles.icon} />
        {children}
      </PrimaryButton>
    )
    : null;
};

LoadLatestButton.propTypes = {
  entity: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default LoadLatestButton;
