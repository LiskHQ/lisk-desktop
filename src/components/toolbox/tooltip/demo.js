import React from 'react';
import Tooltip from './tooltip';
import DemoRenderer from '../demoRenderer';

const IllustrationDemo = () => (
  <React.Fragment>
    <h2>Tooltip</h2>
    <DemoRenderer>
      <Tooltip
        title="Tooltip title"
        className="showOnTop"
        footer={<a>Learn more</a>}
      >
        <p>
          Tooltip content
        </p>
      </Tooltip>
    </DemoRenderer>
    <DemoRenderer>
      <Tooltip
        alwaysShow
      >
        <p>
          Tooltip content
        </p>
      </Tooltip>
    </DemoRenderer>
    <DemoRenderer>
      <Tooltip
        title="Tooltip title"
        className="showOnBottom"
        content={<span>Something else than the icon</span>}
        footer={<a>Learn more</a>}
      >
        <p>
          Tooltip content
        </p>
      </Tooltip>
    </DemoRenderer>
  </React.Fragment>
);

export default IllustrationDemo;
