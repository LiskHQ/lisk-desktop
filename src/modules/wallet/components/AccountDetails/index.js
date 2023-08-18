import React, { useMemo } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import { selectSearchParamValue } from 'src/utils/searchParams';
import { extractAddressFromPublicKey, truncateAddress } from '@wallet/utils/account';
import WalletVisual from '@wallet/components/walletVisual';
import CopyToClipboard from 'src/modules/common/components/copyToClipboard';
import Box from 'src/theme/box';
import { useCurrentAccount } from '@account/hooks';
import BoxContent from 'src/theme/box/content';
import BoxInfoText from 'src/theme/box/infoText';
import Dialog from 'src/theme/dialog/dialog';
import Icon from 'src/theme/Icon';
import routes from 'src/routes/routes';
import defaultBackgroundImage from '@setup/react/assets/images/default-chain-background.png';
import { useAuth } from '@auth/hooks/queries';

import Members from '../multisignatureMembers';
import styles from './AccountDetails.css';

const emptyKeys = {
  numberOfSignatures: 1,
  optionalKeys: [],
  mandatoryKeys: [],
};

// eslint-disable-next-line max-statements
const AccountDetails = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const [currentAccount] = useCurrentAccount();
  const queryAddress = selectSearchParamValue(history.location.search, 'address');
  const address = queryAddress || currentAccount.metadata?.address;
  const { data: authData } = useAuth({
    config: { params: { address } },
  });
  const accountName = currentAccount.metadata?.name;
  const appendAccountName = `-${accountName}`;
  const fileName = `${address}${accountName ? appendAccountName : ''}-lisk-account`;
  const truncatedFilename = `${truncateAddress(fileName)}.json`;
  const { numberOfSignatures, optionalKeys, mandatoryKeys, nonce } = authData?.data || emptyKeys;

  const members = useMemo(
    () =>
      optionalKeys
        .map((publicKey) => ({
          address: extractAddressFromPublicKey(publicKey),
          publicKey,
          mandatory: false,
        }))
        .concat(
          mandatoryKeys.map((publicKey) => ({
            address: extractAddressFromPublicKey(publicKey),
            publicKey,
            mandatory: true,
          }))
        ),
    [numberOfSignatures, optionalKeys, mandatoryKeys]
  );

  return (
    <Dialog hasClose className={`${grid.row} ${grid['center-xs']} ${styles.container}`}>
      <header className={styles.header}>
        <img src={defaultBackgroundImage} className={styles.bg} />
        <h3>{t('Account details')}</h3>
        <WalletVisual address={address} size={64} className={styles.avatar} />
      </header>
      <Box isLoading={false} className={styles.wrapper}>
        <BoxContent className={styles.mainContent}>
          <BoxInfoText className={styles.infoHeader}>
            <div className={styles.accountName}>
              <h3>{currentAccount.metadata?.name}</h3>
              <Icon name="multisigKeys" />
              <Icon name="edit" />
            </div>
            <div className={styles.infoRow}>
              <span className={styles.title}>{t('Backup account')}: </span>
              <Icon name="filePlain" />
              {truncatedFilename}
              <Icon name="downloadBlue" />
            </div>
          </BoxInfoText>
          <div className={styles.infoContainer}>
            <div>
              <div className={styles.row}>
                <span className={styles.title}>{t('Address')}:</span>
                <CopyToClipboard
                  value={address}
                  className={styles.rowValue}
                  text={truncateAddress(address)}
                />
              </div>
              <div className={styles.row}>
                <span className={styles.title}>{t('Public Key')}:</span>
                <CopyToClipboard
                  value={authData?.meta.publicKey}
                  className={styles.rowValue}
                  text={truncateAddress(authData?.meta.publicKey)}
                />
              </div>
            </div>
            <div>
              <div className={styles.row}>
                <span className={styles.title}>{t('Nonce')}: </span>
                <span>{nonce}</span>
              </div>
            </div>
          </div>
          <div className={styles.infoContainer}>
            <div>
              <div className={`${styles.header} ${styles.sectionHeader}`}>
                <span>{t('Validator details')}</span>
              </div>
              <div className={styles.row}>
                <div className={styles.detailsWrapper}>
                  <span className={styles.title}>{t('Name')}: lemi</span>
                </div>
              </div>
            </div>
            <div>
              <div className={`${styles.link} ${styles.sectionHeader}`}>
                <Link to={`${routes.validatorProfile.path}?address=${address}`}>
                  {t('View profile')}
                </Link>
              </div>
              <div className={styles.row}>
                <div className={styles.detailsWrapper}>
                  <span className={styles.title}>{t('Rank')}: #0</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.infoContainer}>
            <div className={styles.multisigDetailsWrapper}>
              <div className={`${styles.header} ${styles.sectionHeader}`}>
                <span>{t('Multisignature details')}</span>
              </div>
              <Members
                members={members}
                numberOfSignatures={numberOfSignatures}
                showSignatureCount
                t={t}
                size={40}
                className={styles.members}
              />
            </div>
          </div>
        </BoxContent>
      </Box>
    </Dialog>
  );
};

export default AccountDetails;
