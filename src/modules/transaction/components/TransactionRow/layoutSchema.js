import {
  Sender, Recipient, Counterpart,
  Date, Amount, Fee, Assets, Status,
} from './components';
import styles from './schemas.css';

const hosted = [Counterpart, Date, Fee, Assets, Amount];
const full = [Sender, Recipient, Date, Amount, Fee, Status];
const minimal = [Counterpart, Amount];

const LayoutSchema = {
  full: {
    components: full,
    className: styles.fullLayout,
  },
  hosted: {
    components: hosted,
    className: styles.hostedLayout,
  },
  minimal: {
    components: minimal,
    className: styles.minimalLayout,
  },
  default: {
    components: full,
    className: styles.generalLayout,
  },
};

export default LayoutSchema;
