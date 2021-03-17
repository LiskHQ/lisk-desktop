import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { MODULE_ASSETS } from '@constants';
import regex from '@utils/regex';
import styles from './accountVisualWithAddress.css';
import Icon from '../../toolbox/icon';
import AccountVisual from '../../toolbox/accountVisual';

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
      address, transactionSubject, moduleAssetType, size,
    } = this.props;
    const txType = MODULE_ASSETS[moduleAssetType];
    const transformedAddress = this.getTransformedAddress(address);

    return (
      <div className={`${styles.address}`}>
        {moduleAssetType !== MODULE_ASSETS.transfer && transactionSubject === 'recipientId' ? (
          <React.Fragment>
            <Icon
              className={styles.txIcon}
              name={moduleAssetType || 'txDefault'}
            />
            <span className={styles.addressValue}>
              {txType.title}
            </span>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <AccountVisual address={address} size={size} />
            <span className={`${styles.addressValue} showOnLargeViewPort`}>{transformedAddress}</span>
            <span className={`${styles.addressValue} hideOnLargeViewPort`}>{transformedAddress.replace(regex.lskAddressTrunk, '$1...$3')}</span>
          </React.Fragment>
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
  transactionType: PropTypes.string,
};

AccountVisualWithAddress.defaultProps = {
  address: '',
  showBookmarkedAddress: false,
  size: 32,
  transactionSubject: '',
};

const mapStateToProps = state => ({
  bookmarks: state.bookmarks,
  token: state.settings.token,
});

export default compose(
  connect(mapStateToProps),
  withTranslation(),
)(AccountVisualWithAddress);
