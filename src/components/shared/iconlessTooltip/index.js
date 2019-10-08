import React from 'react';
import Tooltip from '../../toolbox/tooltip/tooltip';

const IconlessTooltip = ({
  children, title, tooltipContent, className, tooltipClassName,
}) => (
  <Tooltip
    content={children}
    title={title}
    className={className}
    tooltipClassName={tooltipClassName}
  >
    {tooltipContent}
  </Tooltip>
);

export default IconlessTooltip;
