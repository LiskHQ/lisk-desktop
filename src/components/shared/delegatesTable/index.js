import { withTranslation } from 'react-i18next';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Input } from '../../toolbox/inputs';
import { formatAmountBasedOnLocale } from '../../../utils/formattedNumber';
import { tokenMap } from '../../../constants/tokens';
import Box from '../../toolbox/box';
import Illustration from '../../toolbox/illustration';
import LiskAmount from '../liskAmount';
import Table from '../../toolbox/table';
import Tooltip from '../../toolbox/tooltip/tooltip';
import styles from './delegatesTable.css';
import votingConst from '../../../constants/voting';

const DelegatesTable = ({
  columns, delegates, tabs, t, filters, applyFilters,
}) => {
  const data = delegates.data.map(d => ({ ...d, id: d.username }));

  const columnDefaults = {
    rank: {
      header: t('Rank'),
      getValue: ({ rank }) => `#${rank}`,
      className: grid['col-xs-1'],
    },
    rewards: {
      header: <React.Fragment>
        {t('Forged')}
        <Tooltip className="showOnLeft">
          <p>{t('Sum of all LSK awarded to a delegate for each block successfully generated on the blockchain.')}</p>
        </Tooltip>
      </React.Fragment>,
      /* eslint-disable-next-line react/display-name */
      getValue: ({ rewards }) => <LiskAmount val={rewards} token={tokenMap.LSK.key} />,
      className: grid['col-xs-2'],
    },
    productivity: {
      header: <React.Fragment>
        {t('Productivity')}
        &nbsp;
        <Tooltip className="showOnLeft">
          <p>{t('Percentage of successfully forged blocks of when the delegate should have forged a block of transactions.')}</p>
        </Tooltip>
      </React.Fragment>,
      getValue: ({ productivity }) => `${formatAmountBasedOnLocale({ value: productivity })} %`,
      className: grid['col-xs-1'],
    },
  };
  columns = columns.map(c => ({ ...columnDefaults[c.id], ...c }));

  const handleLoadMore = () => {
    delegates.loadData({ offset: delegates.data.length });
  };

  const handleFilter = ({ target: { value } }) => {
    applyFilters({
      ...filters,
      search: value,
    });
  };

  return (
    <Box main isLoading={delegates.isLoading}>
      <Box.Header>
        <Box.Tabs {...tabs} />
        <span>
          <Input
            onChange={handleFilter}
            value={filters.search}
            className="filter-by-name"
            size="xs"
            placeholder={t('Filter by name...')}
          />
        </span>
      </Box.Header>
      <Box.Content className={styles.content}>
        {delegates.data.length || delegates.isLoading
          ? <Table {...{ columns, data, rowClassName: 'delegate-row' }} />
          : (
            <Box.EmptyState>
              <Illustration name="emptyWallet" />
              <h3>{`${delegates.error || t('No delegates found.')}`}</h3>
            </Box.EmptyState>
          )
      }
      </Box.Content>
      {delegates.data.length >= votingConst.maxCountOfVotes && (
        <Box.FooterButton onClick={handleLoadMore} className="loadMore">
          {t('Load more')}
        </Box.FooterButton>
      )}
    </Box>
  );
};

export default withTranslation()(DelegatesTable);
