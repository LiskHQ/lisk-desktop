import { withTranslation } from 'react-i18next';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { DEFAULT_LIMIT } from '../../../../constants/monitor';
import { formatAmountBasedOnLocale } from '../../../../utils/formattedNumber';
import AccountVisualWithAddress from '../../../shared/accountVisualWithAddress';
import DelegatesTable from '../../../shared/delegatesTable';
import MonitorHeader from '../header';
import Tooltip from '../../../toolbox/tooltip/tooltip';
import routes from '../../../../constants/routes';

const Delegates = ({
  delegates, t, filters, applyFilters, changeSort, sort,
}) => {
  const columns = [
    {
      id: 'rank',
      isSortable: filters.tab === 'active',
    },
    {
      id: 'username',
      header: ('Name'),
      className: grid['col-xs-2'],
    },
    {
      id: 'address',
      header: t('Address'),
      /* eslint-disable-next-line react/display-name */
      getValue: ({ address }) => <AccountVisualWithAddress {...{ address, size: 36 }} />,
      className: [grid['col-xs-5'], grid['col-md-6']].join(' '),
    },
    {
      id: 'productivity',
      isSortable: filters.tab === 'active',
    },
    {
      id: 'approval',
      header: <React.Fragment>
        {t('Approval')}
        <Tooltip className="showOnLeft">
          <p>{t('Approval rate specifies the percentage of all votes received by a delegate.')}</p>
        </Tooltip>
      </React.Fragment>,
      getValue: ({ approval }) => `${formatAmountBasedOnLocale({ value: approval })} %`,
      className: grid['col-xs-2'],
    },
  ];

  const tabs = {
    tabs: [
      {
        value: 'active',
        name: ('Active delegates'),
        className: 'active',
      }, {
        value: 'standby',
        name: ('Standby delegates'),
        className: 'standby',
      },
    ],
    active: filters.tab,
    onClick: ({ value }) => applyFilters({ ...filters, tab: value }),
  };

  const canLoadMore = filters.tab === 'active'
    ? false
    : !!delegates.data.length && delegates.data.length % DEFAULT_LIMIT === 0;

  const getRowLink = delegate => `${routes.accounts.pathPrefix}${routes.accounts.path}/${delegate.address}`;

  return (
    <div>
      <MonitorHeader />
      <DelegatesTable {...{
        columns,
        delegates,
        tabs,
        filters,
        applyFilters,
        canLoadMore,
        getRowLink,
        onSortChange: changeSort,
        sort,
      }}
      />
    </div>
  );
};

export default withTranslation()(Delegates);
