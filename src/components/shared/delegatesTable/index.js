import { withTranslation } from 'react-i18next';
import React from 'react';
import { Input } from '../../toolbox/inputs';
import Box from '../../toolbox/box';
import Table from '../../toolbox/table';

const DelegatesTable = ({
  columns, delegates, tabs, t,
}) => {
  const columnDefaults = {
  };
  columns = columns.map(c => ({ ...columnDefaults[c.id], ...c }));

  return (
    <Box>
      <Box.Header>
        <Box.Tabs {...{ tabs }} />
        <Input placeholder={t('Filter by name...')} />
      </Box.Header>
      <Box.Content>
        <Table {...{ columns, data: delegates.data }} />
      </Box.Content>
    </Box>
  );
};

export default withTranslation()(DelegatesTable);
