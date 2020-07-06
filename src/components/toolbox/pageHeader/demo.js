import React, { Fragment } from 'react';
import { PrimaryButton } from '../buttons';
import DemoRenderer from '../demoRenderer';
import PageHeader from '.';

const PageHeaderDemo = () => (
  <Fragment>
    <h2>PageHeader</h2>
    <DemoRenderer>
      <PageHeader
        title="Title"
        subtitle="Subtitle of the page"
      >
        <PrimaryButton>
          Some button
        </PrimaryButton>
      </PageHeader>
    </DemoRenderer>
  </Fragment>
);

export default PageHeaderDemo;
