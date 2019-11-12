import React from 'react';
import styles from './accountsAndDeletegates.css';

const Blocks = ({
  t, blocks, onSelectedRow, updateRowItemIndex, rowItemIndex,
}) => (
  <div>
    <header className={styles.header}>
      <label>{t('Blocks')}</label>
    </header>
    {blocks.map((block, i) => (
      <div
        className={`${styles.accountRow} ${rowItemIndex === i ? styles.active : ''} delegates-row`}
        key={block.id}
        onMouseEnter={updateRowItemIndex}
        onClick={() => onSelectedRow(block.account.address)}
      >
        {block.id}
      </div>
    ))}
  </div>
);

export default Blocks;
