import React, { useRef } from 'react';
import { withRouter } from 'react-router';
import { routes } from '@constants';
import { addSearchParamsToUrl } from '@utils/searchParams';

const DialogLink = ({
  children, component, className, history, data,
}) => {
  const linkEl = useRef(null);
  const onClick = () => {
    addSearchParamsToUrl(history, { modal: component, ...data });
  };

  return (
    <div
      onClick={history.location.pathname === routes.reclaim.path && component !== 'send' ? () => {} : onClick}
      ref={linkEl}
      className={className}
    >
      { children }
    </div>
  );
};

export default withRouter(DialogLink);
