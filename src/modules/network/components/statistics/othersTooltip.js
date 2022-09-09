import React from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from 'src/theme/Tooltip';
import styles from './othersTooltip.css';

const OthersTooltip = ({ data, title }) => {
  const { t } = useTranslation();
  return (
    <Tooltip className={styles.tooltip} position="bottom right" indent>
      <>
        <header className={styles.row}>
          <h4>{title}</h4>
          <h4 className={styles.count}>{t('Count')}</h4>
        </header>
        <article>
          {data.map((item) => (
            <div key={item.label} className={styles.row}>
              <span>{item.label}</span>
              <span className={styles.count}>{item.value}</span>
            </div>
          ))}
        </article>
      </>
    </Tooltip>
  );
};

export default OthersTooltip;
