import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import TableRow from '../toolbox/table/tableRow';
import Tooltip from '../toolbox/tooltip/tooltip';
import styles from './votesTab.css';

const VotesTableHeader = ({ t }) => (
  <TableRow isHeader>
    <div className={`${grid['col-sm-1']} ${grid['col-lg-1']}`}>{t('Rank')}</div>
    <div className={`${grid['col-sm-3']} ${grid['col-lg-6']}`}>{t('Delegate')}</div>
    <div className={`${grid['col-sm-2']} ${grid['col-lg-2']}`}>
      {t('Forged')}
      <Tooltip className="showOnBottom">
        <p>{t('Amount of LSK earned by a delegate from forging blocks.')}</p>
      </Tooltip>
    </div>
    <div className={`${grid['col-sm-2']} ${grid['col-lg-1']}`}>
      {t('Productivity')}
      <Tooltip className="showOnBottom">
        <p>{t('% of successfully forged blocks in relation to total blocks that were available for this particular delegate to forge')}</p>
      </Tooltip>
    </div>
    <div className={`${grid['col-sm-4']} ${grid['col-lg-2']} ${styles.lastHeading}`}>
      {t('Vote weight')}
      <Tooltip className="showOnBottom">
        <p>{t('Sum of LSK of all accounts who voted for a delegate')}</p>
      </Tooltip>
    </div>
  </TableRow>
);

export default VotesTableHeader;
