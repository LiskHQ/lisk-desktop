import React from 'react';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import routes from 'src/routes/routes';
import TokenAmount from '@token/fungible/components/tokenAmount';
import WalletVisualWithAddress from '../walletVisualWithAddress';
import styles from './wallet.css';

const calculateSupply = (balance, totalSupply) => Number((balance * 100) / totalSupply).toFixed(2);

const WalletRow = ({ data, className, token, tokenSupply }) => (
  <Link
    className={`${grid.row} ${className} wallets-row`}
    data-testid="wallets-row"
    to={`${routes.explorer.path}?address=${data.address}`}
  >
    <span className={`${grid['col-xs-4']} ${grid['col-md-6']}`}>
      <WalletVisualWithAddress
        address={data.address}
        transactionSubject="address"
        showBookmarkedAddress
        detailsClassName={styles.walletSummary}
        truncate={false}
        accountName={data.name}
      />
    </span>
    <span className={`${grid['col-xs-3']} ${grid['col-md-2']}`}>
      <TokenAmount Wrapper={React.Fragment} val={data.balance} showInt token={token} />
    </span>
    <span className={`${grid['col-xs-1']} ${grid['col-md-1']}`}>
      {tokenSupply ? calculateSupply(data.balance, tokenSupply?.amount) : 0}%
    </span>
    <span className={`${grid['col-xs-4']} ${grid['col-md-3']}`}>
      {data.knowledge.description ? `${data.knowledge.owner} ${data.knowledge.description}` : '-'}
    </span>
  </Link>
);

/* istanbul ignore next */
const areEqual = (prevProps, nextProps) =>
  prevProps.tokenSupply?.tokenID === nextProps.tokenSupply?.tokenID &&
  prevProps.data?.address === nextProps.data?.address;

export default React.memo(WalletRow, areEqual);
