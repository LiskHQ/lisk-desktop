import {
  DelegateWeight,
  DelegateDetails,
  RoundState,
  DelegateStatus,
  ForgingTime,
  DelegateRank,
} from './dataColumns';
import styles from './schemas.css';

const basic = [DelegateDetails];
const minimal = [...basic, DelegateStatus];
const hosted = [...basic, DelegateWeight];
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
