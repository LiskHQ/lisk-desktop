import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';

import {
  MODULE_COMMANDS_NAME_MAP,
  MODULE_COMMANDS_MAP,
} from '@transaction/configuration/moduleCommand';
import { truncateAddress } from '@wallet/utils/account';
import { getModuleCommandTitle } from '@transaction/utils/moduleCommand';
import Icon from 'src/theme/Icon';
import DialogLink from 'src/theme/dialog/link';
import CopyToClipboard from 'src/modules/common/components/copyToClipboard';
import WalletVisual from '../walletVisual';
import styles from './walletVisualWithAddress.css';

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
}) => {
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
        <>
          <WalletVisual address={address} size={size} />
          <div className={`${styles.detailsWrapper} ${detailsClassName || ''}`}>
            {accountName && (
              <div className={styles.accountName}>
                <p className="accountName">{accountName}</p>
                <DialogLink component="multisigAccountDetails">
                  <Icon name="multisigKeys" />
                </DialogLink>
              </div>
            )}
            <span className={`${styles.address} accountAddress`}>
              {truncate ? truncatedAddress : transformedAddress}
              {copy ? (
                <CopyToClipboard
                  value={address}
                  type="icon"
                  copyClassName={styles.copyIcon}
                  className={styles.copyIcon}
                />
              ) : null}
            </span>
          </div>
        </>
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
