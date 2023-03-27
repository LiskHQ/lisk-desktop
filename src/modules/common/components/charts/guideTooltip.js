import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'src/theme/Tooltip';
import styles from './guideTooltip.css';

const DoughnutChartIcon = () => (
  <div className={styles.container}>
    <div className={styles.quarterTile}>
      <div className={`${styles.tile} ${styles.green}`} />
      <div className={`${styles.tile} ${styles.blue}`} />
      <div className={`${styles.tile} ${styles.yellow}`} />
      <div className={`${styles.tile} ${styles.orange}`} />
    </div>
    <span className={styles.label}>Guides</span>
  </div>
);

const GuideTooltip = ({ children }) => (
  <Tooltip size="maxContent" position="bottom right" indent content={<DoughnutChartIcon />}>
    <ul className={styles.guideTooltipContentList}>{children}</ul>
  </Tooltip>
);

export const GuideTooltipItem = ({ color, label }) => (
  <li className={styles.guideTooltipContentListItem}>
    <div className={styles.circle} style={{ backgroundColor: color }} />
    {label}
  </li>
);

GuideTooltipItem.propTypes = {
  label: PropTypes.string,
  color: PropTypes.string,
};

export default GuideTooltip;
