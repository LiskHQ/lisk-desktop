import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import TableRow from '../toolbox/table/tableRow';
import styles from './votingListView.css';

const ListLabelsV2 = ({ status, t }) =>
  (<TableRow isHeader={true} className={`${grid.row}`} id="transactionsHeader">
      {
        !status ?
          <div className={`${grid['col-md-1']}  ${grid['col-xs-2']} ${styles.leftText}`}>
            {t('Vote', { context: 'verb' })}
          </div> : null
      }
      <div className={`${grid['col-md-1']} ${grid['col-xs-2']}`}>{t('Rank')}</div>
      <div className={`${grid['col-md-3']} ${grid['col-xs-5']}`}>{t('Name')}</div>
      <div className={`${grid['col-md-5']}`}>{t('Lisk ID')}</div>
      <div className={`${grid['col-md-2']} ${grid['col-xs-3']} ${styles.productivity}`}>{t('Productivity')}</div>
    </TableRow>);

export default ListLabelsV2;
