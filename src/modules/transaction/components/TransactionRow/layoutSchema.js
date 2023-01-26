import {
  ID,
  Height,
  Sender,
  Counterpart,
  Date,
  Amount,
  Type,
  Params,
  Status,
  ValidatorDetails,
  Round,
  Fee,
} from './components';
import styles from './schemas.css';

const hosted = [ID, Height, Type, Date, Fee, Status];
const full = [ID, Sender, Height, Type, Date, Status];
const minimal = [Counterpart, Amount];
const stake = [ValidatorDetails, Date, Round, Params];

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
  stake: {
    components: stake,
    className: styles.stakeLayout,
  },
  default: {
    components: full,
    className: styles.generalLayout,
  },
};

export default LayoutSchema;
