import {
  ValidatorWeight,
  ValidatorCommission,
  ValidatorDetails,
  RoundState,
  ValidatorStatus,
  GeneratingTime,
  ValidatorRank,
} from './DataColumns';
import styles from './Schemas.css';

const minimal = [ValidatorDetails, ValidatorStatus];
const hosted = [ValidatorDetails, ValidatorWeight, ValidatorCommission];
const full = [ValidatorDetails, ValidatorWeight, ValidatorCommission, ValidatorRank, GeneratingTime, RoundState];

const LayoutSchema = {
  active: {
    components: full,
    className: styles.fullLayout,
  },
  standby: {
    components: [...hosted, ValidatorRank, ValidatorStatus],
    className: styles.standbyLayout,
  },
  sanctioned: {
    components: minimal,
    className: styles.sanctionedLayout,
  },
  watched: {
    components: [...full, ValidatorStatus],
    className: styles.watchedLayout,
  },
  default: {
    components: full,
    className: styles.generalLayout,
  },
};

export default LayoutSchema;
