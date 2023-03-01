import React from 'react';
import { useSelector } from 'react-redux';
import usePosToken from '@pos/validator/hooks/usePosToken';

import { tokenMap } from '@token/fungible/consts/tokens';
import { convertFromRawDenom } from '@token/fungible/utils/lsk';
import DialogLink from 'src/theme/dialog/link';
import {
  calculateBalanceLockedInUnstakes,
  calculateBalanceLockedInStakes,
} from '@wallet/utils/account';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import Icon from 'src/theme/Icon';
import styles from './BalanceInfo.css';

const Link = ({ sum, style, icon, isWalletRoute }) => {
  const { token } = usePosToken();

  return isWalletRoute ? (
    <DialogLink
      className={`${styles.lockedBalance} ${styles.pointer} ${style} open-unlock-balance-dialog unlock-amount-value`}
      component="lockedBalance"
    >
      <Icon name={icon || 'lock'} />
      {`${convertFromRawDenom(sum, token)} ${tokenMap.LSK.key}`}
      <Icon name="arrowRightCircle" />
    </DialogLink>
  ) : (
    <div className={`${styles.lockedBalance} ${styles.pointer} ${style}`}>
      <Icon name={icon || 'lock'} />
      {`${convertFromRawDenom(sum, token)} ${tokenMap.LSK.key}`}
    </div>
  );
};

// eslint-disable-next-line max-statements
const LockedBalanceLink = ({ account, isWalletRoute, style, icon }) => {
  const host = useSelector((state) => selectActiveTokenAccount(state));
  let lockedInStakes = 0;

  if (isWalletRoute && host) {
    lockedInStakes = useSelector((state) => calculateBalanceLockedInStakes(state.staking));
  } else {
    lockedInStakes = calculateBalanceLockedInUnstakes(account.pos?.sentStakes);
  }

  const lockedInUnstakes =
    isWalletRoute && host
      ? calculateBalanceLockedInUnstakes(host.pos?.unlocking)
      : calculateBalanceLockedInUnstakes(account.pos?.unlocking);

  if (lockedInUnstakes + lockedInStakes > 0) {
    return (
      <Link
        sum={lockedInUnstakes + lockedInStakes}
        style={style}
        icon={icon}
        isWalletRoute={isWalletRoute}
      />
    );
  }
  return null;
};

export default LockedBalanceLink;
