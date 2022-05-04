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
import RegisterDelegate from '@screens/managers/registerDelegate';
import Send from '@screens/managers/send';
import Settings from '@screens/managers/settings';
import SignMessage from '@message/manager/signMessageManager';
import TermsOfUse from 'src/modules/common/components/TermsOfUse';
import Explorer from '@wallet/manager/explorerManager';
import AccountDetails from '@account/components/AccountDetails';
// import TransactionDetailsModal from '@screens/managers/transactionDetailsModal';
import VerifyMessage from '@message/manager/verifyMessageManager';
import Request from '@screens/managers/request';
import LockedBalance from '@token/fungible/components/LockedBalance';
import EditVote from '@screens/managers/editVote';
import VotingQueue from '@screens/managers/votingQueue';
import DeviceDisconnect from '@screens/managers/deviceDisconnectDialog';
import NewReleaseDialog from '@update/detail/info/newReleaseDialog';
import SearchBar from '@search/components/SearchBar';
import ReclaimBalance from '@legacy/manager/reclaimBalance';
import ReclaimBalanceModal from '@legacy/manager/reclaimBalanceModal';
import MultiSignature from '@screens/managers/multiSignature';
import SignMultiSigTransaction from '@screens/managers/signMultiSignTransaction';
import MultisigAccountDetails from '@wallet/manager/multisigAccountDetailsManager';

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
  // transactionDetails: TransactionDetailsModal,
  newRelease: NewReleaseDialog,
  request: Request,
  lockedBalance: LockedBalance,
  editVote: EditVote,
  votingQueue: VotingQueue,
  deviceDisconnectDialog: DeviceDisconnect,
  reclaimBalance: ReclaimBalanceModal,
  multiSignature: MultiSignature,
  multisigAccountDetails: MultisigAccountDetails,
  signMultiSignTransaction: SignMultiSigTransaction,
};
