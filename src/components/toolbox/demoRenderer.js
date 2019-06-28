import React from 'react';
import jsxToString from 'jsx-to-string';

export const DarkWrapper = ({ children }) => (
  <span style={{
    display: 'inline-block', background: '#0c152e', padding: 20,
  }}
  >
    {children}
  </span>
);

const DemoRenderer = ({ children }) => (
  <div>
    <pre>
      {children.map ? children.map(jsxToString).join('\n') : jsxToString(children)}
      {' '}
    </pre>
    { children }
  </div>
);

export default DemoRenderer;
