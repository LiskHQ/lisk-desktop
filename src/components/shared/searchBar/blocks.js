import React from 'react';
import styles from './transactionsAndBlocks.css';

const Blocks = ({
  t, blocks, onSelectedRow, updateRowItemIndex, rowItemIndex,
}) => (
  <div className={styles.wrapper}>
    <header className={styles.header}>
      <label>{t('Block')}</label>
    </header>
    <div className={styles.content}>
      {blocks.map((block, i) => (
        <div
          key={block.id}
          data-index={i}
          className={`${styles.resultRow} ${rowItemIndex === i ? styles.active : ''}`}
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
