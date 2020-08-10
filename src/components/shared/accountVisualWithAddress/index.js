import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import styles from './accountVisualWithAddress.css';
import Icon from '../../toolbox/icon';
import transactionTypes from '../../../constants/transactionTypes';
import AccountVisual from '../../toolbox/accountVisual';
import regex from '../../../utils/regex';
import withResizeValues from '../../../utils/withResizeValues';

class AccountVisualWithAddress extends React.Component {
  getTransformedAddress(address) {
    const { isMediumViewPort, bookmarks, showBookmarkedAddress } = this.props;

    if (showBookmarkedAddress) {
      const bookmarkedAddress = bookmarks[this.props.token.active].find(
        element => element.address === address,
      );
      if (bookmarkedAddress) return bookmarkedAddress.title;
    }

    // @todo fix this using css
    /* istanbul ignore next */
    if (isMediumViewPort) {
      return address.replace(regex.lskAddressTrunk, '$1...$3');
    }

    return address;
  }

  render() {
    const {
      address, transactionSubject, transactionType, size,
    } = this.props;
    const txType = transactionTypes.getByCode(transactionType);
    const sendCode = transactionTypes().send.code;
    return (
      <div className={`${styles.address}`}>
        {transactionType !== sendCode && transactionSubject === 'recipientId' ? (
          <React.Fragment>
            <Icon
              className={styles.txIcon}
              name={txType.icon || 'txDefault'}
            />
            <span className={styles.addressValue}>
              {txType.title}
            </span>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <AccountVisual address={address} size={size} />
            <span className={styles.addressValue}>{this.getTransformedAddress(address)}</span>
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
  transactionType: PropTypes.number,
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

export default connect(mapStateToProps)(
  compose(
    withTranslation(),
    withResizeValues,
  )(AccountVisualWithAddress),
);
