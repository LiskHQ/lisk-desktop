import AddBookmark from '@screens/managers/bookmarks/addBookmark';
import BlockDetails from '@screens/managers/monitor/blockDetails';
import Blocks from '@screens/managers/monitor/blocks';
import Bookmarks from '@screens/managers/bookmarks/list';
import Dashboard from '@screens/managers/dashboard';
import DelegatesMonitor from '@screens/managers/monitor/delegates';
import DelegatesPerformanceModal from '@screens/managers/wallet/delegatePerformanceModal';
import HwWalletLogin from '@screens/managers/hwWalletLogin';
import Login from '@screens/managers/login';
import MonitorAccounts from '@screens/managers/monitor/accounts';
import MonitorNetwork from '@screens/managers/monitor/network';
import MonitorTransactions from '@screens/managers/monitor/transactions';
import Register from '@screens/managers/register';
import RegisterDelegate from '@screens/managers/registerDelegate';
import Send from '@screens/managers/send';
import Settings from '@screens/managers/settings';
import SignMessage from '@screens/managers/signMessage';
import TermsOfUse from '@screens/managers/termsOfUse';
import Wallet from '@screens/managers/wallet';
import Explorer from '@screens/managers/wallet/explorer';
import TransactionDetailsModal from '@screens/managers/transactionDetailsModal';
import VerifyMessage from '@screens/managers/verifyMessage';
import Request from '@screens/managers/request';
import LockedBalance from '@screens/managers/lockedBalance';
import EditVote from '@screens/managers/editVote';
import VotingQueue from '@screens/managers/votingQueue';
import DeviceDisconnect from '@screens/managers/deviceDisconnectDialog';
import NewReleaseDialog from '@shared/newReleaseDialog';
import SearchBar from '@shared/searchBar';
import ReclaimBalance from '@screens/managers/reclaimBalance';
import ReclaimBalanceModal from '@screens/managers/reclaimBalance/modal';
import MultiSignature from '@screens/managers/multiSignature';
import SignMultiSigTransaction from '@screens/managers/signMultiSignTransaction';
import MultisigAccountDetails from '@screens/managers/multisigAccountDetails';

export default {
  wallet: Wallet,
  addAccount: Login,
  account: Explorer,
  hwWallet: HwWalletLogin,
  register: Register,
  login: Login,
  termsOfUse: TermsOfUse,
  transactions: MonitorTransactions,
  blocks: Blocks,
  block: BlockDetails,
  accounts: MonitorAccounts,
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
  lockedBalance: LockedBalance,
  editVote: EditVote,
  votingQueue: VotingQueue,
  deviceDisconnectDialog: DeviceDisconnect,
  reclaimBalance: ReclaimBalanceModal,
  multiSignature: MultiSignature,
  multisigAccountDetails: MultisigAccountDetails,
  signMultiSignTransaction: SignMultiSigTransaction,
};
