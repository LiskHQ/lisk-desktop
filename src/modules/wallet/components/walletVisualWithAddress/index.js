import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';

import {
  MODULE_COMMANDS_NAME_ID_MAP,
  MODULE_COMMANDS_MAP,
} from '@transaction/configuration/moduleAssets';
import { truncateAddress } from '@wallet/utils/account';
import { getModuleCommandTitle } from '@transaction/utils/moduleAssets';
import Icon from 'src/theme/Icon';
import WalletVisual from '../walletVisual';
import styles from './walletVisualWithAddress.css';

const WalletVisualWithAddress = ({
  bookmarks,
  showBookmarkedAddress,
  token,
  address,
  transactionSubject,
  moduleCommandID,
  size,
  truncate,
  className,
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

  const title = getModuleCommandTitle()[moduleCommandID];
  const transformedAddress = getTransformedAddress(address);
  const truncatedAddress =
    truncate === 'small' || truncate === 'medium'
      ? truncateAddress(transformedAddress, truncate)
      : truncateAddress(transformedAddress);

  return (
    <div className={`${styles.address} ${className}`}>
      {moduleCommandID !== MODULE_COMMANDS_NAME_ID_MAP.transfer &&
      transactionSubject === 'recipient' ? (
        <>
          <Icon
            className={styles.txIcon}
            name={MODULE_COMMANDS_MAP[moduleCommandID]?.icon ?? 'txDefault'}
          />
          <span className={styles.addressValue}>{title}</span>
        </>
      ) : (
        <>
          <WalletVisual address={address} size={size} />
          <span className={`${styles.addressValue}`}>
            {truncate ? truncatedAddress : transformedAddress}
          </span>
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
  moduleCommandID: PropTypes.string,
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
