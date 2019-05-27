// istanbul ignore file
import React from 'react';
import { SecondaryButtonV2 } from '../toolbox/buttons/button';
import styles from './emptyState.css';

const EmptyState = ({
  icon, title, description, btnText, btnExternalUrl, className = '', activeToken,
}) => (
  <div className={`${styles.wrapper} ${className} empty-state`}>
    <img src={icon} />
    <h1 className={styles.title}>{title}</h1>
    <p className={styles.description}>{description}</p>
    {
      activeToken === 'LSK' // TODO this validation should be remove once we have the external link for BTC
      ? <a href={btnExternalUrl}
          rel="noopener noreferrer"
          target="_blank">
          <SecondaryButtonV2>{btnText}</SecondaryButtonV2>
        </a>
      : null
    }
  </div>
);

export default EmptyState;
