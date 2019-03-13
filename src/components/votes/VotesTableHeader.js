import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { translate } from 'react-i18next';
import TableRow from '../toolbox/table/tableRow';
import Tooltip from '../toolbox/tooltip/tooltip';
import styles from './votesTab.css';

const VotesTableHeader = ({ t }) => (
  <TableRow isHeader={true}>
    <div className={`${grid['col-sm-1']} ${grid['col-lg-1']}`}>{t('Rank')}</div>
    <div className={`${grid['col-sm-3']} ${grid['col-lg-6']}`}>{t('Delegate')}</div>
    <div className={`${grid['col-sm-3']} ${grid['col-lg-2']}`}>
      {t('Forged')}
      <Tooltip className={'showOnBottom'}>
        <p>{t('Amount of LSK that the delegate earned by forging blocks of transactions.')}</p>
      </Tooltip>
    </div>
    <div className={`${grid['col-sm-2']} ${grid['col-lg-1']}`}>
      {t('Productivity')}
      <Tooltip className={'showOnBottom'}>
        <p>{t('Percentage of successfully forged blocks of when the delegate should have forged a block of transactions.')}</p>
      </Tooltip>
    </div>
    <div className={`${grid['col-sm-3']} ${grid['col-lg-2']} ${styles.lastHeading}`}>
      {t('Vote weight')}
      <Tooltip className={'showOnBottom'}>
        <p>{t('Sum of LSK balance of all accounts who voted for this delegate.')}</p>
      </Tooltip>
    </div>
  </TableRow>
);

export default translate()(VotesTableHeader);
