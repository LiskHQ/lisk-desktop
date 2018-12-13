import React from 'react';
import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './tabs.css';

const TransferTabs = ({ t, setTabSend, isActiveTabSend }) => (
  <div className={`${grid.row} ${styles.tab} `}>
    <div className={`${grid['col-xs-6']} ${isActiveTabSend ? styles.tabActive : styles.tabInactive} send-tab`}
      onClick={() => { setTabSend(true); }}>
      {t('Send')}
    </div>
    <div className={`${grid['col-xs-6']}  ${isActiveTabSend ? styles.tabInactive : styles.tabActive} request-tab`}
      onClick={() => { setTabSend(false); }}>
      {t('Request')}
    </div>
  </div>
);

export default translate()(TransferTabs);

