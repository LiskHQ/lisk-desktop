import React, { useRef } from 'react';
import { withRouter } from 'react-router';

import { addSearchParamToUrl } from '../../../utils/searchParams';

const DialogLink = ({
  children, component, className, history,
}) => {
  const linkEl = useRef(null);
  const onClick = () => {
    addSearchParamToUrl(history, 'modal', component);
  };

  return (
    <div onClick={onClick} ref={linkEl} className={className}>{ children }</div>
  );
};

export default withRouter(DialogLink);
