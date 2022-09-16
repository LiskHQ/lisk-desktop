import React, { useRef } from 'react';
import { withRouter } from 'react-router';
import { addSearchParamsToUrl, appendSearchParams } from 'src/utils/searchParams';

const DialogLink = ({
  children, component, className, history, data, path,
}) => {
  const linkEl = useRef(null);
  const onClick = () => {
    if(!path) {
      addSearchParamsToUrl(history, { modal: component, ...data });
    } else {
      const newSearchString = appendSearchParams(history.location.search, data);
      history.push(`${path}${newSearchString}`);
    }
  };

  return (
    <div
      onClick={onClick}
      ref={linkEl}
      className={className}
    >
      { children }
    </div>
  );
};

export default withRouter(DialogLink);
