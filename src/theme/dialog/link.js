import React, { useRef } from 'react';
import { withRouter } from 'react-router';
import { addSearchParamsToUrl } from 'src/utils/searchParams';

const DialogLink = ({ children, component, className, history, data }) => {
  const linkEl = useRef(null);

  const onClick = () => {
    addSearchParamsToUrl(history, { modal: component, ...data });
  };

  return (
    <div onClick={onClick} ref={linkEl} className={className}>
      {children}
    </div>
  );
};

export default withRouter(DialogLink);
