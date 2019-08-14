import React from 'react';
import Icon, { icons } from '.';
import DemoRenderer from '../demoRenderer';
import styles from './demo.css';

const IconDemo = () => (
  <div className={styles.wrapper}>
    <h2>Icon</h2>
    { Object.keys(icons).map(name => (
      <DemoRenderer key={name}>
        <Icon name={name} />
      </DemoRenderer>
    )) }
  </div>
);

export default IconDemo;
