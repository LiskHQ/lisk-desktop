import React from 'react';
import { truncateAddress } from '@wallet/utils/account';
import TokenAmount from '@token/fungible/components/tokenAmount';
import { useTokensBalance } from '@token/fungible/hooks/queries';
import WalletVisual from '@wallet/components/walletVisual';
import styles from './MultiSignatureReview.css';

const getAccountRoleText = (accountRole, t) => {
  if (accountRole) {
    return t('Mandatory');
  }
  return t('Optional');
};

const Member = ({ member, i, t }) => (
  <div className={`${styles.memberInfo} member-info`}>
    <p className={styles.memberInfoIndex}>{`${i + 1}.`}</p>
    <WalletVisual address={member.address} />
    <div className={styles.memberDetails}>
      <p className={styles.memberTitle}>
        {member.name || truncateAddress(member.address)}
        <span>{`(${getAccountRoleText(member.isMandatory, t)})`}</span>
      </p>
      {member.publicKey && <p className={styles.memberKey}>{truncateAddress(member.publicKey)}</p>}
    </div>
  </div>
);

const Members = ({ members = [], t }) => {
  const sliceIndex = Math.round(members.length / 2);
  const leftColumn = members.slice(0, sliceIndex);
  const rightColumn = members.slice(sliceIndex, members.length);
  return (
    <div className={styles.membersContainer}>
      <p>{t('Members')}</p>
      <div>
        {leftColumn.map((member, i) => (
          <Member member={member} i={i} key={`registerMultiSignature-members-list-${i}`} t={t} />
        ))}
      </div>
      <div>
        {rightColumn.map((member, i) => (
          <Member
            member={member}
            i={i + sliceIndex}
            key={`registerMultiSignature-members-list-${i + sliceIndex}`}
            t={t}
          />
        ))}
      </div>
    </div>
  );
};

const InfoColumn = ({ title, children, className }) => (
  <div className={`${styles.infoColumn} ${className}`}>
    <span className={styles.infoTitle}>{title}</span>
    <span className={styles.infoValue}>{children}</span>
  </div>
);

const MultiSignatureReview = ({ t, members, fee, numberOfSignatures }) => {
  const { data: tokens } = useTokensBalance();
  const token = tokens?.data?.[0] || {};

  return (
    <>
      <Members members={members} t={t} />
      <div className={styles.infoContainer}>
        <InfoColumn title={t('Required signatures')} className="info-numberOfSignatures">
          {numberOfSignatures}
        </InfoColumn>
        <InfoColumn title={t('Fees')} className="info-fee">
          <TokenAmount val={fee} token={token} />
        </InfoColumn>
      </div>
    </>
  );
};

export default MultiSignatureReview;
