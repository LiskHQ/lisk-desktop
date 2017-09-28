import ReceiveDialog from '../receiveDialog';
import Register from '../register';
import RegisterDelegate from '../registerDelegate';
import SaveAccount from '../saveAccount';
import SecondPassphrase from '../secondPassphrase';
import Send from '../send';
import Settings from '../settings';
import SignMessage from '../signMessage';
import VerifyMessage from '../verifyMessage';
import VoteDialog from '../voteDialog';

export default {
  send: {
    title: 'Send',
    component: Send,
  },
  'register-delegate': {
    title: 'Register as delegate',
    component: RegisterDelegate,
  },
  'sign-message': {
    title: 'Sign message',
    component: SignMessage,
  },
  'verify-message': {
    title: 'Verify message',
    component: VerifyMessage,
  },
  'register-second-passphrase': {
    title: 'Register Second Passphrase',
    component: SecondPassphrase,
  },
  vote: {
    title: 'Vote for delegates',
    component: VoteDialog,
  },
  receive: {
    title: 'Receive LSK',
    component: ReceiveDialog,
  },
  register: {
    title: 'New Account',
    component: Register,
  },
  'save-account': {
    title: 'Remember this account',
    component: SaveAccount,
  },
  settings: {
    title: 'Settings',
    component: Settings,
  },
};
