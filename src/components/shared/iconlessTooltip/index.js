import React from 'react';
import Tooltip from '../../toolbox/tooltip/tooltip';

const IconlessTooltip = ({
  children, tooltipContent, ...props
}) => (
  <Tooltip
    content={children}
    {...props}
  >
    {tooltipContent}
  </Tooltip>
);

export default IconlessTooltip;
