import React from 'react';
import { toast } from 'react-toastify';
import useSettings from '@settings/managers/useSettings';
import Piwik from '@common/utilities/piwik';
import CheckBox from '@basics/inputs/checkBox';
import Tooltip from '@basics/tooltip/tooltip';
import Icon from '@basics/icon';
import styles from '@shared/navigationBars/topBar/topBar.css';
/**
 * Toggles boolean values on store.settings
 *
 * @param {String} setting The key to update in store.settings
 * @param {Array} icons [activeIconName, normalIconName]
 * @param {Array} tips [activeTip, normalTip]
 * @param {boolean} isCheckbox show checkbox or tooltip
 */
const Toggle = ({
  setting, icons, tips, isCheckbox, t,
}) => {
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

export default Toggle;
