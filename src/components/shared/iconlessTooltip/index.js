import React from 'react';
import Tooltip from '../../toolbox/tooltip/tooltip';

const IconlessTooltip = ({
  children, title, tooltipContent, className,
}) => (
  <Tooltip
    content={children}
    title={title}
    className={className}
  >
    {tooltipContent}
  </Tooltip>
);

export default IconlessTooltip;
