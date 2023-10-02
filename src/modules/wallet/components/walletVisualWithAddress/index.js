import React from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';

import {
  MODULE_COMMANDS_NAME_MAP,
  MODULE_COMMANDS_MAP,
} from '@transaction/configuration/moduleCommand';
import { truncateAddress, truncateTransactionID } from '@wallet/utils/account';
import { getModuleCommandTitle } from '@transaction/utils/moduleCommand';
import Icon from 'src/theme/Icon';
import Tooltip from 'src/theme/Tooltip';
import CopyToClipboard from 'src/modules/common/components/copyToClipboard';
import WalletVisual from '../walletVisual';
import styles from './walletVisualWithAddress.css';

const AccountName = ({ isMultisig, name }) => (
  <div className={styles.accountName}>
    <p className="accountName" data-testid={name}>
      {name}
    </p>
    {isMultisig && name && <Icon name="multisigKeys" />}
  </div>
);

const AccountAddress = ({
  address,
  truncate,
  copy,
  transformedAddress,
  truncatedAddress,
  name,
  isMultisig,
}) => (
  <div className={`${styles.address} accountAddress`}>
    <span data-testid={address}>{truncate ? truncatedAddress : transformedAddress}</span>
    {copy ? (
      <CopyToClipboard
        value={address}
        type="icon"
        copyClassName={styles.copyIcon}
        className={styles.copyIcon}
      />
    ) : null}
    {isMultisig && !name && <Icon name="multisigKeys" />}
  </div>
);

const WalletVisualWithAddress = ({
  bookmarks,
  showBookmarkedAddress,
  token,
  address,
  accountName,
  transactionSubject,
  moduleCommand,
  size,
  truncate,
  className,
  detailsClassName,
  copy,
  isMultisig,
  publicKey,
}) => {
  const { t } = useTranslation();

  const getTransformedAddress = (addressValue) => {
    if (showBookmarkedAddress) {
      const bookmarkedAddress = bookmarks[token.active].find(
        (element) => element.address === addressValue
      );
      if (bookmarkedAddress) return bookmarkedAddress.title;
    }

    return addressValue;
  };

  const title = getModuleCommandTitle()[moduleCommand];
  const transformedAddress = getTransformedAddress(address);
  const truncatedAddress =
    truncate === 'small' || truncate === 'medium'
      ? truncateAddress(transformedAddress, truncate)
      : truncateAddress(transformedAddress);

  return (
    <div className={`${styles.address} ${className}`}>
      {moduleCommand !== MODULE_COMMANDS_NAME_MAP.transfer && transactionSubject === 'recipient' ? (
        <>
          <Icon
            className={styles.txIcon}
            name={MODULE_COMMANDS_MAP[moduleCommand]?.icon ?? 'txDefault'}
          />
          <span className={styles.addressValue}>{title}</span>
        </>
      ) : (
        <Tooltip
          tooltipClassName={styles.pubkeyTooltip}
          position="left bottom"
          size="maxContent"
          isHidden={!publicKey}
          content={
            <div>
              <WalletVisual address={address} size={size} />
              <div className={`${styles.detailsWrapper} ${detailsClassName || ''}`}>
                <AccountName name={accountName} isMultisig={isMultisig} />
                <AccountAddress
                  address={address}
                  truncate={truncate}
                  copy={copy}
                  transformedAddress={transformedAddress}
                  truncatedAddress={truncatedAddress}
                  name={accountName}
                  isMultisig={isMultisig}
                />
              </div>
            </div>
          }
        >
          <div className={styles.pubkey}>
            <span>{t('Public key:')}</span>
            <span>{truncateTransactionID(publicKey)}</span>
            <CopyToClipboard
              value={publicKey}
              type="icon"
              copyClassName={styles.copyIcon}
              className={styles.copyIcon}
            />
          </div>
        </Tooltip>
      )}
    </div>
  );
};

WalletVisualWithAddress.propTypes = {
  address: PropTypes.string.isRequired,
  bookmarks: PropTypes.shape().isRequired,
  showBookmarkedAddress: PropTypes.bool,
  size: PropTypes.number,
  token: PropTypes.shape().isRequired,
  transactionSubject: PropTypes.string,
  moduleCommand: PropTypes.string,
};

WalletVisualWithAddress.defaultProps = {
  address: '',
  showBookmarkedAddress: false,
  size: 32,
  transactionSubject: '',
  truncate: true,
};

const mapStateToProps = (state) => ({
  bookmarks: state.bookmarks,
  token: state.token,
});

export default compose(connect(mapStateToProps), withTranslation())(WalletVisualWithAddress);
