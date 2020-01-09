import React from 'react';
import { BigNumber } from 'bignumber.js';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { tokenMap } from '../../../../constants/tokens';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import LiskAmount from '../../../shared/liskAmount';
import withResizeValues from '../../../../utils/withResizeValues';
import routes from '../../../../constants/routes';
import Table from '../../../toolbox/list';
import AccountVisualWithAddress from '../../../shared/accountVisualWithAddress';
import { formatAmountBasedOnLocale } from '../../../../utils/formattedNumber';
import styles from './accountsTable.css';

const getOwnerName = (account) => {
  const delegateUsername = account.delegate ? account.delegate.username : '';
  const text = account.knowledge
    && account.knowledge.owner && account.knowledge.description
    ? `${account.knowledge.owner} ${account.knowledge.description}`
    : delegateUsername;
  return text;
};

const BalanceShare = ({ balance, supply }) => {
  const share = new BigNumber(balance / supply * 100);
  return (
    <span>
      {
        `${formatAmountBasedOnLocale({ value: share.toFormat(2) })} %`
      }
    </span>
  );
};

const AccountRow = React.memo(({ data, className, supply }) => (
  <Link
    key={data.id}
    className={`${grid.row} ${className}`}
    to={`${routes.accounts.path}/${data.address}`}
  >
    <span className={`${grid['col-xs-1']} ${grid['col-md-1']} ${styles.counter}`}>
      {data.rank}
    </span>
    <span className={`${grid['col-xs-3']} ${grid['col-md-5']}`}>
      <AccountVisualWithAddress
        address={data.address}
        transactionSubject="address"
        showBookmarkedAddress
      />
    </span>
    <span className={`${grid['col-xs-3']} ${grid['col-md-3']}`}>
      <LiskAmount val={data.balance} roundTo={0} token={tokenMap.LSK.key} />
    </span>
    <span className={`${grid['col-xs-2']} ${grid['col-md-1']}`}>
      <BalanceShare balance={data.balance} supply={supply} />
    </span>
    <span className={`${grid['col-xs-3']} ${grid['col-md-2']}`}>
      {getOwnerName(data)}
    </span>
  </Link>
));

const header = [
  {
    title: 'Rank',
    classList: `${grid['col-xs-1']} ${grid['col-md-1']}`,
  },
  {
    title: 'Address',
    classList: `${grid['col-xs-3']} ${grid['col-md-5']}`,
  },
  {
    title: 'Balance',
    classList: `${grid['col-xs-3']} ${grid['col-md-3']}`,
  },
  {
    title: 'Supply',
    classList: `${grid['col-xs-2']} ${grid['col-md-1']}`,
  },
  {
    title: 'Owner',
    classList: `${grid['col-xs-3']} ${grid['col-md-2']}`,
  },
];

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
