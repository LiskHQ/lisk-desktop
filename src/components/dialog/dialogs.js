import i18next from 'i18next';
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

export default () => ({
  send: {
    title: i18next.t('Send'),
    component: Send,
  },
  'register-delegate': {
    title: i18next.t('Register as delegate'),
    component: RegisterDelegate,
  },
  'sign-message': {
    title: i18next.t('Sign message'),
    component: SignMessage,
  },
  'verify-message': {
    title: i18next.t('Verify message'),
    component: VerifyMessage,
  },
  'register-second-passphrase': {
    title: i18next.t('Register Second Passphrase'),
    component: SecondPassphrase,
  },
  vote: {
    title: i18next.t('Vote for delegates'),
    component: VoteDialog,
  },
  receive: {
    title: i18next.t('Receive LSK'),
    component: ReceiveDialog,
  },
  register: {
    title: i18next.t('New Account'),
    component: Register,
  },
  'save-account': {
    title: i18next.t('Remember this account'),
    component: SaveAccount,
  },
  settings: {
    title: i18next.t('Settings'),
    component: Settings,
  },
});
