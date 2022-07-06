import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentApplication } from '../store/selectors';
import { setCurrentApplication } from '../store/action';

// eslint-disable-next-line import/prefer-default-export
export function useCurrentApplication() {
  const dispatch = useDispatch();
  const currentApplication = useSelector(selectCurrentApplication);
  const setApplication = useCallback(
    (application) => dispatch(setCurrentApplication(application)),
    [],
  );
  return [currentApplication, setApplication];
}
