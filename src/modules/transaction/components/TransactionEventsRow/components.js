import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Icon from 'src/theme/Icon';
import { TertiaryButton } from 'src/theme/buttons';
import styles from './TransactionEventsRow.css';

export const EventId = ({ hash }) => (
  <div className={`event-hash ${styles.eventHash} ${grid['col-xs-6']}`}>
    <span>{hash}</span>
  </div>
);

export const EventType = ({ action }) => (
  <div className={`${grid['col-xs-3']} event-action ${styles.eventAction}`}>{action}</div>
);

export const EventModule = ({ module }) => (
  <div className={`${grid['col-xs-4']} event-action ${styles.eventAction}`}>{module}</div>
);

export const EventIndex = ({ id }) => <div className={grid['col-xs-4']}>{id}</div>;

export const CollapseToggle = ({ isCollapsed, onToggle }) => (
  <div className={`${styles.toggleButton} ${grid['col-xs-1']}`}>
    <TertiaryButton onClick={onToggle}>
      <Icon name="arrowRightInactive" className={isCollapsed ? styles.collapsed : ''} />
    </TertiaryButton>
  </div>
);
