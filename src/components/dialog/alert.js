import { translate } from 'react-i18next';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Button } from '../toolbox/buttons/button';

const Alert = ({ text, closeDialog, t }) => (
  <div>
    <p className='alert-dialog-message'>{text}</p>
    <br />
    <section className={`${grid.row} ${grid['between-xs']}`}>
      <span />
      <Button label={t('Ok')} onClick={closeDialog} className='ok-button'/>
    </section>
  </div>
);

export default translate()(Alert);
