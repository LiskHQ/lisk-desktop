import React from 'react';
import PropTypes from 'prop-types';
import AppBar from 'react-toolbox/lib/app_bar';
import { Button, IconButton } from 'react-toolbox/lib/button';
import Input from 'react-toolbox/lib/input';
import Checkbox from 'react-toolbox/lib/checkbox';
import styles from '../main.css';
import grid from '../../node_modules/flexboxgrid/dist/flexboxgrid.css';

const Static = props => (
  <div>
    <div className={`${grid.row} ${styles.hasMarginBottom}`}>
      <div className={grid['col-xs-6']}>
        <div className={styles.box}>auto</div>
      </div>
      <div className={grid['col-xs-6']}>
        <div className={styles.box}>auto</div>
      </div>
    </div>
    <div className={grid.row}>
      <div className={grid['col-xs-4']}>
        <div className={styles.box}>auto</div>
      </div>
      <div className={grid['col-xs-4']}>
        <div className={styles.box}>auto</div>
      </div>
      <div className={grid['col-xs-4']}>
        <div className={styles.box}>auto</div>
      </div>
    </div>
    <AppBar title="React Toolbox" leftIcon="menu" rightIcon="add" />
    <h1>{props.txt}</h1>
    <Button icon="bookmark" label="Bookmark" raised primary />
    <Button icon="add" floating accent mini />
    <IconButton icon="favorite" accent />
    <IconButton icon="add" accent />
    <Button icon="add" label="Add this" flat primary />
    <Input type="text" label="Name" name="name" />
    <Input type="password" label="pass" name="pass" />
    <Checkbox checked={true} label="Checked option" />
    <Checkbox checked={false} label="Unchecked option" />
  </div>
);
Static.propTypes = {
  txt: PropTypes.string,
};
export default Static;
