import AddBookmark from '@bookmark/manager/AddBookmarkManager';
import BlockDetails from '@block/manager/blockDetailsManager';
import Blocks from '@block/manager/blocksManager';
import Bookmarks from '@bookmark/manager/BookmarkListManager';
import Dashboard from '@screens/managers/dashboard';
import DelegatesMonitor from '@screens/managers/monitor/delegates';
import DelegatesPerformanceModal from '@screens/managers/wallet/delegatePerformanceModal';
import HwWalletLogin from '@screens/managers/hwWalletLogin';
import Login from 'src/modules/auth/components/Signin';
import MonitorWallets from 'src/modules/account/components/Accounts';
import MonitorNetwork from '@screens/managers/network';
import MonitorTransactions from '@screens/managers/monitor/transactions';
import Register from 'src/modules/auth/manager/SignupManager';
import RegisterDelegate from '@screens/managers/registerDelegate';
import Send from '@screens/managers/send';
import Settings from '@screens/managers/settings';
import SignMessage from '@screens/managers/signMessage';
import TermsOfUse from '@screens/managers/termsOfUse';
import Wallet from '@screens/managers/wallet';
import Explorer from '@screens/managers/wallet/explorer';
// import TransactionDetailsModal from '@screens/managers/transactionDetailsModal';
import VerifyMessage from '@screens/managers/verifyMessage';
import Request from '@screens/managers/request';
import LockedBalance from '@screens/managers/lockedBalance';
import EditVote from '@screens/managers/editVote';
import VotingQueue from '@screens/managers/votingQueue';
import DeviceDisconnect from '@screens/managers/deviceDisconnectDialog';
import NewReleaseDialog from '@updater/detail/info/newReleaseDialog';
import SearchBar from '@shared/searchBar';
import ReclaimBalance from '@legacy/manager/reclaimBalance';
import ReclaimBalanceModal from '@legacy/manager/reclaimBalanceModal';
import MultiSignature from '@screens/managers/multiSignature';
import SignMultiSigTransaction from '@screens/managers/signMultiSignTransaction';
import MultisigAccountDetails from '@screens/managers/multisigAccountDetails';

export default {
  wallet: Wallet,
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
