import React, { useRef } from 'react';
import { withRouter } from 'react-router';

import { addSearchParamsToUrl } from '../../../utils/searchParams';

const DialogLink = ({
  children, component, className, history, data,
}) => {
  const linkEl = useRef(null);
  const onClick = (evt) => {
    if (!evt.target.classList.contains('ignore-dialog-click')) {
      addSearchParamsToUrl(history, { modal: component, ...data });
    }
  };

  return (
    <div onClick={onClick} ref={linkEl} className={className}>{ children }</div>
  );
};

export default withRouter(DialogLink);
