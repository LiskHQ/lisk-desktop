import { VALIDATOR_COMMISSION_DIVISOR } from '../consts/validators';

export const extractValidatorCommission = (commission) => commission / VALIDATOR_COMMISSION_DIVISOR;
