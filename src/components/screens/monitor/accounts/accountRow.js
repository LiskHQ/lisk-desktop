import React from 'react';
import { BigNumber } from 'bignumber.js';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { tokenMap } from '../../../../constants/tokens';
import LiskAmount from '../../../shared/liskAmount';
import routes from '../../../../constants/routes';
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

const AccountRow = ({ data, className, supply }) => (
  <Link
    className={`${grid.row} ${className} accounts-row`}
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
);

/* istanbul ignore next */
const areEqual = (prevProps, nextProps) => (prevProps.data.id === nextProps.data.id);

export default React.memo(AccountRow, areEqual);
