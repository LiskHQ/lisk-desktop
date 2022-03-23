import React from 'react';

import { tokenMap } from '@common/configuration';
import { toRawLsk } from '@token/utilities/lsk';
import { truncateAddress } from '@common/utilities/account';
import LiskAmount from '@shared/liskAmount';
import AccountVisual from '@basics/accountVisual';

import styles from './styles.css';

const getAccountRoleText = (accountRole, t) => {
  switch (accountRole) {
    case true:
      return t('Mandatory');
    case false:
      return t('Optional');
    // case 'owner':
    //   return t('Owner');
    /* istanbul ignore next */
    default:
      return t('Optional');
  }
};

const Member = ({ member, i, t }) => (
  <div className={`${styles.memberInfo} member-info`}>
    <p className={styles.memberInfoIndex}>{`${i + 1}.`}</p>
    <AccountVisual address={member.address} />
    <div className={styles.memberDetails}>
      <p className={styles.memberTitle}>
        {member.name || truncateAddress(member.address)}
        <span>{`(${getAccountRoleText(member.isMandatory, t)})`}</span>
      </p>
      {member.publicKey && (
        <p className={styles.memberKey}>
          {truncateAddress(member.publicKey)}
        </p>
      )}
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
        {leftColumn.map((member, i) =>
          <Member member={member} i={i} key={`registerMultiSignature-members-list-${i}`} t={t} />)}
      </div>
      <div>
        {rightColumn.map((member, i) =>
          <Member member={member} i={i + sliceIndex} key={`registerMultiSignature-members-list-${i + sliceIndex}`} t={t} />)}
      </div>
    </div>
  );
};

const InfoColumn = ({ title, children, className }) => (
  <div className={`${styles.infoColumn} ${className}`}>
    <span className={styles.infoTitle}>{title}</span>
    <span className={styles.infoValue}>
      {children}
    </span>
  </div>
);

const MultiSignatureReview = ({
  t,
  members,
  fee,
  numberOfSignatures,
}) => (
  <>
    <Members members={members} t={t} />
    <div className={styles.infoContainer}>
      <InfoColumn title={t('Required signatures')} className="info-requiredSignatures">
        {numberOfSignatures}
      </InfoColumn>
      <InfoColumn title={t('Transaction fee')} className="info-fee">
        <LiskAmount val={toRawLsk(fee)} token={tokenMap.LSK.key} />
      </InfoColumn>
    </div>
  </>
);

export default MultiSignatureReview;
