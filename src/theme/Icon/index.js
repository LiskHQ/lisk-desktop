/* eslint-disable max-lines */
import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from 'src/theme/Theme';
import academy from '@setup/react/assets/images/icons/academy.svg';
import academyActive from '@setup/react/assets/images/icons/academy-active.svg';
import alertIcon from '@setup/react/assets/images/icons/icon-alert.svg';
import approved from '@setup/react/assets/images/icons/approved.svg';
import arrowLeft from '@setup/react/assets/images/icons/arrow-left.svg';
import arrowLeftActive from '@setup/react/assets/images/icons/arrow-left-active.svg';
import arrowLeftInactive from '@setup/react/assets/images/icons/arrow-left-inactive.svg';
import arrowLeftTailed from '@setup/react/assets/images/icons/arrow-left-tailed.svg';
import arrowLeftTailedDark from '@setup/react/assets/images/icons/arrow-left-tailed-dark.svg';
import arrowRight from '@setup/react/assets/images/icons/arrow-right.svg';
import arrowBlueRight from '@setup/react/assets/images/icons/arrow-blue-right.svg';
import arrowBlueDown from '@setup/react/assets/images/icons/arrow-blue-down.svg';
import arrowRightActive from '@setup/react/assets/images/icons/arrow-right-active.svg';
import arrowRightInactive from '@setup/react/assets/images/icons/arrow-right-inactive.svg';
import arrowRightWithStroke from '@setup/react/assets/images/icons/arrow-right-with-stroke.svg';
import arrowRightCircle from '@setup/react/assets/images/icons/arrow-right-circle.svg';
import arrowRightWithStrokeDark from '@setup/react/assets/images/icons/arrow-right-with-stroke-dark.svg';
import arrowUpCircle from '@setup/react/assets/images/icons/click-to-update.svg';
import arrowWhiteDown from '@setup/react/assets/images/icons/arrow-white-down.svg';
import balance from '@setup/react/assets/images/icons/balance.svg';
import balanceDark from '@setup/react/assets/images/icons/balance-dark.svg';
import bookmarksIconEmptyState from '@setup/react/assets/images/icons/bookmarks-empty-state.svg';
import bookmarksIconEmptyStateDark from '@setup/react/assets/images/icons/bookmarks-empty-state-dark.svg';
import checkboxFilled from '@setup/react/assets/images/icons/checkmark-filled.svg';
import checkboxCircleFilled from '@setup/react/assets/images/icons/checkmark-circle-filled.svg';
import checkmarkBlue from '@setup/react/assets/images/icons/checkmark-blue.svg';
import copy from '@setup/react/assets/images/icons/copy.svg';
import copyActive from '@setup/react/assets/images/icons/copy-active.svg';
import discord from '@setup/react/assets/images/icons/discord.svg';
import discordActive from '@setup/react/assets/images/icons/discord-active.svg';
import discreetMode from '@setup/react/assets/images/icons/discreet-mode.svg';
import discreetModeActive from '@setup/react/assets/images/icons/discreet-mode-active.svg';
import feedback from '@setup/react/assets/images/icons/feedback.svg';
import feedbackActive from '@setup/react/assets/images/icons/feedback-active.svg';
import filePlain from '@setup/react/assets/images/icons/file-plain.svg';
import fileOutline from '@setup/react/assets/images/icons/icon-file-outline.svg';
import fileOutlineDark from '@setup/react/assets/images/icons/icon-file-outline-dark.svg';
import help from '@setup/react/assets/images/icons/help.svg';
import helpActive from '@setup/react/assets/images/icons/help-active.svg';
import helpCenter from '@setup/react/assets/images/icons/help-center.svg';
import helpCenterArrow from '@setup/react/assets/images/icons/arrow.svg';
import hidePassphraseIcon from '@setup/react/assets/images/icons/icon-hide-passphrase.svg';
import hwWalletIcon from '@setup/react/assets/images/icons/hw-wallet.svg';
import edit from '@setup/react/assets/images/icons/edit.svg';
import iconEmptyRecentTransactions from '@setup/react/assets/images/icons/empty-recent-transactions.svg';
import iconEmptyRecentTransactionsDark from '@setup/react/assets/images/icons/empty-recent-transactions-dark.svg';
import iconFilter from '@setup/react/assets/images/icons/icon-filter.svg';
import iconLedgerDevice from '@setup/react/assets/images/icons/icon-ledger-device.svg';
import iconLoader from '@setup/react/assets/images/icons/icon-loader.svg';
import iconWarning from '@setup/react/assets/images/icons/icon-warning.svg';
import incoming from '@setup/react/assets/images/icons/incoming.svg';
import liskChat from '@setup/react/assets/images/icons/lisk-chat.svg';
import liskLogo from '@setup/react/assets/images/lisk-logo-v2.svg';
import liskLogoDark from '@setup/react/assets/images/lisk-logo-dark.svg';
import liskLogoWhite from '@setup/react/assets/images/lisk-logo-white-v2.svg';
import liskLogoWhiteNormalized from '@setup/react/assets/images/lisk-logo-white-v2-normalized.svg';
import logout from '@setup/react/assets/images/icons/logout.svg';
import logoutActive from '@setup/react/assets/images/icons/logout-active.svg';
import lskIcon from '@setup/react/assets/images/icons/icon-lsk.svg';
import okIcon from '@setup/react/assets/images/icons/icon-checkmark.svg';
import outgoing from '@setup/react/assets/images/icons/outgoing.svg';
import pending from '@setup/react/assets/images/icons/pending.svg';
import searchActive from '@setup/react/assets/images/icons/search-active.svg';
import searchSlim from '@setup/react/assets/images/icons/search-slim.svg';
import search from '@setup/react/assets/images/icons/search.svg';
import searchInput from '@setup/react/assets/images/icons/search-input.svg';
import searchFilter from '@setup/react/assets/images/icons/search-filter.svg';
import settings from '@setup/react/assets/images/icons/settings.svg';
import settingsActive from '@setup/react/assets/images/icons/settings-active.svg';
import showPassphraseIcon from '@setup/react/assets/images/icons/icon-show-passphrase.svg';
import signIn from '@setup/react/assets/images/icons/signin.svg';
import signInActive from '@setup/react/assets/images/icons/signin-active.svg';
import tooltipQuestionMark from '@setup/react/assets/images/icons/tooltip-question-icon.svg';
import transactionError from '@setup/react/assets/images/icons/transaction-error.svg';
import transactionStatusSuccessful from '@setup/react/assets/images/icons/transaction-status-successful.svg';
import transactionStatusPending from '@setup/react/assets/images/icons/transaction-status-pending.svg';
import transactionStatusFailed from '@setup/react/assets/images/icons/transaction-status-failed.svg';
import transactionSuccess from '@setup/react/assets/images/icons/transaction-success.svg';
import txDefault from '@setup/react/assets/images/icons/tx-default.svg';
import txDefaultDark from '@setup/react/assets/images/icons/tx-default-dark.svg';
import registerValidator from '@setup/react/assets/images/icons/tx-registerValidator.svg';
import registerValidatorDark from '@setup/react/assets/images/icons/tx-validator-dark.svg';
import stake from '@setup/react/assets/images/icons/tx-stake.svg';
import user from '@setup/react/assets/images/icons/user.svg';
import userActive from '@setup/react/assets/images/icons/user-active.svg';
import verifyMessageInputsView from '@setup/react/assets/images/icons/verify-message-inputs-view.svg';
import verifyMessageInputsViewActive from '@setup/react/assets/images/icons/verify-message-inputs-view-active.svg';
import verifyMessageTextareaView from '@setup/react/assets/images/icons/verify-message-textarea-view.svg';
import verifyMessageTextareaViewActive from '@setup/react/assets/images/icons/verify-message-textarea-view-active.svg';
import verifyWalletAddress from '@setup/react/assets/images/icons/verify-icon.svg';
import verifyWalletAddressActive from '@setup/react/assets/images/icons/verify-icon-active.svg';
import walletIcon from '@setup/react/assets/images/icons/wallet.svg';
import walletIconActive from '@setup/react/assets/images/icons/wallet-active.svg';
import warningIcon from '@setup/react/assets/images/icons/warning-icon.svg';
import warningIconBlue from '@setup/react/assets/images/icons/warning-icon-blue.svg';
import warningRound from '@setup/react/assets/images/icons/warning-round.svg';
import warningFolder from '@setup/react/assets/images/icons/warning-folder.svg';
import qrCode from '@setup/react/assets/images/icons/qr-code.svg';
import signMessage from '@setup/react/assets/images/icons/sign.svg';
import signMessageActive from '@setup/react/assets/images/icons/signActive.svg';
import verifyMessage from '@setup/react/assets/images/icons/verify.svg';
import verifyMessageActive from '@setup/react/assets/images/icons/verifyActive.svg';
import qrCodeActive from '@setup/react/assets/images/icons/qr-code-active.svg';
import bookmark from '@setup/react/assets/images/icons/icon-bookmark.svg';
import bookmarkActive from '@setup/react/assets/images/icons/icon-bookmark-active.svg';
import toggleSidebar from '@setup/react/assets/images/icons/toggle-sidebar.svg';
import toggleSidebarActive from '@setup/react/assets/images/icons/toggle-sidebar-active.svg';
import darkMode from '@setup/react/assets/images/icons/dark-mode.svg';
import lightMode from '@setup/react/assets/images/icons/light-mode.svg';
import blocksMonitor from '@setup/react/assets/images/icons/blocks.svg';
import blocksMonitorActive from '@setup/react/assets/images/icons/blocksActive.svg';
import walletsMonitor from '@setup/react/assets/images/icons/walletsMonitor.svg';
import walletsMonitorActive from '@setup/react/assets/images/icons/walletsMonitorActive.svg';
import transactions from '@setup/react/assets/images/icons/transactions.svg';
import transactionsDark from '@setup/react/assets/images/icons/transactions-dark.svg';
import transactionsMonitor from '@setup/react/assets/images/icons/transactionsMonitor.svg';
import transactionsMonitorActive from '@setup/react/assets/images/icons/transactionsMonitorActive.svg';
import validatorsMonitor from '@setup/react/assets/images/icons/validatorsMonitor.svg';
import validatorsMonitorActive from '@setup/react/assets/images/icons/validatorsMonitorActive.svg';
import networkMonitor from '@setup/react/assets/images/icons/networkMonitor.svg';
import networkMonitorActive from '@setup/react/assets/images/icons/networkMonitorActive.svg';
import staking from '@setup/react/assets/images/icons/staking.svg';
import stakingActive from '@setup/react/assets/images/icons/stakingActive.svg';
import signOut from '@setup/react/assets/images/icons/signOut.svg';
import plus from '@setup/react/assets/images/icons/plus.svg';
import plusActive from '@setup/react/assets/images/icons/plusActive.svg';
import profileOutline from '@setup/react/assets/images/icons/profile-outline.svg';
import remove from '@setup/react/assets/images/icons/remove.svg';
import removeBlueIcon from '@setup/react/assets/images/icons/remove-blue.svg';
import removeRed from '@setup/react/assets/images/icons/remove-red.svg';
import totalBlocks from '@setup/react/assets/images/icons/total-blocks.svg';
import totalBlocksDark from '@setup/react/assets/images/icons/total-blocks-dark.svg';
import blocksGenerated from '@setup/react/assets/images/icons/blocks-generated.svg';
import blocksGeneratedDark from '@setup/react/assets/images/icons/blocks-generated-dark.svg';
import distribution from '@setup/react/assets/images/icons/distribution.svg';
import clock from '@setup/react/assets/images/icons/clock.svg';
import clockDark from '@setup/react/assets/images/icons/clock-dark.svg';
import clockActive from '@setup/react/assets/images/icons/clock-active.svg';
import clockActiveDark from '@setup/react/assets/images/icons/clock-active-dark.svg';
import star from '@setup/react/assets/images/icons/star.svg';
import starDark from '@setup/react/assets/images/icons/star-dark.svg';
import calendar from '@setup/react/assets/images/icons/calendar.svg';
import calendarDark from '@setup/react/assets/images/icons/calendar-dark.svg';
import validatorName from '@setup/react/assets/images/icons/validator-name.svg';
import weight from '@setup/react/assets/images/icons/weight.svg';
import weightDark from '@setup/react/assets/images/icons/weight-dark.svg';
import reward from '@setup/react/assets/images/icons/generated-lsk.svg';
import rewardDark from '@setup/react/assets/images/icons/generated-lsk-dark.svg';
import productivity from '@setup/react/assets/images/icons/productivity.svg';
import productivityDark from '@setup/react/assets/images/icons/productivity-dark.svg';
import missedBlocks from '@setup/react/assets/images/icons/missed-blocks.svg';
import missedBlocksDark from '@setup/react/assets/images/icons/missed-blocks-dark.svg';
import generatedBlocks from '@setup/react/assets/images/icons/generated-blocks.svg';
import generatedBlocksDark from '@setup/react/assets/images/icons/generated-blocks-dark.svg';
import consecutiveMissedBlocks from '@setup/react/assets/images/icons/consecutive-missed-blocks.svg';
import consecutiveMissedBlocksDark from '@setup/react/assets/images/icons/consecutive-missed-blocks-dark.svg';
import lock from '@setup/react/assets/images/icons/lock.svg';
import lockedBalance from '@setup/react/assets/images/icons/zodiac-blue-lock.svg';
import lockedBalanceDark from '@setup/react/assets/images/icons/white-lock.svg';
import unlock from '@setup/react/assets/images/icons/unlock.svg';
import loading from '@setup/react/assets/images/icons/loading.svg';
import unlockToken from '@setup/react/assets/images/icons/tx-unlock.svg';
import unlockTokenDark from '@setup/react/assets/images/icons/tx-unlock-dark.svg';
import stakingQueueInactive from '@setup/react/assets/images/icons/staking-queue-inactive.svg';
import stakingQueueActive from '@setup/react/assets/images/icons/staking-queue-active.svg';
import deleteIcon from '@setup/react/assets/images/icons/delete.svg';
import deleteRedIcon from '@setup/react/assets/images/icons/delete-red-icon.svg';
import arrowRightTailed from '@setup/react/assets/images/icons/arrow-right-tailed.svg';
import download from '@setup/react/assets/images/icons/download.svg';
import downloadBlue from '@setup/react/assets/images/icons/download-blue.svg';
import registerMultisignature from '@setup/react/assets/images/icons/multisignature.svg';
import multisignatureTransaction from '@setup/react/assets/images/icons/multisignatureTransaction.svg';
import multisignatureTransactionDark from '@setup/react/assets/images/icons/multisignatureTransaction-dark.svg';
import multiSignatureOutline from '@setup/react/assets/images/icons/multisignature-outline.svg';
import multisigKeys from '@setup/react/assets/images/icons/keys-filled.svg';
import multisigKeysDark from '@setup/react/assets/images/icons/keys-filled-dark.svg';
import upload from '@setup/react/assets/images/icons/upload.svg';
import validatorGenerated from '@setup/react/assets/images/icons/validator-generated.svg';
import validatorGeneratedDark from '@setup/react/assets/images/icons/validator-generated-dark.svg';
import validatorMissed from '@setup/react/assets/images/icons/validator-missed.svg';
import validatorMissedDark from '@setup/react/assets/images/icons/validator-missed-dark.svg';
import validatorWarning from '@setup/react/assets/images/icons/validator-warning.svg';
import validatorAwaiting from '@setup/react/assets/images/icons/validator-awaiting.svg';
import validatorAwaitingDark from '@setup/react/assets/images/icons/validator-awaiting-dark.svg';
import validatorActive from '@setup/react/assets/images/icons/validator-active.svg';
import validatorActiveDark from '@setup/react/assets/images/icons/validator-active-dark.svg';
import validatorStandby from '@setup/react/assets/images/icons/validator-standby.svg';
import validatorStandbyDark from '@setup/react/assets/images/icons/validator-standby-dark.svg';
import validatorIneligible from '@setup/react/assets/images/icons/validator-ineligible.svg';
import validatorIneligibleDark from '@setup/react/assets/images/icons/validator-ineligible-dark.svg';
import validatorPunished from '@setup/react/assets/images/icons/validator-punished.svg';
import validatorPunishedDark from '@setup/react/assets/images/icons/validator-punished-dark.svg';
import validatorBanned from '@setup/react/assets/images/icons/validator-banned.svg';
import validatorBannedDark from '@setup/react/assets/images/icons/validator-banned-dark.svg';
import eyeInactive from '@setup/react/assets/images/icons/eye-inactive.svg';
import eyeActive from '@setup/react/assets/images/icons/eye-active.svg';
import liskIcon from '@setup/react/assets/images/icons/lisk-icon.svg';
import initialiseIcon from '@setup/react/assets/images/icons/initialise-icon.svg';
import initialiseRegistration from '@setup/react/assets/images/icons/initialise-registration.svg';
import warningYellow from '@setup/react/assets/images/icons/warning-yellow.svg';
import linkIcon from '@setup/react/assets/images/icons/link-icon.svg';
import refresh from '@setup/react/assets/images/icons/refresh.svg';
import refreshActive from '@setup/react/assets/images/icons/refresh-active.svg';
import reportValidatorMisbehavior from '@setup/react/assets/images/icons/reportValidatorMisbehavior.svg';
import reportValidatorMisbehaviorDark from '@setup/react/assets/images/icons/reportValidatorMisbehavior-dark.svg';
import downloadUpdateFinish from '@setup/react/assets/images/icons/download-update-finish.svg';
import downloadUpdateProgress from '@setup/react/assets/images/icons/download-update-progress.svg';
import whiteLinkIcon from '@setup/react/assets/images/icons/white-link-icon.svg';
import personIcon from '@setup/react/assets/images/icons/person-blue.svg';
import verticalDots from '@setup/react/assets/images/icons/vertical-dots.svg';
import switchIcon from '@setup/react/assets/images/icons/switch.svg';
import secretPassphrase from '@setup/react/assets/images/icons/secret-passphrase.svg';
import accountUpload from '@setup/react/assets/images/icons/account-upload.svg';
import accountRemoved from '@setup/react/assets/images/icons/account-removed.svg';
import stakedToken from '@setup/react/assets/images/icons/staked-token.svg';
import totalSupplyToken from '@setup/react/assets/images/icons/total-supply-token.svg';
import unpinnedIcon from '@setup/react/assets/images/icons/unpinned.svg';
import pinnedIcon from '@setup/react/assets/images/icons/pinned.svg';
import chainLinkIcon from '@setup/react/assets/images/icons/chain-link.svg';
import successCheckMark from '@setup/react/assets/images/icons/success-check-mark.svg';
import dropdownArrowIcon from '@setup/react/assets/images/icons/dropdown-arrow.svg';
import plusBlueIcon from '@setup/react/assets/images/icons/plus-blue.svg';
import plusWhiteIcon from '@setup/react/assets/images/icons/plus-white.svg';
import cautionFilledIcon from '@setup/react/assets/images/icons/caution-icon-filled.svg';
import cautionFilledIconDark from '@setup/react/assets/images/icons/caution-icon-filled-dark.svg';
import applicationsIcon from '@setup/react/assets/images/icons/applications-outline.svg';
import applicationsIconActive from '@setup/react/assets/images/icons/applications-filled.svg';
import dropdownFieldIcon from '@setup/react/assets/images/icons/drop-down-field-icon.svg';
import transferArrow from '@setup/react/assets/images/icons/transfer-arrow.svg';
import receivedTransactionIcon from '@setup/react/assets/images/icons/received_transaction_icon.svg';
import sentTransactionIcon from '@setup/react/assets/images/icons/sent_transaction_icon.svg';
import commissionIcon from '@setup/react/assets/images/icons/commission.svg';
import editActiveIcon from '@setup/react/assets/images/icons/editActive.svg';
import editDisabled from '@setup/react/assets/images/icons/edit-disabled.svg';
import hardwareWalletIcon from '@setup/react/assets/images/icons/hardware-wallet-icon.svg';

export const icons = {
  academy,
  academyActive,
  alertIcon,
  approved,
  arrowRightTailed,
  arrowLeft,
  arrowLeftActive,
  arrowLeftInactive,
  arrowLeftTailed,
  arrowLeftTailedDark,
  arrowRight,
  arrowRightActive,
  arrowRightInactive,
  arrowUpCircle,
  arrowRightCircle,
  arrowWhiteDown,
  balance,
  bookmarksIconEmptyState,
  calendar,
  calendarDark,
  checkboxFilled,
  checkboxCircleFilled,
  checkmarkBlue,
  consecutiveMissedBlocks,
  consecutiveMissedBlocksDark,
  copy,
  deleteIcon,
  discord,
  discordActive,
  discreetMode,
  discreetModeActive,
  feedback,
  feedbackActive,
  filePlain,
  fileOutline,
  generatedBlocks,
  generatedBlocksDark,
  reward,
  rewardDark,
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
  iconWarning,
  incoming,
  liskChat,
  liskLogo,
  liskLogoWhite,
  liskLogoWhiteNormalized,
  logout,
  logoutActive,
  lskIcon,
  okIcon,
  outgoing,
  pending,
  searchActive,
  searchSlim,
  search,
  settings,
  settingsActive,
  showPassphraseIcon,
  signIn,
  signInActive,
  star,
  starDark,
  tooltipQuestionMark,
  transactionError,
  transactionStatusSuccessful,
  transactionStatusPending,
  transactionStatusFailed,
  transactionSuccess,
  txDefault,
  txDefaultDark,
  registerValidator,
  registerValidatorDark,
  stake,
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
  warningIconBlue,
  warningRound,
  warningFolder,
  qrCode,
  qrCodeActive,
  copyActive,
  verifyWalletAddressActive,
  liskLogoDark,
  balanceDark,
  fileOutlineDark,
  signMessage,
  signMessageActive,
  verifyMessage,
  verifyMessageActive,
  iconEmptyRecentTransactionsDark,
  bookmarksIconEmptyStateDark,
  multiSignatureOutline,
  registerMultisignature,
  missedBlocks,
  missedBlocksDark,
  bookmark,
  bookmarkActive,
  toggleSidebar,
  toggleSidebarActive,
  darkMode,
  lightMode,
  blocksMonitor,
  blocksMonitorActive,
  walletsMonitor,
  walletsMonitorActive,
  transactions,
  transactionsDark,
  transactionsMonitor,
  transactionsMonitorActive,
  validatorsMonitor,
  validatorsMonitorActive,
  networkMonitor,
  networkMonitorActive,
  staking,
  stakingActive,
  signOut,
  plus,
  plusActive,
  plusWhiteIcon,
  profileOutline,
  remove,
  totalBlocks,
  totalBlocksDark,
  blocksGenerated,
  blocksGeneratedDark,
  distribution,
  clock,
  clockDark,
  clockActive,
  clockActiveDark,
  searchInput,
  searchFilter,
  weight,
  weightDark,
  validatorName,
  productivity,
  productivityDark,
  lock,
  unlock,
  loading,
  unlockToken,
  unlockTokenDark,
  stakingQueueInactive,
  stakingQueueActive,
  download,
  downloadBlue,
  upload,
  validatorGenerated,
  validatorGeneratedDark,
  validatorMissed,
  validatorMissedDark,
  validatorWarning,
  validatorAwaiting,
  validatorAwaitingDark,
  validatorActive,
  validatorStandby,
  validatorIneligible,
  validatorPunished,
  validatorBanned,
  validatorActiveDark,
  validatorStandbyDark,
  validatorIneligibleDark,
  validatorPunishedDark,
  validatorBannedDark,
  eyeActive,
  eyeInactive,
  liskIcon,
  initialiseIcon,
  initialiseRegistration,
  warningYellow,
  linkIcon,
  arrowRightWithStroke,
  arrowRightWithStrokeDark,
  multisignatureTransaction,
  multisignatureTransactionDark,
  refresh,
  refreshActive,
  reportValidatorMisbehavior,
  reportValidatorMisbehaviorDark,
  lockedBalance,
  lockedBalanceDark,
  downloadUpdateProgress,
  downloadUpdateFinish,
  whiteLinkIcon,
  personIcon,
  verticalDots,
  switchIcon,
  deleteRedIcon,
  secretPassphrase,
  accountUpload,
  accountRemoved,
  stakedToken,
  totalSupplyToken,
  unpinnedIcon,
  pinnedIcon,
  chainLinkIcon,
  applicationsIcon,
  applicationsIconActive,
  successCheckMark,
  dropdownArrowIcon,
  plusBlueIcon,
  cautionFilledIcon,
  cautionFilledIconDark,
  dropdownFieldIcon,
  removeBlueIcon,
  removeRed,
  transferArrow,
  receivedTransactionIcon,
  sentTransactionIcon,
  commissionIcon,
  editActiveIcon,
  editDisabled,
  arrowBlueRight,
  arrowBlueDown,
  multisigKeys,
  multisigKeysDark,
  hardwareWalletIcon,
};

const Icon = ({ name, noTheme, ...props }) => {
  const theme = useTheme();
  const src =
    theme === 'dark' && !noTheme && icons[`${name}Dark`] ? icons[`${name}Dark`] : icons[name];
  return <img src={src} alt={name} {...props} />;
};

Icon.propTypes = {
  name: PropTypes.oneOf(Object.keys(icons)).isRequired,
};

export default Icon;
