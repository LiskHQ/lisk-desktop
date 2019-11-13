import React from 'react';
import styles from './transactions.css';

const Blocks = ({
  t, blocks, onSelectedRow, updateRowItemIndex, rowItemIndex,
}) => (
  <div className={styles.wrapper}>
    <header className={styles.header}>
      <label>{t('Blocks')}</label>
    </header>
    <div className={styles.content}>
      {blocks.map((block, i) => (
        <div
          key={block.id}
          data-index={i}
          className={`${styles.transactionRow} ${rowItemIndex === i ? styles.active : ''}`}
          onMouseEnter={updateRowItemIndex}
          onClick={() => onSelectedRow(block.id)}
        >
          {block.id}
        </div>
      ))}
    </div>
  </div>
);

export default Blocks;
