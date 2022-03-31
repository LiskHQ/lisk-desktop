import React from 'react'
import settingConstants from "@settings/configuration/settingConstants";
import Toggle from "./toggle";

function DiscreateModeToggle(){
    return ( 
        <Toggle
            setting={settingConstants.keys.discreetMode}
            icons={['toggleSidebarActive', 'toggleSidebar']}
            tips={[t('Collapse sidebar'), t('Expand sidebar')]}
        />
    )
}

export default DiscreateModeToggle