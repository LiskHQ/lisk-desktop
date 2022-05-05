import AddBookmark from '@bookmark/manager/AddBookmarkManager';
import BlockDetails from '@block/manager/blockDetailsManager';
import Blocks from '@block/manager/blocksManager';
import Bookmarks from '@bookmark/manager/BookmarkListManager';
import Dashboard from 'src/modules/common/components/dashboard';
import DelegatesMonitor from '@dpos/validator/components/delegates';
import DelegatesPerformanceModal from '@dpos/validator/components/delegatePerformanceModal';
import HwWalletLogin from '@wallet/components/hwWallet/hwWalletLogin';
import Login from '@auth/components/Signin';
import MonitorWallets from '@account/manager/AccountsManager';
import MonitorNetwork from '@network/manager/networkManager';
import MonitorTransactions from '@transaction/components/transactions';
import Register from '@auth/manager/SignupManager';
import RegisterDelegate from '@dpos/validator/components/registerDelegate';
import Send from '@wallet/components/send';
import Settings from 'src/modules/settings/manager/SettingsManager';
import SignMessage from '@message/manager/signMessageManager';
import TermsOfUse from 'src/modules/common/components/TermsOfUse';
import Explorer from '@wallet/manager/explorerManager';
import AccountDetails from '@account/components/AccountDetails';
// import TransactionDetailsModal from '@screens/managers/transactionDetailsModal';
import VerifyMessage from '@message/manager/verifyMessageManager';
import Request from '@wallet/components/request';
import LockedBalance from '@token/fungible/components/LockedBalance';
import EditVote from '@screens/managers/editVote';
import VotingQueue from '@dpos/validator/components/votingQueue';
import DeviceDisconnect from '@wallet/components/hwWallet/deviceDisconnectDialog';
import NewReleaseDialog from '@update/detail/info/newReleaseDialog';
import SearchBar from '@search/components/SearchBar';
import ReclaimBalance from '@legacy/manager/reclaimBalance';
import ReclaimBalanceModal from '@legacy/manager/reclaimBalanceModal';
import MultiSignature from '@screens/managers/multiSignature';
import SignMultiSigTransaction from '@transaction/components/signMultiSignTransaction';
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
