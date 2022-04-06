import React from 'react'
import settingConstants from "@settings/configuration/settingConstants";
import Toggle from "./toggle";

function SideBarToggle({ t }){
    return ( 
        <Toggle
            setting={settingConstants.keys.sideBarExpanded}
            icons={['toggleSidebarActive', 'toggleSidebar']}
            tips={[t('Collapse sidebar'), t('Expand sidebar')]}
        />
    )
}

export default SideBarToggle
