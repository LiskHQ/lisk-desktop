import React from 'react';
import { useTranslation } from 'react-i18next';
import settingConstants from '@settings/configuration/settingConstants';
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
