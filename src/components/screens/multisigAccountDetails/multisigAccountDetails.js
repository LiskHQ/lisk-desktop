import React, { useMemo } from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import { extractAddressFromPublicKey } from '@utils/account';
import Box from '@toolbox/box';
import BoxHeader from '@toolbox/box/header';
import BoxContent from '@toolbox/box/content';
import BoxInfoText from '@toolbox/box/infoText';
import Dialog from '@toolbox/dialog/dialog';
import Tooltip from '@toolbox/tooltip/tooltip';
import Members from '@shared/multisignatureMembers';

import styles from './styles.css';

const MultisigAccountDetails = ({ t, account }) => {
  if (Object.keys(account).length === 0) {
    return null;
  }
  const { numberOfSignatures, optionalKeys, mandatoryKeys } = account.keys;

  const members = useMemo(() => (
    optionalKeys.map(publicKey => ({
      address: extractAddressFromPublicKey(publicKey),
      publicKey,
      mandatory: false,
    })).concat(
      mandatoryKeys.map(publicKey => ({
        address: extractAddressFromPublicKey(publicKey),
        publicKey,
        mandatory: true,
      })),
    )), [account.address]);

  return (
    <Dialog hasClose className={`${grid.row} ${grid['center-xs']} ${styles.container}`}>
      <Box isLoading={false} className={styles.wrapper}>
        <BoxHeader>
          <h1>{t('Multisignature account details')}</h1>
        </BoxHeader>
        <BoxContent className={styles.mainContent}>
          <BoxInfoText>
            <span>{t('This is a multisignature account that is controlled by a group of accounts.')}</span>
            <span><br /></span>
            <span>{t('This account requires {{numberOfSignatures}} signatures to create a valid transaction.', { numberOfSignatures })}</span>
          </BoxInfoText>
          <Members members={members} t={t} />
          <div className={styles.infoContainer}>
            <p>
              {t('Required signatures')}
              <Tooltip
                position="top right"
                indent
              >
                <p>{t('To provide a required signature, use the "Sign multisignature" tool in the sidebar."')}</p>
              </Tooltip>
            </p>
            <span>{numberOfSignatures}</span>
          </div>
        </BoxContent>
      </Box>
    </Dialog>
  );
};

export default MultisigAccountDetails;
