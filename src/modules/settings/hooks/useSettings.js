import { settingsUpdated } from 'src/modules/settings/store/actions';
import { selectSettings } from 'src/redux/selectors';
import { useDispatch, useSelector } from 'react-redux';

function useSettings(settingKey) {
  const dispatch = useDispatch();
  const value = useSelector(selectSettings)[settingKey];

  const toggleSetting = (settingValue) => {
    dispatch(settingsUpdated({ [settingKey]: settingValue || !value }));
  };

  const setValue = (settingValue) => {
    dispatch(settingsUpdated({ [settingKey]: settingValue }));
  };

  return { toggleSetting, setValue, [settingKey]: value };
}

export default useSettings;
