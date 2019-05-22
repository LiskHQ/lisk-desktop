import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import TableRow from '../toolbox/table/tableRow';
import styles from './votingListViewV2.css';

const ListLabelsV2 = ({ shouldShowVoteColumn, t }) =>
  (<TableRow isHeader={true} className={`${styles.header} ${grid.row}`} id="transactionsHeader">
      {
        shouldShowVoteColumn ?
          <div className={`${grid['col-md-1']}  ${grid['col-xs-2']} ${styles.leftText}`}>
            {t('Vote', { context: 'verb' })}
          </div> : null
      }
      <div className={`${grid['col-md-1']} ${grid['col-xs-2']}`}>{t('Rank')}</div>
      <div className={`${grid['col-md-3']} ${grid['col-xs-5']}`}>{t('Delegate')}</div>
      <div className={`${grid[shouldShowVoteColumn ? 'col-md-3' : 'col-md-4']} ${grid['col-xs-3']} ${styles.productivity}`}>{t('Productivity')}</div>
      <div className={`${grid['col-md-4']}`}>{t('Vote weight')}</div>
    </TableRow>);

export default ListLabelsV2;
