import Send from '../send';
import RegisterDelegate from '../registerDelegate';
import SignMessage from '../signMessage';
import VerifyMessage from '../verifyMessage';
import SecondPassphrase from '../secondPassphrase';
import VoteDialog from '../voteDialog';
import ReceiveDialog from '../receiveDialog';

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
};
