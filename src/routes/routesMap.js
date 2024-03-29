import AddBookmark from '@bookmark/manager/AddBookmarkManager';
import BlockDetails from '@block/manager/blockDetailsManager';
import Blocks from '@block/components/blocks';
import Bookmarks from '@bookmark/manager/BookmarkListManager';
import ValidatorsMonitor from '@pos/validator/components/ValidatorsMonitorView';
import ValidatorPerformanceModal from '@pos/validator/components/ValidatorPerformanceModal';
import MonitorWallets from '@account/components/Accounts';
import MonitorNetwork from '@network/manager/networkManager';
import MonitorTransactions from '@transaction/components/Transactions';
import Register from '@auth/manager/SignupManager';
import RegisterValidator from '@pos/validator/manager/registerValidatorManager';
import Send from '@token/fungible/components/SendView';
import Settings from 'src/modules/settings/manager/SettingsManager';
import SignMessage from '@message/manager/signMessageManager';
import TermsOfUse from '@common/components/TermsOfUse';
import Explorer from '@wallet/manager/explorerManager';
import AccountOverviewDetails from '@account/components/AccountDetails';
import TransactionDetails from '@transaction/manager/transactionDetailViewManager';
import VerifyMessage from '@message/manager/verifyMessageManager';
import Request from '@wallet/components/request';
import UnlockBalanceView from '@pos/validator/components/UnlockBalanceView';
import ClaimRewardsView from '@pos/validator/components/ClaimRewardsView';
import editStakeManager from '@pos/validator/manager/editStakeManager';
import StakingQueue from '@pos/validator/manager/stakingQueueManager';
import ConfirmationDialog from '@common/components/ConfirmationDialog';
import { ChangeCommissionDialog } from '@pos/validator/components/ChangeCommission/Dialog';
import CommissionHistory from '@pos/validator/components/CommissionHistory';
import NewReleaseDialog from '@update/detail/info/newReleaseDialog';
import ReclaimBalance from '@legacy/manager/reclaimBalance';
import ReclaimBalanceModal from '@legacy/manager/reclaimBalanceModal';
import RegisterMultisig from '@wallet/manager/registerMultisigManager';
import SignMultiSig from '@wallet/manager/signMultisigManager';
import AccountDetails from '@wallet/components/AccountDetails';
import ManageAccounts from '@account/components/ManageAccounts';
import AddAccountOptions from '@account/components/AddAccountOptions';
import AddAccountBySecretRecovery from '@account/components/AddAccountBySecretRecovery';
import AddAccountByFile from '@account/components/AddAccountByFile';
import AddAccountForm from '@account/components/AddAccountForm';
import SwitchAccount from '@account/components/SwitchAccount';
import BackupRecoveryPhraseFlow from '@account/components/BackupRecoveryPhraseFlow';
import RemoveSelectedAccountFlow from '@account/components/RemoveSelectedAccountFlow';
import BlockchainApplications from '@blockchainApplication/explore/components/BlockchainApplications/BlockchainApplications';
import BlockchainApplicationDetails from '@blockchainApplication/explore/components/BlockchainApplicationDetails';
import AddApplicationList from '@blockchainApplication/manage/components/AddApplicationList';
import AddApplicationSuccess from '@blockchainApplication/manage/components/AddApplicationSuccess';
import NetworkApplicationDropDownButton from '@blockchainApplication/manage/components/DialogNetworkApplicationSelector';
import DialogAddNetwork from '@network/components/DialogAddNetwork';
import DialogRemoveNetwork from '@network/components/DialogRemoveNetwork';
import SelectNode from '@blockchainApplication/manage/components/SelectNode';
import RemoveApplicationFlow from '@blockchainApplication/manage/components/RemoveApplicationFlow';
import AllTokens from '@wallet/components/AllTokens';
import ValidatorProfile from 'src/modules/pos/validator/components/ValidatorProfile/ValidatorProfile';
import SentStakes from 'src/modules/pos/validator/components/SentStakes';
import ConnectionProposal from 'src/modules/blockchainApplication/connection/components/ConnectionProposal';
import SessionManager from '@blockchainApplication/connection/components/SessionManager';
import ConnectionSummary from 'src/modules/blockchainApplication/connection/components/ConnectionSummary';
import RequestView from '@blockchainApplication/connection/components/RequestView';
import RequestSignMessageDialog from '@blockchainApplication/connection/components/RequestSignMessageDialog';
import ConnectionStatus from 'src/modules/blockchainApplication/connection/components/ConnectionStatus';
import SelectHardwareDeviceModal from '@hardwareWallet/components/SelectHardwareDeviceModal';
import HardwareAccountManagerModal from '@hardwareWallet/components/HardwareAccountManagerModal';
import { NoTokenBalanceDialog } from 'src/modules/token/fungible/components/NoTokenBalanceDialog';
import NoAccountDialog from '@token/fungible/components/NoTokenBalanceDialog/NoAccountsDialog';

export default {
  wallet: AccountOverviewDetails,
  explorer: Explorer,
  register: Register,
  termsOfUse: TermsOfUse,
  transactions: MonitorTransactions,
  blocks: Blocks,
  block: BlockDetails,
  wallets: MonitorWallets,
  network: MonitorNetwork,
  validators: ValidatorsMonitor,
  validatorProfile: ValidatorProfile,
  validatorPerformance: ValidatorPerformanceModal,
  reclaim: ReclaimBalance,
  addBookmark: AddBookmark,
  bookmarks: Bookmarks,
  send: Send,
  settings: Settings,
  signMessage: SignMessage,
  verifyMessage: VerifyMessage,
  registerValidator: RegisterValidator,
  transactionDetails: TransactionDetails,
  newRelease: NewReleaseDialog,
  request: Request,
  lockedBalance: UnlockBalanceView,
  claimRewardsView: ClaimRewardsView,
  editStake: editStakeManager,
  selectHardwareDeviceModal: SelectHardwareDeviceModal,
  hardwareAccountManagerModal: HardwareAccountManagerModal,
  stakingQueue: StakingQueue,
  confirmationDialog: ConfirmationDialog,
  reclaimBalance: ReclaimBalanceModal,
  multiSignature: RegisterMultisig,
  signMultiSignTransaction: SignMultiSig,
  accountDetails: AccountDetails,
  manageAccounts: ManageAccounts,
  addAccountOptions: AddAccountOptions,
  accountAdd: AddAccountForm,
  addAccountBySecretRecovery: AddAccountBySecretRecovery,
  switchAccount: SwitchAccount,
  selectNode: SelectNode,
  backupRecoveryPhraseFlow: BackupRecoveryPhraseFlow,
  removeSelectedAccount: RemoveSelectedAccountFlow,
  addAccountByFile: AddAccountByFile,
  blockchainApplications: BlockchainApplications,
  blockChainApplicationDetails: BlockchainApplicationDetails,
  addApplicationList: AddApplicationList,
  addApplicationSuccess: AddApplicationSuccess,
  manageApplications: NetworkApplicationDropDownButton,
  removeApplicationFlow: RemoveApplicationFlow,
  allTokens: AllTokens,
  sentStakes: SentStakes,
  connectionProposal: ConnectionProposal,
  sessionManager: SessionManager,
  requestView: RequestView,
  requestSignMessageDialog: RequestSignMessageDialog,
  connectionSummary: ConnectionSummary,
  connectionStatus: ConnectionStatus,
  changeCommission: ChangeCommissionDialog,
  commissionHistory: CommissionHistory,
  dialogAddNetwork: DialogAddNetwork,
  dialogRemoveNetwork: DialogRemoveNetwork,
  noTokenBalance: NoTokenBalanceDialog,
  NoAccountView: NoAccountDialog,
};
