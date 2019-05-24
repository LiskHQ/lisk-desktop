// istanbul ignore file
import React from 'react';
import { SecondaryButtonV2 } from '../toolbox/buttons/button';
import styles from './emptyState.css';

const EmptyState = ({
  icon, title, description, btnText, btnExternalUrl, className = '',
}) => (
  <div className={`${styles.wrapper} ${className} empty-state`}>
    <img src={icon} />
    <h1 className={styles.title}>{title}</h1>
    <p className={styles.description}>{description}</p>
    <a href={btnExternalUrl}
      rel="noopener noreferrer"
      target="_blank">
      <SecondaryButtonV2>{btnText}</SecondaryButtonV2>
    </a>
  </div>
);

export default EmptyState;
