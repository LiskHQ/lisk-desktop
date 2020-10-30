import React from 'react';

import grid from 'flexboxgrid/dist/flexboxgrid.css';

import Box from '../../toolbox/box';
import BoxHeader from '../../toolbox/box/header';
import BoxContent from '../../toolbox/box/content';
import BoxInfoText from '../../toolbox/box/infoText';
import Dialog from '../../toolbox/dialog/dialog';
import Tooltip from '../../toolbox/tooltip/tooltip';
import Members from '../../shared/multisignatureMembers';
import { extractAddress } from '../../../utils/account';
import styles from './styles.css';

const MultisigAccountDetails = ({ t, account }) => {
  // @todo We shouldn't be needing this if we lazyload the routes.
  if (!account.keys || account.keys.numberOfSignatures === 0) return null;

  const { numberOfSignatures, optionalKeys, mandatoryKeys } = account.keys;

  const members = optionalKeys.map(publicKey => ({
    address: extractAddress(publicKey),
    publicKey,
    mandatory: false,
  })).concat(
    mandatoryKeys.map(publicKey => ({
      address: extractAddress(publicKey),
      publicKey,
      mandatory: true,
    })),
  );

  return (
    <Dialog hasClose className={`${grid.row} ${grid['center-xs']} ${styles.container}`}>
      <Box isLoading={false} className={styles.wrapper}>
        <BoxHeader>
          <h1>{t('Multisignature account details')}</h1>
        </BoxHeader>
        <BoxContent className={styles.mainContent}>
          <BoxInfoText>
            <span>{t('This is a multisignature account, which allows a group of members to control shared LSK.')}</span>
            <span><br /></span>
            <span>{t('This account requires {{numberOfSignatures}} signatures to create a transaction.', { numberOfSignatures })}</span>
          </BoxInfoText>
          <Members members={members} t={t} />
          <div className={styles.infoContainer}>
            <p>
              {t('Required Signatures')}
              <Tooltip position="top right">
                <p>{t('Use the "Sign Multisignature" panel from the sidebar to sign transactions."')}</p>
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
