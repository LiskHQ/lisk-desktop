import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './votingListView.css';

const ListLabels = ({ status, t }) =>
  (<ul className={`${styles.tableHead} ${grid.row}`}>
    {
      !status ?
        <li className={`${grid['col-md-1']}  ${grid['col-xs-2']} ${styles.leftText}`}>
          {t('Vote', { context: 'verb' })}
        </li> : null
    }
    <li className={`${grid['col-md-1']} ${grid['col-xs-2']}`}>{t('Rank')}</li>
    <li className={`${grid['col-md-3']} ${grid['col-xs-5']}`}>{t('Name')}</li>
    <li className={`${grid['col-md-5']}`}>{t('Lisk ID')}</li>
    <li className={`${grid['col-md-2']} ${grid['col-xs-3']} ${styles.productivity}`}>{t('Productivity')}</li>
  </ul>);

export default ListLabels;
