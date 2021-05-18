import React from 'react';

import { tokenMap, regex } from '@constants';
import LiskAmount from '../liskAmount';
import AccountVisual from '../../toolbox/accountVisual';

import styles from './styles.css';

const getAccountRoleText = (accountRole, t) => {
  switch (accountRole) {
    case 'mandatory':
      return t('Mandatory');
    case 'optional':
      return t('Optional');
    case 'owner':
      return t('Owner');
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
        {member.name || member.address.replace(regex.lskAddressTrunk, '$1...$3')}
        <span>{`(${getAccountRoleText(member.isMandatory, t)})`}</span>
      </p>
      {/* <p className={styles.memberKey}>{member.publicKey.replace(regex.publicKeyTrunk, '$1...$3')}</p> */}
    </div>
  </div>
);

const Members = ({ members = [], t }) => {
  const sliceIndex = Math.round(members.length / 2);
  const leftColumn = members.slice(0, sliceIndex);
  const rightColumn = members.slice(sliceIndex, members.length);
  console.log(members);
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
      <InfoColumn title={t('Required Signatures')} className="info-requiredSignatures">
        {numberOfSignatures}
      </InfoColumn>
      <InfoColumn title={t('Transaction fee')} className="info-fee">
        <LiskAmount val={fee} token={tokenMap.LSK.key} />
      </InfoColumn>
    </div>
  </>
);

export default MultiSignatureReview;
