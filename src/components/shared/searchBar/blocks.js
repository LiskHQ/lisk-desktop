import React from 'react';
import styles from './transactionsAndBlocks.css';

const Blocks = ({
  t, blocks, onSelectedRow, updateRowItemIndex,
}) => (
  <div className={`${styles.wrapper} blocks`}>
    <header className={`${styles.header} blocks-header`}>
      <label>{t('Block')}</label>
    </header>
    <div className={`${styles.content} blocks-content`}>
      {blocks.map((block, i) => (
        <div
          key={block.id}
          data-index={i}
          className={`${styles.resultRow} ${styles.active} search-block-row`}
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
