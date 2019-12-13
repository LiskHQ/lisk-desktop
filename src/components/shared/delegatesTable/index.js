import { withTranslation } from 'react-i18next';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Input } from '../../toolbox/inputs';
import { formatAmountBasedOnLocale } from '../../../utils/formattedNumber';
import { tokenMap } from '../../../constants/tokens';
import Box from '../../toolbox/box';
import BoxHeader from '../../toolbox/box/header';
import BoxContent from '../../toolbox/box/content';
import BoxFooterButton from '../../toolbox/box/footerButton';
import BoxEmptyState from '../../toolbox/box/emptyState';
import BoxTabs from '../../toolbox/tabs';
import Illustration from '../../toolbox/illustration';
import LiskAmount from '../liskAmount';
import Table from '../../toolbox/table';
import Tooltip from '../../toolbox/tooltip/tooltip';
import styles from './delegatesTable.css';

const DelegatesTable = ({
  columns, delegates, tabs, t, filters, applyFilters, canLoadMore, ...rest
}) => {
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
      headerTooltip: t('Percentage of successfully forged blocks in relation to all blocks (forged and missed).'),
      getValue: ({ productivity }) => `${formatAmountBasedOnLocale({ value: productivity })} %`,
      className: [grid['col-xs-2'], grid['col-md-2'], grid['col-lg-2']].join(' '),
    },
  };
  const columnsComponent = columns.map(column => ({
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
          <p className={styles.headerTooltip}>{headerTooltip}</p>
        </Tooltip>
      </React.Fragment>,
    })),
  }));

  const handleLoadMore = () => {
    delegates.loadData(Object.keys(filters).reduce((acc, key) => ({
      ...acc,
      ...(filters[key] && { [key]: filters[key] }),
    }), {
      offset: delegates.data.length,
    }));
  };

  const handleFilter = ({ target: { value } }) => {
    applyFilters({
      ...filters,
      search: value,
    });
  };

  return (
    <Box main isLoading={delegates.isLoading}>
      <BoxHeader className="delegates-table">
        {tabs.tabs.length === 1
          ? <h2>{tabs.tabs[0].name}</h2>
          : <BoxTabs {...tabs} />
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
      </BoxHeader>
      {delegates.data.length || delegates.isLoading
        ? (
          <BoxContent className={styles.content}>
            <Table {...{
              columns: columnsComponent,
              data: delegates.data,
              rowKey: 'username',
              rowClassName: 'delegate-row',
              ...rest,
            }}
            />
          </BoxContent>
        )
        : (
          <BoxContent>
            <BoxEmptyState>
              <Illustration name="emptyWallet" />
              <h3>{`${delegates.error || t('No delegates found.')}`}</h3>
            </BoxEmptyState>
          </BoxContent>
        )
      }
      {!!canLoadMore && !delegates.isLoading && (
        <BoxFooterButton onClick={handleLoadMore} className="loadMore">
          {t('Load more')}
        </BoxFooterButton>
      )}
    </Box>
  );
};

export default withTranslation()(DelegatesTable);
