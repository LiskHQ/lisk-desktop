import React from 'react';
import jsxToString from 'jsx-to-string';

const DemoRenderer = ({ children }) => (
  <p>
    <pre>{jsxToString(children)} </pre>
    { children }
  </p>
);

export default DemoRenderer;
