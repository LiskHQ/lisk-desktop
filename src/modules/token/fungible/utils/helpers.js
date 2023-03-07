import liskLogo from '../../../../../setup/react/assets/images/LISK.png';

export const getLogo = ({ logo }) => logo?.svg || logo?.png || liskLogo;
