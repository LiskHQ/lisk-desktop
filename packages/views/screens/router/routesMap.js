import AddBookmark from '@bookmark/manager/AddBookmarkManager';
import BlockDetails from '@block/manager/blockDetailsManager';
import Blocks from '@block/manager/blocksManager';
import Bookmarks from '@bookmark/manager/BookmarkListManager';
import Dashboard from '@screens/managers/dashboard';
import DelegatesMonitor from '@screens/managers/monitor/delegates';
import DelegatesPerformanceModal from '@screens/managers/wallet/delegatePerformanceModal';
import HwWalletLogin from '@screens/managers/hwWalletLogin';
import Login from '@auth/components/Signin';
import MonitorWallets from '@account/manager/AccountsManager';
import MonitorNetwork from '@network/manager/networkManager';
import MonitorTransactions from '@screens/managers/monitor/transactions';
import Register from '@auth/manager/SignupManager';
import RegisterDelegate from '@dpos/validator/manager/registerDelegateManager';
import Send from '@screens/managers/send';
import Settings from 'src/modules/settings/manager/SettingsManager';
import SignMessage from '@message/manager/signMessageManager';
import TermsOfUse from 'src/modules/common/components/TermsOfUse';
import Explorer from '@wallet/manager/explorerManager';
import AccountDetails from '@account/components/AccountDetails';
import TransactionDetailsModal from '@transaction/manager/transactionDetailViewManager';
import VerifyMessage from '@message/manager/verifyMessageManager';
import Request from '@screens/managers/request';
import UnlockBalanceView from '@dpos/validator/components/unlockBalanceView';
import EditVote from '@dpos/validator/manager/editVoteManager';
import VotingQueue from '@dpos/validator/manager/votingQueueManager';
import DeviceDisconnect from '@screens/managers/deviceDisconnectDialog';
import NewReleaseDialog from '@update/detail/info/newReleaseDialog';
import SearchBar from '@search/components/SearchBar';
import ReclaimBalance from '@legacy/manager/reclaimBalance';
import ReclaimBalanceModal from '@legacy/manager/reclaimBalanceModal';
import RegisterMultisig from '@wallet/manager/registerMultisigManager';
import SignMultiSig from '@wallet/manager/signMultisigManager';
import MultisigAccountDetails from '@wallet/manager/multisigAccountDetailsManager';
import ManageAccounts from '@account/components/ManageAccounts';
import AddAccountOptions from '@account/components/AddAccountOptions';
import AddAccountBySecretRecovery from 'src/modules/account/components/AddAccountBySecretRecovery';
import AddAccountForm from '@account/components/AddAccountForm';

export default {
  wallet: AccountDetails,
  addAccount: Login,
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
  delegatePerformance: DelegatesPerformanceModal,
  reclaim: ReclaimBalance,
  dashboard: Dashboard,
  addBookmark: AddBookmark,
  bookmarks: Bookmarks,
  send: Send,
  settings: Settings,
  signMessage: SignMessage,
  verifyMessage: VerifyMessage,
  registerDelegate: RegisterDelegate,
  search: SearchBar,
  transactionDetails: TransactionDetailsModal,
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
};
