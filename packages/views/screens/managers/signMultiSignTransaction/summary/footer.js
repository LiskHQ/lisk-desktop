import React from 'react';
import { signatureCollectionStatus } from '@common/configuration';
import { useTheme } from '@common/utilities/theme';
import { removeSearchParamsFromUrl } from '@common/utilities/searchParams';
import { PrimaryButton, SecondaryButton } from '@basics/buttons';
import BoxFooter from '@basics/box/footer';
import styles from '../styles.css';

export const ActionBar = ({
  nextButton,
  history,
  t,
}) => (
  <BoxFooter
    direction="horizontal"
    className={styles.footer}
  >
    <SecondaryButton
      className={`${useTheme() === 'dark' && 'dark'} reject`}
      size="l"
      onClick={() => removeSearchParamsFromUrl(history, ['modal'])}
    >
      {t('Reject')}
    </SecondaryButton>
    <PrimaryButton className="sign" size="l" onClick={nextButton.onClick}>
      {nextButton.title}
    </PrimaryButton>
  </BoxFooter>
);

export const Feedback = ({
  t, isMember, signatureStatus,
}) => {
  let feedback;
  const statusMessages = {
    fullySigned: t('Transaction is already fully signed.'),
    occupiedByOptionals: t('Your signature will replace one optional signature.'),
  };
  if (!isMember) {
    feedback = t('Only members of the group can sign the transaction.');
  } else {
    feedback = statusMessages[signatureStatus];
  }

  return (
    <BoxFooter
      direction="horizontal"
      className={styles.footer}
    >
      <div className={`${styles.feedback} ${signatureStatus === signatureCollectionStatus.occupiedByOptionals ? styles.warning : styles.error} feedback`}>
        <span>{feedback}</span>
      </div>
    </BoxFooter>
  );
};
