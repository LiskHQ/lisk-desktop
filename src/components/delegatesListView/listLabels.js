import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import TableRow from '../toolbox/table/tableRow';
import Tooltip from '../toolbox/tooltip/tooltip';
import styles from './votingListView.css';

const ListLabels = ({
  shouldShowVoteColumn, t, columnClassNames,
}) =>
  (
    <TableRow isHeader className={`${styles.header} ${grid.row}`} id="transactionsHeader">
      {
        shouldShowVoteColumn
          ? (
            <div className={columnClassNames.vote}>
              {t('Vote', { context: 'verb' })}
            </div>
          ) : null
      }
      <div className={columnClassNames.rank}>{t('Rank')}</div>
      <div className={columnClassNames.delegate}>{t('Delegate')}</div>
      <div className={columnClassNames.forged}>{t('Forged LSK')}</div>
      <div className={columnClassNames.productivity}>
        {t('Productivity')}
        <Tooltip className="showOnLeft">
          <p>
            {' '}
            {
            t('Percentage of successfully forged blocks of when the delegate should have forged a block of transactions.')
          }
            {' '}
          </p>
        </Tooltip>
      </div>
      <div className={columnClassNames.voteWeight}>
        {t('Vote weight')}
        <Tooltip className="showOnLeft">
          <p>
            {' '}
            {
            t('Sum of LSK balance of all accounts who voted for this delegate')
          }
            {' '}
          </p>
        </Tooltip>
      </div>
    </TableRow>
  );

export default ListLabels;
