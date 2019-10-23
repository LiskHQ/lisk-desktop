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

const DelegatesTable = ({
  columns, delegates, tabs, t, filters, applyFilters, canLoadMore, ...rest
}) => {
  const data = delegates.data.map(d => ({ ...d, id: d.username }));

  const columnDefaults = {
    rank: {
      header: t('Rank'),
      getValue: ({ rank }) => `#${rank}`,
      className: grid['col-xs-1'],
    },
    rewards: {
      header: t('Forged'),
      headerTooltip: t('Total amount of LSK forged by a delegate.'),
      /* eslint-disable-next-line react/display-name */
      getValue: ({ rewards }) => <LiskAmount val={rewards} token={tokenMap.LSK.key} />,
      className: grid['col-xs-2'],
    },
    productivity: {
      header: t('Productivity'),
      headerTooltip: t('Productivity rate specifies how many blocks were successfully forged by a delegate.'),
      getValue: ({ productivity }) => `${formatAmountBasedOnLocale({ value: productivity })} %`,
      className: [grid['col-xs-2'], grid['col-md-1']].join(' '),
    },
  };
  columns = columns.map(column => ({
    ...columnDefaults[column.id],
    ...column,
  })).map(({ headerTooltip, ...column }, i) => ({
    ...column,
    ...(headerTooltip && ({
      header: <React.Fragment>
        {column.header}
        &nbsp;
        <Tooltip
          title={column.header}
          size="s"
          className={i === columns.length - 1 ? 'showOnLeft' : 'showOnBottom'}
          styles={{ infoIcon: styles.infoIcon }}
        >
          <p>{headerTooltip}</p>
        </Tooltip>
      </React.Fragment>,
    })),
  }));

  const handleLoadMore = () => {
    delegates.loadData({ offset: delegates.data.length, ...filters });
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
        {tabs.tabs.length === 1
          ? <h2>{tabs.tabs[0].name}</h2>
          : <Box.Tabs {...tabs} />
        }
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
          ? (
            <Table {...{
              columns, data, rowClassName: 'delegate-row', ...rest,
            }}
            />
          )
          : (
            <Box.EmptyState>
              <Illustration name="emptyWallet" />
              <h3>{`${delegates.error || t('No delegates found.')}`}</h3>
            </Box.EmptyState>
          )
      }
      </Box.Content>
      {!!canLoadMore && !delegates.isLoading && (
        <Box.FooterButton onClick={handleLoadMore} className="loadMore">
          {t('Load more')}
        </Box.FooterButton>
      )}
    </Box>
  );
};

export default withTranslation()(DelegatesTable);
