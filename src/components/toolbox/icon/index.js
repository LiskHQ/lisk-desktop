import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../../utils/theme';
import academy from '../../../assets/images/icons/academy.svg';
import academyActive from '../../../assets/images/icons/academy-active.svg';
import alertIcon from '../../../assets/images/icons/icon-alert.svg';
import approved from '../../../assets/images/icons/approved.svg';
import arrowLeftActive from '../../../assets/images/icons/arrow-left-active.svg';
import arrowLeftInactive from '../../../assets/images/icons/arrow-left-inactive.svg';
import arrowRightActive from '../../../assets/images/icons/arrow-right-active.svg';
import arrowRightInactive from '../../../assets/images/icons/arrow-right-inactive.svg';
import arrowUpCircle from '../../../assets/images/icons/click-to-update.svg';
import balance from '../../../assets/images/icons/balance.svg';
import balanceDark from '../../../assets/images/icons/balance-dark.svg';
import bookmarksIconEmptyState from '../../../assets/images/icons/bookmarks-empty-state.svg';
import bookmarksIconEmptyStateDark from '../../../assets/images/icons/bookmarks-empty-state-dark.svg';
import btcIcon from '../../../assets/images/icons/icon-btc.svg';
import checkboxFilled from '../../../assets/images/icons/checkmark-filled.svg';
import checkmark from '../../../assets/images/icons/checkmark.svg';
import copy from '../../../assets/images/icons/copy.svg';
import copyActive from '../../../assets/images/icons/copy-active.svg';
import dashboardIcon from '../../../assets/images/icons/dashboard.svg';
import dashboardIconActive from '../../../assets/images/icons/dashboard-active.svg';
import delegatesIcon from '../../../assets/images/icons/delegates.svg';
import delegatesIconActive from '../../../assets/images/icons/delegates-active.svg';
import delegatesIconActiveDark from '../../../assets/images/icons/delegates-active-dark.svg';
import discord from '../../../assets/images/icons/discord.svg';
import discordActive from '../../../assets/images/icons/discord-active.svg';
import discreetModeOff from '../../../assets/images/icons/discreet-mode-off.svg';
import discreetModeOn from '../../../assets/images/icons/discreet-mode-on.svg';
import feedback from '../../../assets/images/icons/feedback.svg';
import feedbackActive from '../../../assets/images/icons/feedback-active.svg';
import fileOutline from '../../../assets/images/icons/icon-file-outline.svg';
import fileOutlineDark from '../../../assets/images/icons/icon-file-outline-dark.svg';
import help from '../../../assets/images/icons/help.svg';
import helpActive from '../../../assets/images/icons/help-active.svg';
import helpCenter from '../../../assets/images/icons/help-center.svg';
import helpCenterArrow from '../../../assets/images/icons/arrow.svg';
import hidePassphraseIcon from '../../../assets/images/icons/icon-hide-passphrase.svg';
import hwWalletIcon from '../../../assets/images/icons/hw-wallet.svg';
import iconEdit from '../../../assets/images/icons/icon-edit.svg';
import iconEmptyRecentTransactions from '../../../assets/images/icons/empty-recent-transactions.svg';
import iconEmptyRecentTransactionsDark from '../../../assets/images/icons/empty-recent-transactions-dark.svg';
import iconFilter from '../../../assets/images/icons/icon-filter.svg';
import iconLedgerDevice from '../../../assets/images/icons/icon-ledger-device.svg';
import iconLoader from '../../../assets/images/icons/icon-loader.svg';
import iconTrezorDevice from '../../../assets/images/icons/icon-trezor-device.svg';
import iconWarning from '../../../assets/images/icons/icon-warning.svg';
import incoming from '../../../assets/images/icons/incoming.svg';
import liskChat from '../../../assets/images/icons/lisk-chat.svg';
import liskLogo from '../../../assets/images/lisk-logo-v2.svg';
import liskLogoDark from '../../../assets/images/lisk-logo-dark.svg';
import liskLogoWhite from '../../../assets/images/lisk-logo-white-v2.svg';
import logout from '../../../assets/images/icons/logout.svg';
import logoutActive from '../../../assets/images/icons/logout-active.svg';
import lskIcon from '../../../assets/images/icons/icon-lsk.svg';
import monitorIcon from '../../../assets/images/icons/monitor.svg';
import monitorIconActive from '../../../assets/images/icons/monitorActive.svg';
import monitorIconActiveDark from '../../../assets/images/icons/monitorActiveDark.svg';
import newsFeedAvatar from '../../../assets/images/icons/news-feed-avatar.svg';
import newsFeedAvatarDark from '../../../assets/images/icons/news-feed-avatar-dark.svg';
import noTweetsIcon from '../../../assets/images/icons/no-tweets.svg';
import okIcon from '../../../assets/images/icons/icon-checkmark.svg';
import outgoing from '../../../assets/images/icons/outgoing.svg';
import pending from '../../../assets/images/icons/pending.svg';
import searchIconActive from '../../../assets/images/icons/search-active.svg';
import searchIconInactive from '../../../assets/images/icons/search.svg';
import searchInput from '../../../assets/images/icons/search-input.svg';
import settings from '../../../assets/images/icons/settings.svg';
import settingsActive from '../../../assets/images/icons/settings-active.svg';
import showPassphraseIcon from '../../../assets/images/icons/icon-show-passphrase.svg';
import signIn from '../../../assets/images/icons/signin.svg';
import signInActive from '../../../assets/images/icons/signin-active.svg';
import tooltipQuestionMark from '../../../assets/images/icons/tooltip-question-icon.svg';
import transactionApproved from '../../../assets/images/icons/transaction-status-approved.svg';
import transactionError from '../../../assets/images/icons/transaction-error.svg';
import transactionPending from '../../../assets/images/icons/transaction-status-pending.svg';
import transactionSuccess from '../../../assets/images/icons/transaction-success.svg';
import tx2ndPassphrase from '../../../assets/images/icons/tx-2nd-passphrase.svg';
import txDefault from '../../../assets/images/icons/tx-default.svg';
import txDelegate from '../../../assets/images/icons/tx-delegate.svg';
import txVote from '../../../assets/images/icons/tx-vote.svg';
import addedVotes from '../../../assets/images/icons/added-votes.svg';
import removedVotes from '../../../assets/images/icons/removed-votes.svg';
import totalVotes from '../../../assets/images/icons/total-votes.svg';
import user from '../../../assets/images/icons/user.svg';
import userActive from '../../../assets/images/icons/user-active.svg';
import verifyMessageInputsView from '../../../assets/images/icons/verify-message-inputs-view.svg';
import verifyMessageInputsViewActive from '../../../assets/images/icons/verify-message-inputs-view-active.svg';
import verifyMessageTextareaView from '../../../assets/images/icons/verify-message-textarea-view.svg';
import verifyMessageTextareaViewActive from '../../../assets/images/icons/verify-message-textarea-view-active.svg';
import verifyWalletAddress from '../../../assets/images/icons/verify-icon.svg';
import verifyWalletAddressActive from '../../../assets/images/icons/verify-icon-active.svg';
import walletIcon from '../../../assets/images/icons/wallet.svg';
import walletIconActive from '../../../assets/images/icons/wallet-active.svg';
import warningIcon from '../../../assets/images/icons/warning-icon.svg';
import warningRound from '../../../assets/images/icons/warning-round.svg';
import qrCode from '../../../assets/images/icons/qr-code.svg';
import signMessage from '../../../assets/images/icons/sign.svg';
import signMessageActive from '../../../assets/images/icons/signActive.svg';
import verifyMessage from '../../../assets/images/icons/verify.svg';
import verifyMessageActive from '../../../assets/images/icons/verifyActive.svg';
import qrCodeActive from '../../../assets/images/icons/qr-code-active.svg';

export const icons = {
  academy,
  academyActive,
  alertIcon,
  approved,
  arrowLeftActive,
  arrowLeftInactive,
  arrowRightActive,
  arrowRightInactive,
  arrowUpCircle,
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
  discord,
  discordActive,
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
  hwWalletIcon,
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
  monitorIcon,
  monitorIconActive,
  newsFeedAvatar,
  noTweetsIcon,
  okIcon,
  outgoing,
  pending,
  searchIconActive,
  searchIconInactive,
  searchInput,
  settings,
  settingsActive,
  showPassphraseIcon,
  signIn,
  signInActive,
  tooltipQuestionMark,
  transactionApproved,
  transactionError,
  transactionPending,
  transactionSuccess,
  tx2ndPassphrase,
  txDefault,
  txDelegate,
  txVote,
  user,
  userActive,
  verifyMessageInputsView,
  verifyMessageInputsViewActive,
  verifyMessageTextareaView,
  verifyMessageTextareaViewActive,
  verifyWalletAddress,
  walletIcon,
  walletIconActive,
  warningIcon,
  warningRound,
  addedVotes,
  removedVotes,
  totalVotes,
  qrCode,
  qrCodeActive,
  copyActive,
  verifyWalletAddressActive,
  liskLogoDark,
  balanceDark,
  newsFeedAvatarDark,
  fileOutlineDark,
  signMessage,
  signMessageActive,
  verifyMessage,
  verifyMessageActive,
  iconEmptyRecentTransactionsDark,
  bookmarksIconEmptyStateDark,
  monitorIconActiveDark,
  delegatesIconActiveDark,
};

const Icon = ({ name, noTheme, ...props }) => {
  const theme = useTheme();
  const src = theme === 'dark' && !noTheme && icons[`${name}Dark`] ? icons[`${name}Dark`] : icons[name];
  return <img src={src} {...props} />;
};

Icon.propTypes = {
  name: PropTypes.oneOf(Object.keys(icons)).isRequired,
};

export default Icon;
