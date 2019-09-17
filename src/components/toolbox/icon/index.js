import React from 'react';
import PropTypes from 'prop-types';

import academy from '../../../assets/images/icons/academy.svg';
import academyActive from '../../../assets/images/icons/academy-active.svg';
import alertIcon from '../../../assets/images/icons/icon-alert.svg';
import arrowLeftActive from '../../../assets/images/icons/arrow-left-active.svg';
import arrowLeftInactive from '../../../assets/images/icons/arrow-left-inactive.svg';
import arrowRightActive from '../../../assets/images/icons/arrow-right-active.svg';
import arrowRightInactive from '../../../assets/images/icons/arrow-right-inactive.svg';
import balance from '../../../assets/images/icons/balance.svg';
import bookmarksIconEmptyState from '../../../assets/images/icons/bookmarks-empty-state.svg';
import btcIcon from '../../../assets/images/icons/icon-btc.svg';
import checkboxFilled from '../../../assets/images/icons/checkmark-filled.svg';
import checkmark from '../../../assets/images/icons/checkmark.svg';
import copy from '../../../assets/images/icons/copy.svg';
import dashboardIcon from '../../../assets/images/icons/dashboard.svg';
import dashboardIconActive from '../../../assets/images/icons/dashboard-active.svg';
import delegatesIcon from '../../../assets/images/icons/delegates.svg';
import delegatesIconActive from '../../../assets/images/icons/delegates-active.svg';
import discordIcon from '../../../assets/images/icons/discord.svg';
import discordIconActive from '../../../assets/images/icons/discord-active.svg';
import discreetModeOff from '../../../assets/images/icons/discreet-mode-off.svg';
import discreetModeOn from '../../../assets/images/icons/discreet-mode-on.svg';
import feedback from '../../../assets/images/icons/feedback.svg';
import feedbackActive from '../../../assets/images/icons/feedback-active.svg';
import fileOutline from '../../../assets/images/icons/icon-file-outline.svg';
import help from '../../../assets/images/icons/help.svg';
import helpActive from '../../../assets/images/icons/help-active.svg';
import helpCenter from '../../../assets/images/icons/help-center.svg';
import helpCenterArrow from '../../../assets/images/icons/arrow.svg';
import hidePassphraseIcon from '../../../assets/images/icons/icon-hide-passphrase.svg';
import iconEdit from '../../../assets/images/icons/icon-edit.svg';
import iconEmptyRecentTransactions from '../../../assets/images/icons/empty-recent-transactions.svg';
import iconFilter from '../../../assets/images/icons/icon-filter.svg';
import iconLedgerDevice from '../../../assets/images/icons/icon-ledger-device.svg';
import iconLoader from '../../../assets/images/icons/icon-loader.svg';
import iconTrezorDevice from '../../../assets/images/icons/icon-trezor-device.svg';
import iconWarning from '../../../assets/images/icons/icon-warning.svg';
import incoming from '../../../assets/images/icons/incoming.svg';
import liskChat from '../../../assets/images/icons/lisk-chat.svg';
import liskLogo from '../../../assets/images/lisk-logo-v2.svg';
import liskLogoWhite from '../../../assets/images/lisk-logo-white-v2.svg';
import logout from '../../../assets/images/icons/logout.svg';
import logoutActive from '../../../assets/images/icons/logout-active.svg';
import lskIcon from '../../../assets/images/icons/icon-lsk.svg';
import newsFeedAvatar from '../../../assets/images/icons/news-feed-avatar.svg';
import noTweetsIcon from '../../../assets/images/icons/no-tweets.svg';
import okIcon from '../../../assets/images/icons/icon-checkmark.svg';
import outgoing from '../../../assets/images/icons/outgoing.svg';
import searchIconActive from '../../../assets/images/icons/search-active.svg';
import searchIconInactive from '../../../assets/images/icons/search.svg';
import searchInput from '../../../assets/images/icons/search-input.svg';
import settings from '../../../assets/images/icons/settings.svg';
import settingsActive from '../../../assets/images/icons/settings-active.svg';
import showPassphraseIcon from '../../../assets/images/icons/icon-show-passphrase.svg';
import signin from '../../../assets/images/icons/signin.svg';
import signinActive from '../../../assets/images/icons/signin-active.svg';
import transactionError from '../../../assets/images/icons/transaction-error.svg';
import transactionSuccess from '../../../assets/images/icons/transaction-success.svg';
import tx2ndPassphrase from '../../../assets/images/icons/tx-2nd-passphrase.svg';
import txDefault from '../../../assets/images/icons/tx-default.svg';
import txDelegate from '../../../assets/images/icons/tx-delegate.svg';
import txVote from '../../../assets/images/icons/tx-vote.svg';
import user from '../../../assets/images/icons/user.svg';
import userActive from '../../../assets/images/icons/user-active.svg';
import walletIcon from '../../../assets/images/icons/wallet.svg';
import walletIconActive from '../../../assets/images/icons/wallet-active.svg';
import warningIcon from '../../../assets/images/icons/warning-icon.svg';

export const icons = {
  academy,
  academyActive,
  alertIcon,
  arrowLeftActive,
  arrowLeftInactive,
  arrowRightActive,
  arrowRightInactive,
  balance,
  bookmarksIconEmptyState,
  btcIcon,
  checkboxFilled,
  checkmark,
  copy,
  dashboardIcon,
  dashboardIconActive,
  delegatesIcon,
  delegatesIconActive,
  discordIcon,
  discordIconActive,
  discreetModeOff,
  discreetModeOn,
  feedback,
  feedbackActive,
  fileOutline,
  help,
  helpActive,
  helpCenter,
  helpCenterArrow,
  hidePassphraseIcon,
  iconEdit,
  iconEmptyRecentTransactions,
  iconFilter,
  iconLedgerDevice,
  iconLoader,
  iconTrezorDevice,
  iconWarning,
  incoming,
  liskChat,
  liskLogo,
  liskLogoWhite,
  logout,
  logoutActive,
  lskIcon,
  newsFeedAvatar,
  noTweetsIcon,
  okIcon,
  outgoing,
  searchIconActive,
  searchIconInactive,
  searchInput,
  settings,
  settingsActive,
  showPassphraseIcon,
  signin,
  signinActive,
  transactionError,
  transactionSuccess,
  tx2ndPassphrase,
  txDefault,
  txDelegate,
  txVote,
  user,
  userActive,
  walletIcon,
  walletIconActive,
  warningIcon,
};


const Icon = ({ name, ...props }) => (
  <img src={icons[name]} {...props} />
);

Icon.propTypes = {
  name: PropTypes.oneOf(Object.keys(icons)).isRequired,
};

export default Icon;
