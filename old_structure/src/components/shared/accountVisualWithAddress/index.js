import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';

import { MODULE_ASSETS_NAME_ID_MAP, MODULE_ASSETS_MAP } from '@constants';
import { truncateAddress } from '@utils/account';
import { getModuleAssetTitle } from '@utils/moduleAssets';
import Icon from '@toolbox/icon';
import AccountVisual from '@toolbox/accountVisual';
import styles from './accountVisualWithAddress.css';

class AccountVisualWithAddress extends React.Component {
  getTransformedAddress(address) {
    const { bookmarks, showBookmarkedAddress } = this.props;

    if (showBookmarkedAddress) {
      const bookmarkedAddress = bookmarks[this.props.token.active].find(
        element => element.address === address,
      );
      if (bookmarkedAddress) return bookmarkedAddress.title;
    }

    return address;
  }

  render() {
    const {
      address, transactionSubject, moduleAssetId, size, truncate,
    } = this.props;
    const title = getModuleAssetTitle()[moduleAssetId];
    const transformedAddress = this.getTransformedAddress(address);
    const truncatedAddress = (truncate === 'small' || truncate === 'medium')
      ? truncateAddress(transformedAddress, truncate)
      : truncateAddress(transformedAddress);

    return (
      <div className={`${styles.address}`}>
        {moduleAssetId !== MODULE_ASSETS_NAME_ID_MAP.transfer && transactionSubject === 'recipient' ? (
          <>
            <Icon
              className={styles.txIcon}
              name={MODULE_ASSETS_MAP[moduleAssetId]?.icon ?? 'txDefault'}
            />
            <span className={styles.addressValue}>
              {title}
            </span>
          </>
        ) : (
          <>
            <AccountVisual address={address} size={size} />
            <span className={`${styles.addressValue}`}>
              {truncate ? truncatedAddress : transformedAddress}
            </span>
          </>
        )}
      </div>
    );
  }
}

AccountVisualWithAddress.propTypes = {
  address: PropTypes.string.isRequired,
  bookmarks: PropTypes.shape().isRequired,
  showBookmarkedAddress: PropTypes.bool,
  size: PropTypes.number,
  token: PropTypes.shape().isRequired,
  transactionSubject: PropTypes.string,
  moduleAssetId: PropTypes.string,
};

AccountVisualWithAddress.defaultProps = {
  address: '',
  showBookmarkedAddress: false,
  size: 32,
  transactionSubject: '',
  truncate: true,
};

const mapStateToProps = state => ({
  bookmarks: state.bookmarks,
  token: state.settings.token,
});

export default compose(
  connect(mapStateToProps),
  withTranslation(),
)(AccountVisualWithAddress);
