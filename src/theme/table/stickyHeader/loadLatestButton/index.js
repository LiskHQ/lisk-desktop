import React from 'react';
import PropTypes from 'prop-types';

import { useLatestBlock } from '@block/hooks/queries/useLatestBlock';
import { PrimaryButton } from 'src/theme/buttons';
import Icon from 'src/theme/Icon';
import styles from './loadLatestButton.css';

const shouldShow = {
  block: (updateHeight, currentBlock) => updateHeight > 0 && currentBlock.height > updateHeight + 2,
  transaction: (updateHeight, currentBlock) =>
    updateHeight > 0 && currentBlock.height > updateHeight && currentBlock.numberOfTransactions > 0,
};

const LoadLatestButton = ({ children, buttonClassName, onClick, entity }) => {
  const { data: currentBlock } = useLatestBlock();
  const [updateHeight, setUpdateHeight] = React.useState(currentBlock.height);
  const handleClick = () => {
    setUpdateHeight(currentBlock.height);
    onClick();
  };

  return shouldShow[entity] && shouldShow[entity](updateHeight, currentBlock) ? (
    <PrimaryButton
      onClick={handleClick}
      className={`${styles.button} ${buttonClassName || ''} load-latest`}
    >
      <Icon name="refreshActive" className={styles.icon} />
      <span>{children}</span>
    </PrimaryButton>
  ) : null;
};

LoadLatestButton.propTypes = {
  entity: PropTypes.oneOf(['block', 'transaction']),
  onClick: PropTypes.func.isRequired,
};

export default LoadLatestButton;
