import React from 'react';
import { withTranslation } from 'react-i18next';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import withResizeValues from '../../../../utils/withResizeValues';
import Table from '../../../toolbox/table';
import styles from './accountsTable.css';
import header from './tableHeader';
import AccountRow from './accountRow';

const AccountsTable = ({
  accounts,
  networkStatus,
  title,
  t,
}) => {
  /* istanbul ignore next */
  const handleLoadMore = () => {
    accounts.loadData({ offset: accounts.data.length });
  };
  const supply = networkStatus.data.supply;

  return (
    <Box main isLoading={accounts.isLoading} className="accounts-box">
      <BoxHeader>
        <h1>{title}</h1>
      </BoxHeader>
      <BoxContent className={styles.content}>
        <Table
          data={accounts.data}
          isLoading={accounts.isLoading}
          row={AccountRow}
          loadData={handleLoadMore}
          header={header(t)}
          additionalRowProps={{ supply }}
          error={accounts.error}
          canLoadMore
        />
      </BoxContent>
    </Box>
  );
};

AccountsTable.defaultProps = {
  title: '',
};

export default withTranslation()(withResizeValues(AccountsTable));
