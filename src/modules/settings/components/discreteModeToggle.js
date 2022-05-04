import React from 'react';
import { useTranslation } from 'react-i18next';
import settingConstants from 'src/modules/settings/const/settingConstants';
import Toggle from './toggle';

function DiscreteModeToggle() {
  const { t } = useTranslation();

  return (
    <Toggle
      setting={settingConstants.keys.discreetMode}
      icons={['discreetModeActive', 'discreetMode']}
      tips={[t('Disable discreet mode'), t('Enable discreet mode')]}
    />
  );
}

export default DiscreteModeToggle;
