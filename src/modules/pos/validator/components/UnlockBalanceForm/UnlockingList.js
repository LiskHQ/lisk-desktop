import React from 'react';
import moment from 'moment';
import Icon from 'src/theme/Icon';
import TokenAmount from '@token/fungible/components/tokenAmount';
import usePosToken from '../../hooks/usePosToken';

const getUnlockText = (lockedPendingUnlock, t) => {
  const { expectedUnlockTime } = lockedPendingUnlock;

  const dateString = moment.unix(expectedUnlockTime);
  if (dateString.isBefore()) {
    return t('will be available to unlock once blocks has been certified');
  }
  return `${t('will be available to unlock in')} ${moment().to(dateString, true)}`;
};

const UnlockingListItem = ({ lockedPendingUnlock, t, token }) => (
  <li className="unlocking-balance">
    <p>
      <TokenAmount val={lockedPendingUnlock.amount} token={token} />
    </p>
    <p>
      <Icon name="loading" />
      {getUnlockText(lockedPendingUnlock, t)}
    </p>
  </li>
);

/**
 * displays a list of stake amounts that can be unlocked sometime in the future
 */
const UnlockingList = ({ lockedPendingUnlocks, t }) => {
  const { token } = usePosToken();

  return lockedPendingUnlocks
    .sort((unstakeA, unstakeB) => unstakeB.unstakeHeight - unstakeA.unstakeHeight)
    .map((lockedPendingUnlock, i) => (
      <UnlockingListItem
        key={`${i}-unlocking-balance-list`}
        lockedPendingUnlock={lockedPendingUnlock}
        token={token}
        t={t}
      />
    ));
};

export default UnlockingList;
