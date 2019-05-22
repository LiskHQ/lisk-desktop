// istanbul ignore file
import React from 'react';
import links from '../../constants/externalLinks';
import { SecondaryButtonV2 } from '../toolbox/buttons/button';
import styles from './emptyState.css';

const EmptyState = ({
  t, icon, title, description,
}) => (
  <div className={`${styles.wrapper} empty-state`}>
    <img src={icon} />
    <h1 className={styles.title}>{title}</h1>
    <p className={styles.description}>{description}</p>
    <a href={links.outgoingTransactions}
      rel="noopener noreferrer"
      target="_blank">
      <SecondaryButtonV2>{t('Learn more')}</SecondaryButtonV2>
    </a>
  </div>
);

export default EmptyState;
