import {
  ID, Height, Sender, Counterpart,
  Date, Amount, Fee, Type, Params, Status, DelegateDetails,
} from './components';
import styles from './schemas.css';

const hosted = [Counterpart, Date, Fee, Params, Amount];
const full = [ID, Sender, Height, Type, Date, Status];
const minimal = [Counterpart, Amount];
const vote = [DelegateDetails, Date, Height, Params];

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
  vote: {
    components: vote,
    className: styles.voteLayout,
  },
  default: {
    components: full,
    className: styles.generalLayout,
  },
};

export default LayoutSchema;
