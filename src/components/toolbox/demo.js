import React from 'react';
import BoxV2Demo from '../boxV2/demo';
import CheckBoxDemo from './checkBox/demo';
import IllustrationDemo from './illustration/demo';
import IconDemo from './icon/demo';
import TooltipDemo from './tooltip/demo';

const ToolboxDemo = () => (
  <React.Fragment>
    <BoxV2Demo/>
    <CheckBoxDemo/>
    <IconDemo/>
    <IllustrationDemo/>
    <TooltipDemo/>
  </React.Fragment>
);

export default ToolboxDemo;
