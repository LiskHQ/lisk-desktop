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
  standby: {
    components: [...hosted, DelegateRank, DelegateStatus],
    className: styles.standbyLayout,
  },
  sanctioned: {
    components: minimal,
    className: styles.sanctionedLayout,
  },
  watched: {
    components: [...full, DelegateStatus],
    className: styles.watchedLayout,
  },
  default: {
    components: full,
    className: styles.generalLayout,
  },
};

export default LayoutSchema;
