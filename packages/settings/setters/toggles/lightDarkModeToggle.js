import React from 'react'
import settingConstants from "@settings/configuration/settingConstants";
import Toggle from "./toggle";

function LightDarkToggle({ t }) {
    return (
        <Toggle
          setting={settingConstants.keys.darkMode}
          icons={['lightMode', 'darkMode']}
          tips={[t('Disable dark mode'), t('Enable dark mode')]}
        />
    )
}

export default LightDarkToggle;