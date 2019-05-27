import React from 'react';
import jsxToString from 'jsx-to-string';

const DemoRenderer = ({ children }) => (
  <div>
    <pre>{jsxToString(children)} </pre>
    { children }
  </div>
);

export default DemoRenderer;
