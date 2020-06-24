import React, { useRef } from 'react';
import DialogHolder from './holder';
import { modals } from '../../../constants/routes';

const DialogLink = ({
  children, component, className, data,
}) => {
  const linkEl = useRef(null);
  const onClick = () => {
    if (React.isValidElement(component)) {
      DialogHolder.showDialog(component);
    }

    if (typeof component === 'string' && modals[component]) {
      const Content = modals[component].component;
      DialogHolder.showDialog(<Content {...data} />);
    }
  };

  return (
    <div onClick={onClick} ref={linkEl} className={className}>{ children }</div>
  );
};

export default DialogLink;
