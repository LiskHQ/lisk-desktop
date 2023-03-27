import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import { selectSearchParamValue } from 'src/utils/searchParams';
import { selectNetwork } from 'src/redux/selectors';
import { extractAddressFromPublicKey, truncateAddress } from '@wallet/utils/account';
import WalletVisual from '@wallet/components/walletVisual';
import CopyToClipboard from 'src/modules/common/components/copyToClipboard';
import Box from 'src/theme/box';
import { useCurrentAccount } from '@account/hooks';
import BoxContent from 'src/theme/box/content';
import BoxInfoText from 'src/theme/box/infoText';
import Dialog from 'src/theme/dialog/dialog';
import Icon from 'src/theme/Icon';
import Tooltip from 'src/theme/Tooltip';
import defaultBackgroundImage from '@setup/react/assets/images/default-chain-background.png';
import Members from '../multisignatureMembers';

import styles from './styles.css';

const emptyKeys = {
  numberOfSignatures: 1,
  optionalKeys: [],
  mandatoryKeys: [],
};

const MultisigAccountDetails = ({ t, wallet, history }) => {
  const [currentAccount] = useCurrentAccount();
  const network = useSelector(selectNetwork);
  const queryAddress = selectSearchParamValue(history.location.search, 'address');
  const address = queryAddress || currentAccount.metadata.address;
  const { numberOfSignatures, optionalKeys, mandatoryKeys } = wallet.data.keys || emptyKeys;
  const groupPublicKey = wallet.data.publicKey || currentAccount.metadata.pubkey;

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

  useEffect(() => {
    wallet.loadData({ address });
  }, [network]);

  return (
    <Dialog hasClose className={`${grid.row} ${grid['center-xs']} ${styles.container}`}>
      <header className={styles.header}>
        <img src={defaultBackgroundImage} className={styles.bg} />
        <WalletVisual address={address} size={64} className={styles.avatar} />
      </header>
      <Box isLoading={false} className={styles.wrapper}>
        <BoxContent className={styles.mainContent}>
          <BoxInfoText className={styles.nameAndAddress}>
            <div className={styles.accountName}>
              <h3>{currentAccount.metadata.name}</h3>
              <Icon name="multisigKeys" />
            </div>
            <div className={styles.row}>
              <span className={styles.title}>{t('Address')}:</span>
              <CopyToClipboard
                value={address}
                className={styles.rowValue}
                text={truncateAddress(address)}
              />
            </div>
            <div className={styles.row}>
              <span className={styles.title}>{t('Public key')}:</span>
              <CopyToClipboard
                value={groupPublicKey}
                className={styles.rowValue}
                text={truncateAddress(groupPublicKey)}
              />
            </div>
          </BoxInfoText>
          <div className={styles.infoContainer}>
            <div className={styles.column}>
              <strong className={styles.sectionTitle}>{t('Multisignature details')}</strong>
              <span className={styles.sectionValue}>
                {t('This account is a multisignature account.')}
              </span>
            </div>
            <div className={styles.column}>
              <p>
                {t('Required signatures')}
                <Tooltip position="top left" indent>
                  <span>
                    {t(
                      'To provide a required signature, use the "Sign multisignature" tool in the sidebar."'
                    )}
                  </span>
                </Tooltip>
              </p>
              <span>{numberOfSignatures}</span>
            </div>
          </div>
          <Members members={members} t={t} size={40} className={styles.members} />
        </BoxContent>
      </Box>
    </Dialog>
  );
};

export default MultisigAccountDetails;
