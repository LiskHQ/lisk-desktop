import AddBookmark from '@screens/bookmarks/addBookmark';
import BlockDetails from '@screens/monitor/blockDetails';
import Blocks from '@screens/monitor/blocks';
import Bookmarks from '@screens/bookmarks/list';
import Dashboard from '@screens/dashboard';
import DelegatesMonitor from '@screens/monitor/delegates';
import DelegatesPerformanceModal from '@screens/wallet/delegatePerformanceModal';
import HwWalletLogin from '@screens/hwWalletLogin';
import Login from '@screens/login';
import MonitorAccounts from '@screens/monitor/accounts';
import MonitorNetwork from '@screens/monitor/network';
import MonitorTransactions from '@screens/monitor/transactions';
import Register from '@screens/register';
import RegisterDelegate from '@screens/registerDelegate';
import Send from '@screens/send';
import Settings from '@screens/settings';
import SignMessage from '@screens/signMessage';
import TermsOfUse from '@screens/termsOfUse';
import Wallet from '@screens/wallet';
import Explorer from '@screens/wallet/explorer';
import TransactionDetailsModal from '@screens/transactionDetailsModal';
import VerifyMessage from '@screens/verifyMessage';
import Request from '@screens/request';
import LockedBalance from '@screens/lockedBalance';
import EditVote from '@screens/editVote';
import VotingQueue from '@screens/votingQueue';
import DeviceDisconnect from '@screens/deviceDisconnectDialog';
import NewReleaseDialog from '@shared/newReleaseDialog';
import SearchBar from '@shared/searchBar';
import ReclaimBalance from '@screens/reclaimBalance';
import ReclaimBalanceModal from '@screens/reclaimBalance/modal';
import MultiSignature from '@screens/multiSignature';
import SignMultiSigTransaction from '@screens/signMultiSignTransaction';
import MultisigAccountDetails from '@screens/multisigAccountDetails';

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
