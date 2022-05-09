import React from 'react';
import { useTranslation } from 'react-i18next';
import settingConstants from 'src/modules/settings/const/settingConstants';
import Toggle from './toggle';

function LightDarkToggle() {
  const { t } = useTranslation();

  return (
    <Toggle
      setting={settingConstants.keys.darkMode}
      icons={['lightMode', 'darkMode']}
      tips={[t('Disable dark mode'), t('Enable dark mode')]}
    />
  );
}

export default LightDarkToggle;
