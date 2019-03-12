import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { translate } from 'react-i18next';
import Tooltip from '../toolbox/tooltip/tooltip';
import styles from '../transactionsV2/transactionRowV2.css';

const TableHeader = ({ t }) => (
  <div className={`${grid.row} ${styles.row} ${styles.header}`}>
    <div className={`${grid['col-sm-1']} ${grid['col-lg-1']}`}>{t('Rank')}</div>
    <div className={`${grid['col-sm-3']} ${grid['col-lg-6']}`}>{t('Delegate')}</div>
    <div className={`${grid['col-sm-3']} ${grid['col-lg-2']}`}>
      {t('Forged')}
      <Tooltip className={'showOnTop'} title={t('Forged')} />
    </div>
    <div className={`${grid['col-sm-2']} ${grid['col-lg-1']}`}>
      {t('Productivity')}
      <Tooltip className={'showOnTop'} title={t('Productivity')} />
    </div>
    <div className={`${grid['col-sm-3']} ${grid['col-lg-2']}`}>
      {t('Vote weight')}
      <Tooltip className={'showOnTop'} title={t('Vote weight')} />
    </div>
  </div>);

export default translate()(TableHeader);
