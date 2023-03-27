import React from 'react';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import routes from 'src/routes/routes';
import TokenAmount from '@token/fungible/components/tokenAmount';
import WalletVisualWithAddress from '../walletVisualWithAddress';
import styles from './wallet.css';

const AccountRow = ({ data, className, token }) => (
  <Link
    className={`${grid.row} ${className} accounts-row`}
    data-testid="accounts-row"
    to={`${routes.explorer.path}?address=${data.address}`}
  >
    <span className={`${grid['col-xs-1']} ${grid['col-md-1']} ${styles.counter}`}>{data.rank}</span>
    <span className={`${grid['col-xs-3']} ${grid['col-md-5']}`}>
      <WalletVisualWithAddress
        address={data.address}
        transactionSubject="address"
        showBookmarkedAddress
      />
    </span>
    <span className={`${grid['col-xs-3']} ${grid['col-md-3']}`}>
      <TokenAmount Wrapper={React.Fragment} val={data.balance} showInt token={token} />
    </span>
    <span className={`${grid['col-xs-5']} ${grid['col-md-3']}`}>
      {data.description ? `${data.owner} ${data.description}` : data.owner}
    </span>
  </Link>
);

/* istanbul ignore next */
const areEqual = (prevProps, nextProps) => prevProps.data.id === nextProps.data.id;

export default React.memo(AccountRow, areEqual);
