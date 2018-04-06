import React, { Fragment } from 'react';

const Renderer = ({ minutes, seconds, children }) => {
  const child = React.cloneElement(children, { minutes, seconds });
  return (<Fragment> {child} </Fragment>);
};

export default Renderer;
