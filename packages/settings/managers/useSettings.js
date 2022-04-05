import { settingsUpdated } from '@settings/store/action';
import { useDispatch, useSelector } from 'react-redux';

function useSettings(settingKey) {
  const dispatch = useDispatch();
  const value = useSelector(state => state.settings[settingKey]);

  const toggleSetting = (settingValue) => {
    dispatch(settingsUpdated({ [settingKey]: settingValue || !value }));
  };

  return { toggleSetting, [settingKey]: value };
}

export default useSettings;
