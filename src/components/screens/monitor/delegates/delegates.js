import { withTranslation } from 'react-i18next';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import DelegatesTable from '../../../shared/delegatesTable';
import PageLayout from '../../../toolbox/pageLayout';

const AvatarWithAddress = ({ address }) => (
  <React.Fragment>
    {address}
  </React.Fragment>
);

const Delegates = ({
  delegates, t, filters, applyFilters,
}) => {
  const columns = [
    { id: 'rank' },
    {
      id: 'username',
      header: ('Name'),
      className: grid['col-xs-1'],
    },
    {
      id: 'address',
      header: t('Address'),
      getValue: AvatarWithAddress,
      className: grid['col-xs-2'],
    },
    { id: 'forged' },
    { id: 'productivity' },
  ];

  const tabs = {
    tabs: [
      {
        value: '/active',
        name: ('Active delegates'),
      }, {
        value: '/standby',
        name: ('Standby delegates'),
      },
    ],
    active: filters.tabs,
  };

  return (
    <PageLayout>
      <DelegatesTable {...{
        columns, delegates, tabs, filters, applyFilters,
      }}
      />
    </PageLayout>
  );
};

export default withTranslation()(Delegates);
