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
import discord from '../../../assets/images/icons/discord.svg';
import discordActive from '../../../assets/images/icons/discord-active.svg';
import discreetMode from '../../../assets/images/icons/discreet-mode.svg';
import discreetModeActive from '../../../assets/images/icons/discreet-mode-active.svg';
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
import edit from '../../../assets/images/icons/edit.svg';
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
import newsFeedTwitter from '../../../assets/images/icons/news-feed-twitter.svg';
import newsFeedTwitterDark from '../../../assets/images/icons/news-feed-twitter-dark.svg';
import newsFeedBlog from '../../../assets/images/icons/news-feed-blog.svg';
import newsFeedBlogDark from '../../../assets/images/icons/news-feed-blog-dark.svg';
import noTweetsIcon from '../../../assets/images/icons/no-tweets.svg';
import okIcon from '../../../assets/images/icons/icon-checkmark.svg';
import outgoing from '../../../assets/images/icons/outgoing.svg';
import pending from '../../../assets/images/icons/pending.svg';
import searchActive from '../../../assets/images/icons/search-active.svg';
import search from '../../../assets/images/icons/search.svg';
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
import multiSignature from '../../../assets/images/icons/multiSignature.svg';
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
import bookmark from '../../../assets/images/icons/icon-bookmark.svg';
import bookmarkActive from '../../../assets/images/icons/icon-bookmark-active.svg';
import bitcoinLogo from '../../../assets/images/bitcoin-logo.svg';
import toggleSidebar from '../../../assets/images/icons/toggle-sidebar.svg';
import toggleSidebarActive from '../../../assets/images/icons/toggle-sidebar-active.svg';
import darkMode from '../../../assets/images/icons/dark-mode.svg';
import lightMode from '../../../assets/images/icons/light-mode.svg';
import blocksMonitor from '../../../assets/images/icons/blocks.svg';
import blocksMonitorActive from '../../../assets/images/icons/blocksActive.svg';
import accountsMonitor from '../../../assets/images/icons/accountsMonitor.svg';
import accountsMonitorActive from '../../../assets/images/icons/accountsMonitorActive.svg';
import transactionsMonitor from '../../../assets/images/icons/transactionsMonitor.svg';
import transactionsMonitorActive from '../../../assets/images/icons/transactionsMonitorActive.svg';
import delegatesMonitor from '../../../assets/images/icons/delegatesMonitor.svg';
import delegatesMonitorActive from '../../../assets/images/icons/delegatesMonitorActive.svg';
import networkMonitor from '../../../assets/images/icons/networkMonitor.svg';
import networkMonitorActive from '../../../assets/images/icons/networkMonitorActive.svg';
import voting from '../../../assets/images/icons/voting.svg';
import votingActive from '../../../assets/images/icons/votingActive.svg';
import signOut from '../../../assets/images/icons/signOut.svg';
import plus from '../../../assets/images/icons/plus.svg';
import plusActive from '../../../assets/images/icons/plusActive.svg';
import remove from '../../../assets/images/icons/remove.svg';
import totalBlocks from '../../../assets/images/icons/total-blocks.svg';
import blocksForged from '../../../assets/images/icons/blocks-forged.svg';
import distribution from '../../../assets/images/icons/distribution.svg';
import clock from '../../../assets/images/icons/clock.svg';

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
  discord,
  discordActive,
  discreetMode,
  discreetModeActive,
  feedback,
  feedbackActive,
  fileOutline,
  help,
  helpActive,
  helpCenter,
  helpCenterArrow,
  hidePassphraseIcon,
  hwWalletIcon,
  edit,
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
  newsFeedTwitter,
  noTweetsIcon,
  okIcon,
  outgoing,
  pending,
  searchActive,
  search,
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
  newsFeedTwitterDark,
  fileOutlineDark,
  signMessage,
  signMessageActive,
  verifyMessage,
  verifyMessageActive,
  iconEmptyRecentTransactionsDark,
  bookmarksIconEmptyStateDark,
  multiSignature,
  newsFeedBlog,
  newsFeedBlogDark,
  bookmark,
  bookmarkActive,
  bitcoinLogo,
  toggleSidebar,
  toggleSidebarActive,
  darkMode,
  lightMode,
  blocksMonitor,
  blocksMonitorActive,
  accountsMonitor,
  accountsMonitorActive,
  transactionsMonitor,
  transactionsMonitorActive,
  delegatesMonitor,
  delegatesMonitorActive,
  networkMonitor,
  networkMonitorActive,
  voting,
  votingActive,
  signOut,
  plus,
  plusActive,
  remove,
  totalBlocks,
  blocksForged,
  distribution,
  clock,
  searchInput,
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
