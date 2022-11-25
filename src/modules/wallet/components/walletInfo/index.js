import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import Icon from 'src/theme/Icon';
import DropdownButton from 'src/theme/DropdownButton';
import { TertiaryButton } from 'src/theme/buttons';
import AccountMenuListing from '@account/components/AccountMenuListing/AccountMenuListing';
import styles from './walletInfo.css';
import WalletVisual from '../walletVisual';
import Identity from './identity';
import ActionBar from './actionBar';

const WalletInfo = ({
  address,
  activeToken,
  hwInfo,
  account,
  username,
  bookmark,
  isMultisignature,
  host,
}) => {
  const [showFullAddress, setShowFullAddress] = useState(false);
  const onClick = () => setShowFullAddress(!showFullAddress);
  const { t } = useTranslation();

  return (
    <Box className={styles.wrapper}>
      <BoxContent className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t('Account details')}</h2>
          <DropdownButton
            className={styles.dropDownMenu}
            buttonClassName={styles.dropDownMenuButton}
            ButtonComponent={TertiaryButton}
            buttonLabel={<Icon className="button-icon" name="verticalDots" />}
            size="m"
          >
            <AccountMenuListing className={styles.dropDownMenuList} />
          </DropdownButton>
        </div>

        <div className={`${styles.info} ${showFullAddress ? styles.showFullAddress : ''}`}>
          <WalletVisual address={address} size={40} />
          {address ? (
            <Identity
              newAddress={address}
              legacyAddress={account.summary.legacyAddress}
              username={username}
              bookmark={bookmark}
              showLegacy={showFullAddress}
              setShowLegacy={onClick}
            />
          ) : null}
        </div>
        <ActionBar
          address={address}
          host={host}
          activeToken={activeToken}
          username={username}
          account={account}
          bookmark={bookmark}
          hwInfo={hwInfo}
          isMultisignature={isMultisignature}
          t={t}
        />
      </BoxContent>
    </Box>
  );
};

export default WalletInfo;
