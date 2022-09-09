import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Link } from 'react-router-dom';
import WalletVisual from '@wallet/components/walletVisual';
import TokenAmount from '@token/fungible/components/tokenAmount';
import { regex } from 'src/const/regex';
import routes from 'src/routes/routes';
import { tokenMap } from '@token/fungible/consts/tokens';
import styles from './multiSignature.css';

const GroupRow = ({ data, className }) => {
  const { address, name, key, balance } = data;

  return (
    <Link
      to={`${routes.explorer.path}?address=${address}`}
      className={`${grid.row} ${className} ${styles.transactionRow} multisign-group-row`}
    >
      <span className={grid['col-xs-8']}>
        <WalletVisual address={address} className={styles.avatar} />
        <div className={styles.signDetails}>
          <p className={styles.addressTitle}>
            {name || address.replace(regex.lskAddressTrunk, '$1...$3')}
          </p>
          {key && <p className={styles.key}>{key.replace(regex.lskAddressTrunk, '$1...$3')}</p>}
        </div>
      </span>
      <span className={grid['col-xs-4']}>
        <span className={styles.groupBalance}>
          <TokenAmount val={balance} showRounded token={tokenMap.LSK.key} />
        </span>
      </span>
    </Link>
  );
};

export default GroupRow;
