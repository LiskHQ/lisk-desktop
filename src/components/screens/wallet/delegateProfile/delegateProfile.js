import React, { useEffect } from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import { withTranslation } from 'react-i18next';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import { DateTimeFromTimestamp } from '../../../toolbox/timestamp';
import VoteWeight from '../../../shared/voteWeight';
import { formatAmountBasedOnLocale } from '../../../../utils/formattedNumber';
import { tokenMap } from '../../../../constants/tokens';
import LiskAmount from '../../../shared/liskAmount';
import styles from './delegateProfile.css';
import DetailsView from './detailsView';
import PerformanceView from './performanceView';
import DelegateVotesView from './delegateVotesView';

const votes = new Array(50).fill('6195226421328336181L');

const DelegateProfile = ({
  delegate, lastBlock, txDelegateRegister, address, nextForgers, t = str => str,
}) => {
  useEffect(() => {
    delegate.loadData();
    txDelegateRegister.loadData();
  }, [address]);

  // useEffect(() => {
  //   if (delegate.data.username) {
  //     lastBlock.loadData({
  //       generatorPublicKey: delegate.data.account.publicKey,
  //       limit: 1,
  //     });
  //   }
  // }, [delegate.data.username]);

  // const isActive = nextForgers.data.filter(item =>
  //   (item.username === delegate.data.username)).length;

  return (
    <section className={`${styles.ontainer} container`}>
      <Box className={`${grid.row} ${styles.statsContainer} stats-container`}>
        <DelegateVotesView votes={votes} />
        <DetailsView />
        <PerformanceView />
      </Box>
    </section>
  );
};
export default DelegateProfile;

// {
//   "address": "10016685355739180605L",
//   "publicKey": "c678d19210ebf71914652d6644da5ee42e0c80948c4b520dba9f3d4514b213b2",
//   "username": "genesis_31",
//   "isDelegate": true,
//   "nonce": "2",
//   "balance": "9125000000",
//   "votes": [
//       {
//           "amount": "1000000000000",
//           "delegateAddress": "10016685355739180605L"
//       }
//   ],
//   "unlocking": [],
//   "totalVotesReceived": "1000000000000",
//   "delegate": {
//       "isBanned": false,
//       "pomHeights": [],
//       "lastForgedHeight": 0,
//       "consecutiveMissedBlocks": 0,
//       "approval": 0
//   },
//   "asset": {},
//   "missedBlocks": 5,
//   "producedBlocks": 38,
//   "fees": "0",
//   "rewards": "0",
//   "productivity": 88.37,
//   "keys": {
//       "optionalKeys": [],
//       "mandatoryKeys": [],
//       "numberOfSignatures": 0
//   }
// }
