import React from 'react';
import Tooltip from '../../toolbox/tooltip/tooltip';
import styles from './iconlessTooltip.css';

const IconlessTooltip = ({
  children, title, tooltipContent, className, tooltipClassName,
}) => {
  const tooltipClassNames = [
    tooltipClassName,
    className.includes('showOnLeft') && styles.showOnLeft,
    className.includes('showOnRight') && styles.showOnRight,
  ].join(' ');

  return (
    <Tooltip
      content={children}
      title={title}
      className={className}
      tooltipClassName={tooltipClassNames}
    >
      {tooltipContent}
    </Tooltip>
  );
};

export default IconlessTooltip;
