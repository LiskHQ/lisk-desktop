import React from 'react';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import withResizeValues from '../../../../utils/withResizeValues';
import Table from '../../../toolbox/list';
import styles from './accountsTable.css';
import header from './tableHeader';
import AccountRow from './accountRow';

const AccountsTable = ({
  accounts,
  networkStatus,
  title,
}) => {
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
          row={props => <AccountRow {...props} supply={supply} />}
          loadData={handleLoadMore}
          header={header}
        />
      </BoxContent>
    </Box>
  );
};

AccountsTable.defaultProps = {
  title: '',
};

export default withResizeValues(AccountsTable);
