import React from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Piwik from 'src/utils/piwik';
import CheckBox from 'src/theme/CheckBox';
import Tooltip from 'src/theme/Tooltip';
import Icon from 'src/theme/Icon';
import styles from '@shared/navigationBars/topBar/topBar.css';
import useSettings from '../hooks/useSettings';
/**
 * Toggles boolean values on store.settings
 *
 * @param {String} setting The key to update in store.settings
 * @param {Array} icons [activeIconName, normalIconName]
 * @param {Array} tips [activeTip, normalTip]
 * @param {boolean} isCheckbox show checkbox or tooltip
 */
const Toggle = ({
  setting, icons, tips, isCheckbox,
}) => {
  const { t } = useTranslation();
  const { toggleSetting, [setting]: value } = useSettings(setting);

  const toggle = () => { toggleSetting(!value); };

  const handleCheckboxChange = () => {
    Piwik.trackingEvent('Settings', 'button', 'Update settings');
    toggleSetting(value?.setting);
    toast(t('Settings saved!'));
  };

  return isCheckbox ? (
    <CheckBox
      name={setting}
      className={`${styles.checkbox} ${setting}`}
      checked={value}
      onChange={handleCheckboxChange}
    />
  ) : (
    <Tooltip
      className={styles.tooltipWrapper}
      size="maxContent"
      position="bottom"
      content={(
        <Icon
          name={value ? icons[0] : icons[1]}
          className={styles.toggle}
          onClick={toggle}
        />
      )}
    >
      <p>{value ? tips[0] : tips[1]}</p>
    </Tooltip>
  );
};

Toggle.defaultProps = {
  isChecked: false,
};

export default Toggle;
