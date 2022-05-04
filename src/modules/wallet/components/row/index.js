import React from 'react';
// import { BigNumber } from 'bignumber.js';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import routes from '@screens/router/routes';
import { tokenMap } from '@token/fungible/consts/tokens';
// import { formatAmountBasedOnLocale } from '@common/utilities/formattedNumber';
import LiskAmount from '@shared/liskAmount';
import WalletVisualWithAddress from '../walletVisualWithAddress';
import styles from './wallet.css';

const getOwnerName = (account) => {
  const delegateUsername = account.summary?.username ? account.summary?.username : '';
  const text = account.knowledge
    && account.knowledge.owner && account.knowledge.description
    ? `${account.knowledge.owner} ${account.knowledge.description}`
    : delegateUsername;
  return text;
};

// const BalanceShare = ({ balance, supply }) => {
//   const share = new BigNumber((balance / supply) * 100);
//   return (
//     <span className={styles.balanceShare}>
//       {
//         `${formatAmountBasedOnLocale({ value: share.toFormat(2) })} %`
//       }
//     </span>
//   );
// };

const AccountRow = ({ data, className }) => (
  <Link
    className={`${grid.row} ${className} accounts-row`}
    to={`${routes.explorer.path}?address=${data.summary?.address}`}
  >
    <span className={`${grid['col-xs-1']} ${grid['col-md-1']} ${styles.counter}`}>
      {data.rank}
    </span>
    <span className={`${grid['col-xs-3']} ${grid['col-md-5']}`}>
      <WalletVisualWithAddress
        address={data.summary?.address}
        transactionSubject="address"
        showBookmarkedAddress
      />
    </span>
    <span className={`${grid['col-xs-3']} ${grid['col-md-3']}`}>
      <LiskAmount val={data.token?.balance} showInt token={tokenMap.LSK.key} />
    </span>
    {/* <span className={`${grid['col-xs-2']} ${grid['col-md-1']}`}>
      <BalanceShare balance={data.token?.balance} supply={supply} />
    </span> */}
    <span className={`${grid['col-xs-5']} ${grid['col-md-3']}`}>
      {getOwnerName(data)}
    </span>
  </Link>
);

/* istanbul ignore next */
const areEqual = (prevProps, nextProps) => (prevProps.data.id === nextProps.data.id);

export default React.memo(AccountRow, areEqual);
