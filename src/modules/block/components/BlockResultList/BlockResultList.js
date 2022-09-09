import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BlockResultList.css';

const Blocks = ({ blocks, onSelectedRow, updateRowItemIndex }) => {
  const { t } = useTranslation();

  return (
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
};

export default Blocks;
