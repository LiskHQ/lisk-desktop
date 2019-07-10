import React, { Fragment } from 'react';
import { PrimaryButtonV2 } from '../buttons/button';
import DemoRenderer from '../demoRenderer';
import PageHeader from './';

const PageHeaderDemo = () => (
  <Fragment>
    <h2>PageHeader</h2>
    <DemoRenderer>
      <PageHeader
        title={'Title'}
        subtitle={'Subtitle of the page'}
      >
        <PrimaryButtonV2>
          Some button
        </PrimaryButtonV2>
      </PageHeader>
    </DemoRenderer>
  </Fragment>
);

export default PageHeaderDemo;
