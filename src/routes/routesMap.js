import AddBookmark from '@bookmark/manager/AddBookmarkManager';
import BlockDetails from '@block/manager/blockDetailsManager';
import Blocks from '@block/components/blocks';
import Bookmarks from '@bookmark/manager/BookmarkListManager';
import Dashboard from 'src/modules/common/components/dashboard';
import DelegatesMonitor from '@pos/validator/components/DelegatesMonitorView';
import DelegatesPerformanceModal from '@pos/validator/components/delegatePerformanceModal';
import HwWalletLogin from '@auth/components/hwWalletLogin';
import Login from '@auth/components/Signin';
import MonitorWallets from '@account/components/Accounts';
import MonitorNetwork from '@network/manager/networkManager';
import MonitorTransactions from '@transaction/components/Transactions';
import Register from '@auth/manager/SignupManager';
import RegisterValidator from '@pos/validator/manager/registerValidatorManager';
import Send from '@token/fungible/components/SendView';
import Settings from 'src/modules/settings/manager/SettingsManager';
import SignMessage from '@message/manager/signMessageManager';
import TermsOfUse from 'src/modules/common/components/TermsOfUse';
import Explorer from '@wallet/manager/explorerManager';
import AccountDetails from '@account/components/AccountDetails';
import TransactionDetails from '@transaction/manager/transactionDetailViewManager';
import VerifyMessage from '@message/manager/verifyMessageManager';
import Request from '@wallet/components/request';
import UnlockBalanceView from '@pos/validator/components/UnlockBalanceView';
import EditVote from '@pos/validator/manager/editVoteManager';
import VotingQueue from '@pos/validator/manager/votingQueueManager';
import DeviceDisconnect from 'src/modules/common/components/deviceDisconnectDialog';
import NewReleaseDialog from '@update/detail/info/newReleaseDialog';
import ReclaimBalance from '@legacy/manager/reclaimBalance';
import ReclaimBalanceModal from '@legacy/manager/reclaimBalanceModal';
import RegisterMultisig from '@wallet/manager/registerMultisigManager';
import SignMultiSig from '@wallet/manager/signMultisigManager';
import MultisigAccountDetails from '@wallet/manager/multisigAccountDetailsManager';
import ManageAccounts from '@account/components/ManageAccounts';
import AddAccountOptions from '@account/components/AddAccountOptions';
import AddAccountBySecretRecovery from '@account/components/AddAccountBySecretRecovery';
import AddAccountByFile from '@account/components/AddAccountByFile';
import AddAccountForm from '@account/components/AddAccountForm';
import SwitchAccount from '@account/components/SwitchAccount';
import EditAccount from '@account/components/EditAccount';
import BackupRecoveryPhraseFlow from '@account/components/BackupRecoveryPhraseFlow';
import RemoveSelectedAccountFlow from '@account/components/RemoveSelectedAccountFlow';
import BlockchainApplications from '@blockchainApplication/explore/components/BlockchainApplications/BlockchainApplications';
import BlockchainApplicationDetails from '@blockchainApplication/explore/components/BlockchainApplicationDetails';
import AddApplicationList from '@blockchainApplication/manage/components/AddApplicationList';
import AddApplicationSuccess from '@blockchainApplication/manage/components/AddApplicationSuccess';
import ApplicationManagementList from '@blockchainApplication/manage/components/ApplicationManagementList';
import SelectNode from '@blockchainApplication/manage/components/SelectNode';
import RemoveApplicationFlow from '@blockchainApplication/manage/components/RemoveApplicationFlow';
import AllTokens from '@wallet/components/AllTokens';
import DelegateProfile from 'src/modules/pos/validator/components/delegateProfile/delegateProfile';
import SentVotes from 'src/modules/pos/validator/components/SentVotes';
import ConnectionProposal from 'src/modules/blockchainApplication/connection/components/ConnectionProposal';
import SessionManager from '@blockchainApplication/connection/components/SessionManager';
import ConnectionSummary from 'src/modules/blockchainApplication/connection/components/ConnectionSummary';
import RequestView from '@blockchainApplication/connection/components/RequestView';
import ConnectionStatus from 'src/modules/blockchainApplication/connection/components/ConnectionStatus';

export default {
  wallet: AccountDetails,
  addAccount: Login,
  editAccount: EditAccount,
  explorer: Explorer,
  hwWallet: HwWalletLogin,
  register: Register,
  login: Login,
  termsOfUse: TermsOfUse,
  transactions: MonitorTransactions,
  blocks: Blocks,
  block: BlockDetails,
  wallets: MonitorWallets,
  network: MonitorNetwork,
  delegates: DelegatesMonitor,
  delegateProfile: DelegateProfile,
  delegatePerformance: DelegatesPerformanceModal,
  reclaim: ReclaimBalance,
  dashboard: Dashboard,
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
  editVote: EditVote,
  votingQueue: VotingQueue,
  deviceDisconnectDialog: DeviceDisconnect,
  reclaimBalance: ReclaimBalanceModal,
  multiSignature: RegisterMultisig,
  multisigAccountDetails: MultisigAccountDetails,
  signMultiSignTransaction: SignMultiSig,
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
  manageApplications: ApplicationManagementList,
  removeApplicationFlow: RemoveApplicationFlow,
  allTokens: AllTokens,
  sentVotes: SentVotes,
  connectionProposal: ConnectionProposal,
  sessionManager: SessionManager,
  requestView: RequestView,
  connectionSummary: ConnectionSummary,
  connectionStatus: ConnectionStatus,
};
