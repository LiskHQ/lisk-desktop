import { useSelector } from 'react-redux';
import { selectActiveHardwareDevice } from '../store/selectors/hwSelectors';

export const useHWStatus = () => useSelector(selectActiveHardwareDevice);

