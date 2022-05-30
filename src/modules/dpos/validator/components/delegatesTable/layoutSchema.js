import {
  DelegateWeight,
  DelegateDetails,
  RoundState,
  DelegateStatus,
  ForgingTime,
  DelegateRank,
} from './dataColumns';
import styles from './schemas.css';

const minimal = [DelegateDetails, DelegateStatus];
const hosted = [DelegateDetails, DelegateWeight];
const full = [DelegateDetails, DelegateWeight, DelegateRank, ForgingTime, RoundState];

const LayoutSchema = {
  active: {
    components: full,
    className: styles.fullLayout,
  },
  standBy: {
    components: [...hosted, DelegateRank, DelegateStatus],
    className: styles.standbyLayout,
  },
  sanctioned: {
    components: minimal,
    className: styles.sanctionedLayout,
  },
  watched: {
    components: [...full, DelegateRank],
    className: styles.hostedLayout,
  },
  default: {
    components: full,
    className: styles.generalLayout,
  },
};

export default LayoutSchema;
