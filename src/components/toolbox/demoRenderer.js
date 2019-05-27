import React from 'react';
import jsxToString from 'jsx-to-string';

const DemoRenderer = ({ children }) => (
  <p>
    <label>{jsxToString(children)} </label>
    { children }
  </p>
);

export default DemoRenderer;
