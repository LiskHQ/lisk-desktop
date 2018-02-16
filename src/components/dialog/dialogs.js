import i18next from 'i18next';
import RegisterDelegate from '../registerDelegate';
import SavedAccounts from '../savedAccounts';
import savedAccountsTheme from '../savedAccounts/modalTheme.css';
import SecondPassphrase from '../secondPassphrase';
import Send from '../sendWritable';
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
  'register-second-passphrase': {
    title: i18next.t('Register Second Passphrase'),
    component: SecondPassphrase,
  },
  vote: {
    title: i18next.t('Vote for delegates'),
    component: VoteDialog,
  },
  'saved-accounts': {
    component: SavedAccounts,
    theme: savedAccountsTheme,
  },
});
