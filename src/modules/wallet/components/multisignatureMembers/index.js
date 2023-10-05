import React from 'react';
import Tooltip from '@theme/Tooltip/tooltip';
import WalletVisual from '../walletVisual';
import { truncateAddress } from '../../utils/account';
import styles from './styles.css';
import classNames from 'classnames';

const Member = ({ member, i, t, size }) => (
  <div className={`${styles.memberInfo} member-info`} data-testid="member-info">
    {i !== undefined && <p className={styles.memberInfoIndex}>{`${i + 1}.`}</p>}
    <WalletVisual address={member.address} size={size} />
    <div className={styles.memberDetails}>
      <p className={`${styles.memberTitle} member-title`}>
        {member.name || truncateAddress(member.address)}
        <span>{`(${member.mandatory ? t('Mandatory') : t('Optional')})`}</span>
      </p>
      <p className={styles.memberKey}>{truncateAddress(member.publicKey)}</p>
    </div>
  </div>
);

const Members = ({
  members,
  numberOfSignatures,
  t,
  className,
  size,
  showSignatureCount = false,
}) => {
  const sliceIndex = Math.round(members.length / 2);
  const leftColumn = members.slice(0, sliceIndex);
  const rightColumn = members.slice(sliceIndex, members.length);
  return (
    <div className={`${styles.membersContainer} ${className}`}>
      <div className={styles.label}>
        <p>{t('Members')}:</p>
        {showSignatureCount && !!numberOfSignatures && (
          <p className={styles.signatureInfo}>
            <span>{t('Required signatures')} </span>
            <Tooltip
              size="m"
              className={styles.tooltipWrapper}
              tooltipClassName={`${styles.tooltipContainer}`}
              position="left"
            >
              <p>
                {t(
                  'Number of signatures required to approve any outgoing transactions from this account.'
                )}
              </p>
            </Tooltip>
            <span>: {numberOfSignatures}</span>
          </p>
        )}
      </div>
      <div>
        {leftColumn.map((member, i) => (
          <Member
            member={member}
            i={i}
            key={`registerMultiSignature-members-list-${i}`}
            t={t}
            size={size}
          />
        ))}
      </div>
      <div>
        {rightColumn.map((member, i) => (
          <Member
            member={member}
            i={i + sliceIndex}
            key={`registerMultiSignature-members-list-${i + sliceIndex}`}
            t={t}
            size={size}
          />
        ))}
      </div>
    </div>
  );
};

export const SignedAndRemainingMembers = ({
  signed,
  remaining,
  needed,
  required,
  className,
  t,
}) => (
  <div className={classNames(styles.wrapper, className)}>
    <p>Transaction root signatures</p>
    <div className={`${styles.membersContainer}`}>
      <div>
        <p className={styles.label}>{t('Signed')}</p>
        {signed.map((member, i) => (
          <Member member={member} key={`registerMultiSignature-members-list-${i}`} t={t} />
        ))}
      </div>
      <div>
        <p className={styles.label}>
          <span>{t('Remaining')}</span>
          <span className="tx-remaining-members">{` ${needed}/${required}`}</span>
        </p>
        {remaining.map((member, i) => (
          <Member
            member={member}
            key={`registerMultiSignature-members-list-${i}-remaining`}
            t={t}
          />
        ))}
      </div>
    </div>
  </div>
);

export default Members;
