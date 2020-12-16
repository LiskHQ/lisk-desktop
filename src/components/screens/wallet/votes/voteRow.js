import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import AccountVisual from '../../../toolbox/accountVisual';
import tableStyles from '../../../toolbox/table/table.css';
import LiskAmount from '../../../shared/liskAmount';
import styles from './votes.css';
import { formatAmountBasedOnLocale } from '../../../../utils/formattedNumber';
import { isEmpty } from '../../../../utils/helpers';
import { tokenMap } from '../../../../constants/tokens';
import DialogLink from '../../../toolbox/dialog/link';
import Spinner from '../../../toolbox/spinner';
import Icon from '../../../toolbox/icon';

const VoteRow = ({
  data, onRowClick, delegates,
}) => {
  const onClick = () => onRowClick(data.address);
  return (
    <div className={`${tableStyles.row} ${styles.row} vote-row`}>
      <div className={grid['col-sm-3']} onClick={onClick}>
        <div className={`${styles.info}`}>
          <AccountVisual
            className={`${styles.avatar}`}
            address={data.address}
            size={40}
          />
          <div className={styles.accountInfo}>
            <span className={`${styles.username} vote-username`}>{data.username}</span>
            <span className={`${styles.address} showOnLargeViewPort`}>{data.address}</span>
          </div>
        </div>
      </div>
      <div className={grid['col-sm-2']} onClick={onClick}>
        {!isEmpty(delegates)
          ? `${formatAmountBasedOnLocale({ value: delegates[data.address].productivity })}%`
          /* istanbul ignore next */
          : '-'
        }
      </div>
      <div className={grid['col-sm-2']} onClick={onClick}>
        <span>
          {
            /* istanbul ignore next */
            !isEmpty(delegates) ? `#${delegates[data.address].rank}` : '-'
          }
        </span>
      </div>
      <div className={`${grid['col-sm-2']} ${grid['col-lg-2']}`} onClick={onClick}>
        <span>
          <LiskAmount
            val={!isEmpty(delegates) ? delegates[data.address].delegateWeight : 0}
            token={tokenMap.LSK.key}
          />
        </span>
      </div>
      <div className={`${grid['col-sm-2']} ${grid['col-lg-2']} ${styles.flexRightAlign}`} onClick={onClick}>
        <span className={styles.votes}>
          <LiskAmount
            val={data.amount}
            token={tokenMap.LSK.key}
            showInt
            className={styles.voteAmount}
          />
        </span>
      </div>
      {
        data.pending
          ? <Spinner />
          : (
            <div className={grid['col-sm-1']}>
              <DialogLink
                className={styles.editVoteLink}
                component="editVote"
                data={{ address: data.address }}

              >
                <Icon name="edit" />
              </DialogLink>
            </div>
          )
      }
    </div>
  );
};

/* istanbul ignore next */
const areEqual = (prevProps, nextProps) => (prevProps.data.address === nextProps.data.address
    && prevProps.data.rewards === nextProps.data.rewards
    && prevProps.delegates === nextProps.delegates);

export default React.memo(VoteRow, areEqual);
