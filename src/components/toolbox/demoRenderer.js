import React from 'react';
import jsxToString from 'jsx-to-string';

const DemoRenderer = ({ children }) => (
  <div>
    <pre>{children.map ? children.map(jsxToString).join('\n') : jsxToString(children)} </pre>
    { children }
  </div>
);

export default DemoRenderer;
