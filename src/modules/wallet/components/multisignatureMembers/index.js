import React from 'react';

import WalletVisual from '../walletVisual';
import { truncateAddress } from '../../utils/account';

import styles from './styles.css';

const Member = ({ member, i, t, size }) => (
  <div className={`${styles.memberInfo} member-info`}>
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

const Members = ({ members, t, className, size }) => {
  const sliceIndex = Math.round(members.length / 2);
  const leftColumn = members.slice(0, sliceIndex);
  const rightColumn = members.slice(sliceIndex, members.length);
  return (
    <div className={`${styles.membersContainer} ${className}`}>
      <p className={styles.title}>{t('Members')}</p>
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
  <div className={`${styles.membersContainer} ${className}`}>
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
        <Member member={member} key={`registerMultiSignature-members-list-${i}-remaining`} t={t} />
      ))}
    </div>
  </div>
);

export default Members;
